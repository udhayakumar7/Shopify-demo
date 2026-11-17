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
} from "./customer";

const STORE_DOMAIN =
  import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || "harini-zyh1hfkx.myshopify.com";

let cachedApiEndpoint = null;

/**
 * Dynamically discover the Customer Account GraphQL endpoint.
 */
export async function getCustomerApiEndpoint() {
  if (cachedApiEndpoint) return cachedApiEndpoint;

  const discoveryUrl = `https://${STORE_DOMAIN}/.well-known/customer-account-api`;
  const response = await fetch(discoveryUrl);

  if (!response.ok) {
    throw new Error(
      `Unable to discover Customer Account API (HTTP ${response.status})`
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
 * @param {string} query GraphQL query or mutation string
 * @param {object} variables Query/mutation variables
 * @returns {Promise<any>}
 */
export async function customerFetch(query, variables = {}) {
  const token = getCustomerAccessToken();

  if (!token) {
    throw new Error("Customer is not signed in. Please log in to continue.");
  }

  const endpoint = await getCustomerApiEndpoint();

  const response = await fetch(endpoint, {
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

  const result = await response.json();

  if (!response.ok || result.errors) {
    const errorMsg =
      result.errors?.map((err) => err.message).join(", ") ||
      `Customer Account API request failed (HTTP ${response.status})`;

    // If token is invalid or expired on the server, clear local session
    if (
      response.status === 401 ||
      errorMsg.toLowerCase().includes("unauthorized") ||
      errorMsg.toLowerCase().includes("invalid access token") ||
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
   2. Customer Orders
   ========================================================================== */

const CUSTOMER_ORDERS_QUERY = `
  query GetCustomerOrders($first: Int!) {
    customer {
      orders(first: $first, sortKey: PROCESSED_AT, reverse: true) {
        nodes {
          id
          name
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
 * @param {number} [limit=10]
 */
export async function getCustomerOrders(limit = 10) {
  const data = await customerFetch(CUSTOMER_ORDERS_QUERY, { first: limit });
  const rawOrders = data?.customer?.orders?.nodes || [];

  return rawOrders.map((order) => ({
    id: order.id,
    name: order.name,
    orderNumber: order.name?.replace(/^#/, "") || order.id,
    processedAt: order.processedAt,
    financialStatus: order.financialStatus || "PENDING",
    fulfillmentStatus: order.fulfillmentStatus || "UNFULFILLED",
    totalPrice: {
      amount: order.totalPrice?.amount || "0",
      currencyCode: order.totalPrice?.currencyCode || "INR",
    },
    lineItems: (order.lineItems?.nodes || []).map((item) => ({
      id: item.id,
      title: item.title,
      variantTitle: item.variantTitle,
      quantity: item.quantity,
      image: item.image?.url || null,
      price: {
        amount: item.totalPrice?.amount || "0",
        currencyCode: item.totalPrice?.currencyCode || "INR",
      },
    })),
  }));
}

/* ==========================================================================
   3. Customer Addresses
   ========================================================================== */

const CUSTOMER_ADDRESSES_QUERY = `
  query GetCustomerAddresses {
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
      addresses(first: 20) {
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
 */
export async function getCustomerAddresses() {
  const data = await customerFetch(CUSTOMER_ADDRESSES_QUERY);
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
