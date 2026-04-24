import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ShopifyService {
  private readonly apiUrl = `https://${environment.shopifyStoreDomain}/api/2025-01/graphql.json`;
  private collectionsCache: {
    data: {
      collections: {
        nodes: Array<{
          id: string;
          handle: string;
          title: string;
          description: string;
          image: { url: string; altText: string | null } | null;
        }>;
      };
    } | null;
    promise: Promise<{
      collections: {
        nodes: Array<{
          id: string;
          handle: string;
          title: string;
          description: string;
          image: { url: string; altText: string | null } | null;
        }>;
      };
    }> | null;
  } = { data: null, promise: null };
  private collectionByHandleCache = new Map<string, {
    data: unknown | null;
    promise: Promise<unknown> | null;
  }>();
  private productsCache: {
    data: unknown | null;
    promise: Promise<unknown> | null;
  } = { data: null, promise: null };

  constructor(private http: HttpClient) {}

  private async request<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': environment.shopifyStorefrontToken,
    });

    const body = { query, variables };
    const response = await firstValueFrom(
      this.http.post<{ data?: T; errors?: Array<{ message: string }> }>(this.apiUrl, body, { headers }),
    );
    if (response.errors?.length) {
      throw new Error(response.errors.map((error) => error.message).join(' | '));
    }
    if (!response.data) {
      throw new Error('Respuesta vacia de Shopify Storefront API');
    }
    return response.data;
  }

  getCollections() {
    if (this.collectionsCache.data) {
      return Promise.resolve(this.collectionsCache.data);
    }
    if (this.collectionsCache.promise) {
      return this.collectionsCache.promise;
    }
    this.collectionsCache.promise = this.request<{
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
    `).then((data) => {
      this.collectionsCache.data = data;
      this.collectionsCache.promise = null;
      return data;
    }).catch((error) => {
      this.collectionsCache.promise = null;
      throw error;
    });
    return this.collectionsCache.promise;
  }

  prefetchCollections(): void {
    void this.getCollections();
  }

  getCollectionByHandle(handle: string) {
    const cached = this.collectionByHandleCache.get(handle);
    if (cached?.data) {
      return Promise.resolve(cached.data as {
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
              metafields: Array<{ namespace: string; key: string; value: string } | null>;
              featuredImage: { url: string; altText: string | null } | null;
              priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
            }>;
          };
        } | null;
      });
    }
    if (cached?.promise) {
      return cached.promise as Promise<{
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
              metafields: Array<{ namespace: string; key: string; value: string } | null>;
              featuredImage: { url: string; altText: string | null } | null;
              priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
            }>;
          };
        } | null;
      }>;
    }

    const requestPromise = this.request<{
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
            metafields: Array<{ namespace: string; key: string; value: string } | null>;
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
              metafields(identifiers: [
                { namespace: "custom", key: "material" },
                { namespace: "custom", key: "dimensions" },
                { namespace: "custom", key: "artist" },
                { namespace: "custom", key: "technique" },
                { namespace: "custom", key: "year" },
                { namespace: "custom", key: "vendido_sergio" },
                { namespace: "custom", key: "tipo" },
                { namespace: "custom", key: "descripcion" },
                { namespace: "custom", key: "tallas-sergio" },
                { namespace: "custom", key: "nuevo_sergio" },
                { namespace: "custom", key: "descuento-sergio" },
                { namespace: "custom", key: "especial" },
                { namespace: "custom", key: "detallesc" },
                { namespace: "custom", key: "detallesb" },
                { namespace: "custom", key: "detalles" },
                { namespace: "custom", key: "obciones-cuadro-personal" },
                { namespace: "details", key: "material" },
                { namespace: "details", key: "dimensions" },
                { namespace: "details", key: "artist" },
                { namespace: "details", key: "origin" }
              ]) { namespace key value }
              featuredImage { url altText }
              priceRange { minVariantPrice { amount currencyCode } }
            }
          }
        }
      }
      `,
      { handle },
    ).then((data) => {
      this.collectionByHandleCache.set(handle, { data, promise: null });
      return data;
    }).catch((error) => {
      this.collectionByHandleCache.delete(handle);
      throw error;
    });

    this.collectionByHandleCache.set(handle, { data: null, promise: requestPromise });
    return requestPromise;
  }

  prefetchCollectionDetails(handles: string[]): void {
    for (const handle of [...new Set(handles)].slice(0, 3)) {
      if (handle) {
        void this.getCollectionByHandle(handle);
      }
    }
  }

  getProducts() {
    if (this.productsCache.data) {
      return Promise.resolve(this.productsCache.data as {
        products: {
          nodes: Array<{
            id: string;
            handle: string;
            title: string;
            description: string;
            tags: string[];
            availableForSale: boolean;
            metafields: Array<{ namespace: string; key: string; value: string } | null>;
            featuredImage: { url: string; altText: string | null } | null;
            priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
            variants: { nodes: Array<{ id: string; title: string }> };
          }>;
        };
      });
    }
    if (this.productsCache.promise) {
      return this.productsCache.promise as Promise<{
        products: {
          nodes: Array<{
            id: string;
            handle: string;
            title: string;
            description: string;
            tags: string[];
            availableForSale: boolean;
            metafields: Array<{ namespace: string; key: string; value: string } | null>;
            featuredImage: { url: string; altText: string | null } | null;
            priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
            variants: { nodes: Array<{ id: string; title: string }> };
          }>;
        };
      }>;
    }
    const requestPromise = this.request<{
      products: {
        nodes: Array<{
          id: string;
          handle: string;
          title: string;
          description: string;
          tags: string[];
          availableForSale: boolean;
          metafields: Array<{ namespace: string; key: string; value: string } | null>;
          featuredImage: { url: string; altText: string | null } | null;
          priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
          variants: { nodes: Array<{ id: string; title: string }> };
        }>;
      };
    }>(`
      query GetProducts {
        products(first: 16) {
          nodes {
            id handle title description tags availableForSale
            metafields(identifiers: [
              { namespace: "custom", key: "material" },
              { namespace: "custom", key: "dimensions" },
              { namespace: "custom", key: "artist" },
              { namespace: "custom", key: "technique" },
              { namespace: "custom", key: "year" },
              { namespace: "custom", key: "vendido_sergio" },
              { namespace: "custom", key: "tipo" },
              { namespace: "custom", key: "descripcion" },
              { namespace: "custom", key: "tallas-sergio" },
              { namespace: "custom", key: "nuevo_sergio" },
              { namespace: "custom", key: "descuento-sergio" },
              { namespace: "custom", key: "especial" },
              { namespace: "custom", key: "detallesc" },
              { namespace: "custom", key: "detallesb" },
              { namespace: "custom", key: "detalles" },
              { namespace: "custom", key: "obciones-cuadro-personal" },
              { namespace: "details", key: "material" },
              { namespace: "details", key: "dimensions" },
              { namespace: "details", key: "artist" },
              { namespace: "details", key: "origin" }
            ]) { namespace key value }
            featuredImage { url altText }
            priceRange { minVariantPrice { amount currencyCode } }
            variants(first: 1) { nodes { id title } }
          }
        }
      }
    `).then((data) => {
      this.productsCache.data = data;
      this.productsCache.promise = null;
      return data;
    }).catch((error) => {
      this.productsCache.promise = null;
      throw error;
    });
    this.productsCache.promise = requestPromise;
    return requestPromise;
  }

  prefetchProducts(): void {
    void this.getProducts();
  }

  getProductByHandle(handle: string) {
    return this.request<{
      product: {
        id: string;
        handle: string;
        title: string;
        description: string;
        tags: string[];
        availableForSale: boolean;
        featuredImage: { url: string; altText: string | null } | null;
        priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
        variants: { nodes: Array<{ id: string; title: string }> };
        metafields: Array<{ namespace: string; key: string; value: string } | null>;
      } | null;
    }>(
      `
      query GetProductByHandle($handle: String!) {
        product(handle: $handle) {
          id handle title description tags availableForSale
          featuredImage { url altText }
          priceRange { minVariantPrice { amount currencyCode } }
          variants(first: 10) { nodes { id title } }
          metafields(identifiers: [
            { namespace: "custom", key: "material" },
            { namespace: "custom", key: "dimensions" },
            { namespace: "custom", key: "artist" },
            { namespace: "custom", key: "technique" },
            { namespace: "custom", key: "year" },
            { namespace: "custom", key: "vendido_sergio" },
            { namespace: "custom", key: "tipo" },
            { namespace: "custom", key: "descripcion" },
            { namespace: "custom", key: "tallas-sergio" },
            { namespace: "custom", key: "nuevo_sergio" },
            { namespace: "custom", key: "descuento-sergio" },
            { namespace: "custom", key: "especial" },
            { namespace: "custom", key: "detallesc" },
            { namespace: "custom", key: "detallesb" },
            { namespace: "custom", key: "detalles" },
            { namespace: "custom", key: "obciones-cuadro-personal" },
            { namespace: "details", key: "material" },
            { namespace: "details", key: "dimensions" },
            { namespace: "details", key: "artist" },
            { namespace: "details", key: "origin" }
          ]) { namespace key value }
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

  async getMediaImageUrls(ids: string[]): Promise<Record<string, string>> {
    const cleanIds = [...new Set(ids.filter((id) => id.startsWith('gid://shopify/MediaImage/')))];
    if (!cleanIds.length) return {};

    const data = await this.request<{
      nodes: Array<{ id: string; image: { url: string | null } | null } | null>;
    }>(
      `
      query GetMediaImageUrls($ids: [ID!]!) {
        nodes(ids: $ids) {
          ... on MediaImage {
            id
            image {
              url
            }
          }
        }
      }
      `,
      { ids: cleanIds },
    );

    const map: Record<string, string> = {};
    for (const node of data.nodes) {
      if (node?.id && node.image?.url) {
        map[node.id] = node.image.url;
      }
    }
    return map;
  }
}
