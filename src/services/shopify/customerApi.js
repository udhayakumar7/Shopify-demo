/**
 * Shopify Customer Account GraphQL API Service
 *
 * Provides authenticated customer queries and mutations against Shopify's
 * Customer Account API (version 2026-10).
 * Handles customer profile retrieval, order history, and address book CRUD.
 */

import {
  getCustomerAccessToken,
  clearCustomerSession,
} from "./customer.js";

const env =
  (typeof import.meta !== "undefined" && import.meta.env) ||
  (typeof globalThis !== "undefined" ? globalThis.process?.env : null) ||
  {};

const STORE_DOMAIN =
  env.VITE_SHOPIFY_STORE_DOMAIN || "harini-zyh1hfkx.myshopify.com";

let cachedApiEndpoint = null;

/**
 * Dynamically discover the Customer Account GraphQL endpoint.
 * Preserves the documented Shopify discovery endpoint: /.well-known/customer-account-api
 */
export async function getCustomerApiEndpoint() {
  if (cachedApiEndpoint) return cachedApiEndpoint;

  const discoveryUrl = `https://${STORE_DOMAIN}/.well-known/customer-account-api`;
  const response = await fetch(discoveryUrl);

  if (!response.ok) {
    throw new Error(
      `Unable to discover Customer Account API endpoint (HTTP ${response.status})`
    );
  }

  const config = await response.json();
  if (!config.graphql_api) {
    throw new Error(
      "Customer Account GraphQL endpoint not found in discovery response."
    );
  }

  cachedApiEndpoint = config.graphql_api;
  return cachedApiEndpoint;
}

/**
 * Reusable authenticated Customer Account API GraphQL fetcher.
 * Preserves the documented GraphQL authorization header ('Authorization: <access_token>').
 * @param {string} query GraphQL query or mutation string
 * @param {object} [variables={}] Query/mutation variables
 * @returns {Promise<any>}
 */
export async function customerFetch(query, variables = {}) {
  const token = getCustomerAccessToken();

  if (!token) {
    throw new Error("Customer is not signed in. Please log in to continue.");
  }

  const endpoint = await getCustomerApiEndpoint();

  let response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });
  } catch (networkErr) {
    console.error("[Customer API Network Error]:", networkErr);
    throw new Error(
      "Network connection to Customer Account API failed. Please check your internet connection.",
      { cause: networkErr }
    );
  }

  // Handle HTTP errors
  if (!response.ok) {
    let httpErrorMsg = `Customer Account API request failed with HTTP ${response.status}`;
    try {
      const errJson = await response.json();
      if (errJson?.errors?.length) {
        httpErrorMsg = errJson.errors.map((e) => e.message).join(", ");
      } else if (errJson?.message) {
        httpErrorMsg = errJson.message;
      }
    } catch {
      // Body is not JSON
    }

    if (response.status === 401) {
      clearCustomerSession();
    }

    console.error("[Customer API HTTP Error]:", httpErrorMsg, { query, variables });
    throw new Error(httpErrorMsg);
  }

  const result = await response.json();

  // Handle GraphQL level errors
  if (result.errors?.length) {
    const errorMsg = result.errors.map((err) => err.message).join(", ");

    if (
      errorMsg.toLowerCase().includes("unauthorized") ||
      errorMsg.toLowerCase().includes("invalid access token") ||
      errorMsg.toLowerCase().includes("access denied") ||
      errorMsg.toLowerCase().includes("expired")
    ) {
      clearCustomerSession();
    }

    console.error("[Customer API GraphQL Error]:", errorMsg, { query, variables });
    throw new Error(errorMsg);
  }

  return result.data;
}

/* ==========================================================================
   1. Customer Profile
   ========================================================================== */

const CUSTOMER_PROFILE_QUERY = `
  query GetCustomerProfile {
    customer {
      id
      firstName
      lastName
      displayName
      emailAddress {
        emailAddress
      }
      phoneNumber {
        phoneNumber
      }
    }
  }
`;

/**
 * Retrieve authenticated customer's profile details.
 */
export async function getCustomerProfile() {
  const data = await customerFetch(CUSTOMER_PROFILE_QUERY);
  const cust = data?.customer;

  if (!cust) return null;

  return {
    id: cust.id,
    firstName: cust.firstName || "",
    lastName: cust.lastName || "",
    displayName:
      cust.displayName ||
      [cust.firstName, cust.lastName].filter(Boolean).join(" ") ||
      "Harini Patron",
    email: cust.emailAddress?.emailAddress || "",
    phone: cust.phoneNumber?.phoneNumber || "",
  };
}

/* ==========================================================================
   2. Customer Orders with Pagination & Correct Currency
   ========================================================================== */

const CUSTOMER_ORDERS_QUERY = `
  query GetCustomerOrders($first: Int!, $after: String) {
    customer {
      orders(first: $first, after: $after, sortKey: PROCESSED_AT, reverse: true) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          name
          number
          processedAt
          financialStatus
          fulfillmentStatus
          totalPrice {
            amount
            currencyCode
          }
          lineItems(first: 25) {
            nodes {
              id
              title
              quantity
              variantTitle
              image {
                url
                altText
              }
              totalPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * Retrieve past orders belonging to the authenticated customer.
 * Implements cursor-based pagination and preserves exact API-provided currencies (no hardcoded INR fallback).
 * @param {number} [limit=10] Maximum orders per page (1 to 50)
 * @param {string|null} [after=null] Pagination cursor
 * @returns {Promise<{ orders: Array, pageInfo: { hasNextPage: boolean, endCursor: string|null } }>}
 */
export async function getCustomerOrders(limit = 10, after = null) {
  const safeLimit = Math.min(Math.max(1, Number(limit) || 10), 50);

  const data = await customerFetch(CUSTOMER_ORDERS_QUERY, {
    first: safeLimit,
    after: after || null,
  });

  const ordersConnection = data?.customer?.orders;
  const rawOrders = ordersConnection?.nodes || [];

  const orders = rawOrders.map((order) => ({
    id: order.id,
    name: order.name,
    orderNumber: order.name?.replace(/^#/, "") || String(order.number || order.id),
    processedAt: order.processedAt,
    financialStatus: order.financialStatus || "PENDING",
    fulfillmentStatus: order.fulfillmentStatus || "UNFULFILLED",
    totalPrice: {
      amount: order.totalPrice?.amount ?? null,
      currencyCode: order.totalPrice?.currencyCode ?? "",
    },
    lineItems: (order.lineItems?.nodes || []).map((item) => ({
      id: item.id,
      title: item.title,
      variantTitle: item.variantTitle,
      quantity: item.quantity,
      image: item.image?.url || null,
      price: {
        amount: item.totalPrice?.amount ?? null,
        currencyCode: item.totalPrice?.currencyCode ?? "",
      },
    })),
  }));

  return {
    orders,
    pageInfo: {
      hasNextPage: Boolean(ordersConnection?.pageInfo?.hasNextPage),
      endCursor: ordersConnection?.pageInfo?.endCursor || null,
    },
  };
}

/* ==========================================================================
   3. Customer Addresses
   ========================================================================== */

const CUSTOMER_ADDRESSES_QUERY = `
  query GetCustomerAddresses($first: Int!) {
    customer {
      defaultAddress {
        id
        formatted
        firstName
        lastName
        company
        address1
        address2
        city
        zoneCode
        zip
        phoneNumber
        countryCode
      }
      addresses(first: $first) {
        nodes {
          id
          formatted
          firstName
          lastName
          company
          address1
          address2
          city
          zoneCode
          zip
          phoneNumber
          countryCode
        }
      }
    }
  }
`;

/**
 * Retrieve all saved addresses and the default address.
 * @param {number} [limit=20]
 */
export async function getCustomerAddresses(limit = 20) {
  const safeLimit = Math.min(Math.max(1, Number(limit) || 20), 50);
  const data = await customerFetch(CUSTOMER_ADDRESSES_QUERY, { first: safeLimit });

  const defaultAddress = data?.customer?.defaultAddress || null;
  const addresses = data?.customer?.addresses?.nodes || [];

  return {
    defaultAddress,
    addresses,
  };
}

const CUSTOMER_ADDRESS_CREATE_MUTATION = `
  mutation CustomerAddressCreate($address: CustomerAddressInput!, $defaultAddress: Boolean) {
    customerAddressCreate(address: $address, defaultAddress: $defaultAddress) {
      customerAddress {
        id
        formatted
        firstName
        lastName
        company
        address1
        address2
        city
        zoneCode
        zip
        phoneNumber
        countryCode
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

/**
 * Add a new mailing address to the customer's address book.
 * @param {object} addressInput CustomerAddressInput object
 * @param {boolean} [setAsDefault=false]
 */
export async function createCustomerAddress(addressInput, setAsDefault = false) {
  const data = await customerFetch(CUSTOMER_ADDRESS_CREATE_MUTATION, {
    address: addressInput,
    defaultAddress: Boolean(setAsDefault),
  });

  const result = data?.customerAddressCreate;
  if (result?.userErrors?.length > 0) {
    const errorMsg = result.userErrors.map((err) => err.message).join(", ");
    throw new Error(errorMsg);
  }

  return result?.customerAddress;
}

const CUSTOMER_ADDRESS_UPDATE_MUTATION = `
  mutation CustomerAddressUpdate($addressId: ID!, $address: CustomerAddressInput!, $defaultAddress: Boolean) {
    customerAddressUpdate(addressId: $addressId, address: $address, defaultAddress: $defaultAddress) {
      customerAddress {
        id
        formatted
        firstName
        lastName
        company
        address1
        address2
        city
        zoneCode
        zip
        phoneNumber
        countryCode
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

/**
 * Update an existing mailing address.
 * @param {string} addressId
 * @param {object} addressInput
 * @param {boolean} [setAsDefault=false]
 */
export async function updateCustomerAddress(
  addressId,
  addressInput,
  setAsDefault = false
) {
  const data = await customerFetch(CUSTOMER_ADDRESS_UPDATE_MUTATION, {
    addressId,
    address: addressInput,
    defaultAddress: Boolean(setAsDefault),
  });

  const result = data?.customerAddressUpdate;
  if (result?.userErrors?.length > 0) {
    const errorMsg = result.userErrors.map((err) => err.message).join(", ");
    throw new Error(errorMsg);
  }

  return result?.customerAddress;
}

const CUSTOMER_ADDRESS_DELETE_MUTATION = `
  mutation CustomerAddressDelete($addressId: ID!) {
    customerAddressDelete(addressId: $addressId) {
      deletedAddressId
      userErrors {
        field
        message
        code
      }
    }
  }
`;

/**
 * Remove an address from the customer's address book.
 * @param {string} addressId
 */
export async function deleteCustomerAddress(addressId) {
  const data = await customerFetch(CUSTOMER_ADDRESS_DELETE_MUTATION, {
    addressId,
  });

  const result = data?.customerAddressDelete;
  if (result?.userErrors?.length > 0) {
    const errorMsg = result.userErrors.map((err) => err.message).join(", ");
    throw new Error(errorMsg);
  }

  return result?.deletedAddressId;
}

/**
 * Mark a saved address as the customer's default address.
 * @param {string} addressId
 * @param {object} currentAddress
 */
export async function setDefaultCustomerAddress(addressId, currentAddress = {}) {
  const addressPayload = {
    firstName: currentAddress.firstName || "",
    lastName: currentAddress.lastName || "",
    company: currentAddress.company || "",
    address1: currentAddress.address1 || "",
    address2: currentAddress.address2 || "",
    city: currentAddress.city || "",
    zoneCode: currentAddress.zoneCode || "",
    zip: currentAddress.zip || "",
    phoneNumber: currentAddress.phoneNumber || "",
    countryCode: currentAddress.countryCode || "IN",
  };

  return updateCustomerAddress(addressId, addressPayload, true);
}
