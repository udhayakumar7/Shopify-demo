/**
 * Reusable GraphQL queries and fragments for Shopify Storefront API.
 */

export const PRODUCT_CARD_FIELDS = `
  id
  title
  handle
  description
  availableForSale
  productType
  vendor
  tags
  featuredImage {
    url
    altText
    width
    height
  }
  images(first: 5) {
    nodes {
      url
      altText
    }
  }
  priceRange {
    minVariantPrice {
      amount
      currencyCode
    }
    maxVariantPrice {
      amount
      currencyCode
    }
  }
  compareAtPriceRange {
    minVariantPrice {
      amount
      currencyCode
    }
    maxVariantPrice {
      amount
      currencyCode
    }
  }
  options(first: 5) {
    name
    values
  }
  variants(first: 20) {
    nodes {
      id
      title
      availableForSale
      sku
      selectedOptions {
        name
        value
      }
      price {
        amount
        currencyCode
      }
      compareAtPrice {
        amount
        currencyCode
      }
    }
  }
  metafields(
    identifiers: [
      { namespace: "shopify", key: "color-pattern" }
      { namespace: "shopify", key: "size" }
      { namespace: "shopify", key: "fabric" }
      { namespace: "shopify", key: "neckline" }
      { namespace: "shopify", key: "sleeve-length-type" }
      { namespace: "shopify", key: "age-group" }
      { namespace: "shopify", key: "size-type" }
      { namespace: "shopify", key: "target-gender" }
      { namespace: "custom", key: "best_seller" }
      { namespace: "custom", key: "new_arrival" }
      { namespace: "custom", key: "is_new_arrival" }
      { namespace: "custom", key: "is_best_seller" }
      { namespace: "custom", key: "badge" }
      { namespace: "custom", key: "fabric" }
      { namespace: "custom", key: "color" }
      { namespace: "custom", key: "saree_type" }
      { namespace: "custom", key: "occasion" }
      { namespace: "custom", key: "work_type" }
      { namespace: "custom", key: "pattern" }
      { namespace: "custom", key: "blouse_included" }
      { namespace: "custom", key: "care_instructions" }
      { namespace: "custom", key: "kurti_type" }
      { namespace: "custom", key: "fit_type" }
      { namespace: "custom", key: "sleeve_type" }
    ]
  ) {
    namespace
    key
    value
    type
    references(first: 10) {
      nodes {
        ... on Metaobject {
          id
          handle
          type
          fields {
            key
            value
          }
        }
      }
    }
  }
`;

export const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  cost {
    subtotalAmount {
      amount
      currencyCode
    }
    totalAmount {
      amount
      currencyCode
    }
    totalTaxAmount {
      amount
      currencyCode
    }
  }
  lines(first: 50) {
    edges {
      node {
        id
        quantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        merchandise {
          ... on ProductVariant {
            id
            title
            sku
            availableForSale
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            product {
              id
              title
              handle
              productType
              featuredImage {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $after: String, $query: String, $sortKey: ProductSortKeys, $reverse: Boolean) {
    products(first: $first, after: $after, query: $query, sortKey: $sortKey, reverse: $reverse) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        cursor
        node {
          ${PRODUCT_CARD_FIELDS}
        }
      }
    }
  }
`;

export const GET_PRODUCT_DETAILS_QUERY = `
  query GetProductDetails($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      availableForSale
      productType
      vendor
      tags
      featuredImage {
        url
        altText
        width
        height
      }
      images(first: 10) {
        nodes {
          url
          altText
          width
          height
        }
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      compareAtPriceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      options(first: 5) {
        name
        values
      }
      variants(first: 50) {
        nodes {
          id
          title
          availableForSale
          sku
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          image {
            url
            altText
          }
        }
      }
      collections(first: 5) {
        nodes {
          id
          title
          handle
        }
      }
      metafields(
        identifiers: [
          { namespace: "shopify", key: "color-pattern" }
          { namespace: "shopify", key: "size" }
          { namespace: "shopify", key: "fabric" }
          { namespace: "shopify", key: "neckline" }
          { namespace: "shopify", key: "sleeve-length-type" }
          { namespace: "shopify", key: "age-group" }
          { namespace: "shopify", key: "size-type" }
          { namespace: "shopify", key: "target-gender" }
          { namespace: "custom", key: "fabric" }
          { namespace: "custom", key: "color" }
          { namespace: "custom", key: "saree_type" }
          { namespace: "custom", key: "saree_length" }
          { namespace: "custom", key: "blouse_included" }
          { namespace: "custom", key: "work_type" }
          { namespace: "custom", key: "pattern" }
          { namespace: "custom", key: "occasion" }
          { namespace: "custom", key: "care_instructions" }
          { namespace: "custom", key: "kurti_type" }
          { namespace: "custom", key: "fit_type" }
          { namespace: "custom", key: "sleeve_type" }
          { namespace: "custom", key: "set_type" }
          { namespace: "custom", key: "best_seller" }
          { namespace: "custom", key: "new_arrival" }
          { namespace: "custom", key: "is_new_arrival" }
          { namespace: "custom", key: "is_best_seller" }
          { namespace: "custom", key: "badge" }
        ]
      ) {
        namespace
        key
        value
        type
        references(first: 10) {
          nodes {
            ... on Metaobject {
              id
              handle
              type
              fields {
                key
                value
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_COLLECTIONS_QUERY = `
  query GetCollections($first: Int!) {
    collections(first: $first) {
      nodes {
        id
        title
        handle
        description
        image {
          url
          altText
        }
        products(first: 5) {
          nodes {
            productType
          }
        }
      }
    }
  }
`;

export const GET_COLLECTION_PRODUCTS_QUERY = `
  query GetCollectionProducts(
    $handle: String!
    $first: Int!
    $after: String
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $filters: [ProductFilter!]
  ) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      image {
        url
        altText
      }
      products(first: $first, after: $after, sortKey: $sortKey, reverse: $reverse, filters: $filters) {
        filters {
          id
          label
          type
          values {
            id
            label
            count
            input
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          cursor
          node {
            ${PRODUCT_CARD_FIELDS}
          }
        }
      }
    }
  }
`;

export const SEARCH_PRODUCTS_QUERY = `
  query SearchProducts($query: String!, $first: Int!) {
    search(query: $query, first: $first, types: [PRODUCT]) {
      nodes {
        ... on Product {
          ${PRODUCT_CARD_FIELDS}
        }
      }
    }
  }
`;

export const GET_CART_QUERY = `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      ${CART_FIELDS}
    }
  }
`;
