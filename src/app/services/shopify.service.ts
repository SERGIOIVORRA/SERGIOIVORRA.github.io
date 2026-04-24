import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ShopifyService {
  private readonly apiUrl = `https://${environment.shopifyStoreDomain}/api/2025-01/graphql.json`;

  constructor(private http: HttpClient) {}

  private async request<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': environment.shopifyStorefrontToken,
    });

    const body = { query, variables };
    const response = await firstValueFrom(this.http.post<{ data: T }>(this.apiUrl, body, { headers }));
    return response.data;
  }

  getCollections() {
    return this.request<{
      collections: {
        nodes: Array<{
          id: string;
          handle: string;
          title: string;
          description: string;
          image: { url: string; altText: string | null } | null;
        }>;
      };
    }>(`
      query GetCollections {
        collections(first: 12) {
          nodes {
            id
            handle
            title
            description
            image { url altText }
          }
        }
      }
    `);
  }

  getCollectionByHandle(handle: string) {
    return this.request<{
      collection: {
        id: string;
        handle: string;
        title: string;
        description: string;
        products: {
          nodes: Array<{
            id: string;
            handle: string;
            title: string;
            tags: string[];
            availableForSale: boolean;
            productType: string;
            vendor: string;
            featuredImage: { url: string; altText: string | null } | null;
            priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
          }>;
        };
      } | null;
    }>(
      `
      query GetCollectionByHandle($handle: String!) {
        collection(handle: $handle) {
          id
          handle
          title
          description
          products(first: 40) {
            nodes {
              id
              handle
              title
              tags
              availableForSale
              productType
              vendor
              featuredImage { url altText }
              priceRange { minVariantPrice { amount currencyCode } }
            }
          }
        }
      }
      `,
      { handle },
    );
  }

  getProducts() {
    return this.request<{
      products: {
        nodes: Array<{
          id: string;
          handle: string;
          title: string;
          description: string;
          tags: string[];
          featuredImage: { url: string; altText: string | null } | null;
          priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
          variants: { nodes: Array<{ id: string; title: string }> };
        }>;
      };
    }>(`
      query GetProducts {
        products(first: 16) {
          nodes {
            id handle title description tags
            featuredImage { url altText }
            priceRange { minVariantPrice { amount currencyCode } }
            variants(first: 1) { nodes { id title } }
          }
        }
      }
    `);
  }

  getProductByHandle(handle: string) {
    return this.request<{
      product: {
        id: string;
        handle: string;
        title: string;
        description: string;
        tags: string[];
        featuredImage: { url: string; altText: string | null } | null;
        priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
        variants: { nodes: Array<{ id: string; title: string }> };
        metafields: Array<{ namespace: string; key: string; value: string } | null>;
      } | null;
    }>(
      `
      query GetProductByHandle($handle: String!) {
        product(handle: $handle) {
          id handle title description tags
          featuredImage { url altText }
          priceRange { minVariantPrice { amount currencyCode } }
          variants(first: 10) { nodes { id title } }
          metafields(identifiers: [
            { namespace: "custom", key: "material" },
            { namespace: "custom", key: "dimensions" },
            { namespace: "custom", key: "artist" },
            { namespace: "custom", key: "technique" },
            { namespace: "custom", key: "year" },
            { namespace: "details", key: "material" },
            { namespace: "details", key: "dimensions" },
            { namespace: "details", key: "artist" },
            { namespace: "details", key: "origin" }
          ]) {
            namespace
            key
            value
          }
        }
      }
    `,
      { handle },
    );
  }

  createCart(merchandiseId: string) {
    return this.request<{
      cartCreate: { cart: { id: string; checkoutUrl: string } };
    }>(
      `
      mutation CreateCart($merchandiseId: ID!) {
        cartCreate(input: { lines: [{ merchandiseId: $merchandiseId, quantity: 1 }] }) {
          cart { id checkoutUrl }
        }
      }
    `,
      { merchandiseId },
    );
  }

  addCartLine(cartId: string, merchandiseId: string) {
    return this.request<{
      cartLinesAdd: { cart: { checkoutUrl: string } };
    }>(
      `
      mutation AddLine($cartId: ID!, $merchandiseId: ID!) {
        cartLinesAdd(cartId: $cartId, lines: [{ merchandiseId: $merchandiseId, quantity: 1 }]) {
          cart { checkoutUrl }
        }
      }
    `,
      { cartId, merchandiseId },
    );
  }
}
