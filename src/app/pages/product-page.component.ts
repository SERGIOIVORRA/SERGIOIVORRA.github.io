import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CartService } from '../services/cart.service';
import { ShopifyService } from '../services/shopify.service';

type Product = {
  handle?: string;
  title: string;
  description: string;
  tags: string[];
  featuredImage: { url: string; altText: string | null } | null;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  variants: { nodes: Array<{ id: string; title: string }> };
  metafields?: Array<{ namespace: string; key: string; value: string } | null>;
};

@Component({
  standalone: true,
  selector: 'app-product-page',
  imports: [CurrencyPipe, RouterLink],
  template: `
    @if (product(); as p) {
      <article class="product">
        @if (p.featuredImage) {
          <img [src]="p.featuredImage.url" [alt]="p.featuredImage.altText || p.title" />
        }
        <div>
          <h1>{{ p.title }}</h1>
          <div class="tag-list">
            @for (tag of topTags(p.tags); track tag) {
              <span class="tag">{{ tag }}</span>
            }
          </div>
          <p class="description">{{ p.description }}</p>
          <strong>{{ p.priceRange.minVariantPrice.amount | currency:p.priceRange.minVariantPrice.currencyCode:'symbol':'1.2-2' }}</strong>
          <div>
            <button (click)="addToCart(p)">+ ANADIR AL CARRITO</button>
          </div>
        </div>
      </article>

      @if (extraInfo().length > 0) {
        <section class="meta-section">
          <h2>* EXTRA INFO</h2>
          <div class="meta-grid">
            @for (field of extraInfo(); track field.label) {
              <article class="meta-card">
                <small>{{ field.label }}</small>
                <p>{{ field.value }}</p>
              </article>
            }
          </div>
        </section>
      }

      <section class="recommended">
        <div class="recommended-head">
          <h2>Recomendados para ti</h2>
          <a routerLink="/collections">Ver mas productos</a>
        </div>
        <div class="recommended-grid">
          @for (item of recommendations(); track item.handle) {
            <article class="recommended-card">
              @if (item.featuredImage) {
                <img [src]="item.featuredImage.url" [alt]="item.featuredImage.altText || item.title" />
              }
              <h3>{{ item.title }}</h3>
              <p>{{ item.priceRange.minVariantPrice.amount | currency:item.priceRange.minVariantPrice.currencyCode:'symbol':'1.2-2' }}</p>
              <div class="recommended-actions">
                <a [routerLink]="['/product', item.handle]"><span class="icon">▸</span> VER</a>
                <button (click)="addToCart(item)">+ ANADIR</button>
              </div>
            </article>
          } @empty {
            <p>No hay recomendados disponibles ahora mismo.</p>
          }
        </div>
      </section>
    } @else {
      <p>Cargando producto...</p>
    }
  `,
  styles: [`
    .product {
      display:grid;
      grid-template-columns: 1fr 1fr;
      gap:24px;
      background:#111;
      padding:20px;
      border:1px solid #2f2f2f;
      position: relative;
    }
    .product::before {
      content:'';
      position:absolute;
      left:0;
      top:0;
      width:0;
      height:0;
      border-top:26px solid #f5f5f5;
      border-right:26px solid transparent;
    }
    img { width:100%; max-height:420px; object-fit:cover; }
    .tag-list { display:flex; flex-wrap:wrap; gap:6px; margin:8px 0 6px; }
    .tag { font-size:10px; letter-spacing:.7px; border:1px solid #3d3d3d; padding:3px 6px; color:#cfcfcf; }
    .description { color:#bdbdbd; line-height:1.6; }
    button {
      margin-top:12px;
      padding:10px 14px;
      background:#f2f2f2;
      color:#111;
      border:1px solid #f2f2f2;
      cursor:pointer;
      font-weight:700;
    }
    .meta-section { margin-top:18px; border:1px solid #2f2f2f; background:#111; padding:14px; }
    .meta-grid { margin-top:10px; display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:10px; }
    .meta-card { border:1px solid #2f2f2f; background:#141414; padding:10px; }
    .meta-card small { color:#9c9c9c; text-transform:uppercase; letter-spacing:.7px; }
    .meta-card p { margin:4px 0 0; }
    .recommended { margin-top:28px; }
    .recommended-head { display:flex; justify-content:space-between; align-items:center; }
    .recommended-head a { color:#fff; text-decoration:none; font-weight:700; }
    .recommended-grid { margin-top:14px; display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:16px; }
    .recommended-card { background:#111; border:1px solid #2f2f2f; padding:12px; display:flex; flex-direction:column; }
    .recommended-card img { width:100%; height:180px; object-fit:cover; margin-bottom:10px; }
    .recommended-card h3 { min-height:52px; margin:6px 0; }
    .recommended-card p { margin:8px 0 10px; }
    .recommended-actions { display:flex; gap:8px; align-items:center; margin-top:auto; }
    .recommended-actions a {
      text-decoration:none;
      color:#fff;
      font-weight:700;
      background:#151515;
      border:1px solid #3a3a3a;
      padding:8px 10px;
    }
    .icon { margin-right:4px; color:#bcbcbc; }
    .recommended-actions button { margin-top:0; }
  `]
})
export class ProductPageComponent implements OnInit {
  readonly product = signal<Product | null>(null);
  readonly recommendations = signal<Array<Product & { handle: string }>>([]);
  readonly extraInfo = signal<Array<{ label: string; value: string }>>([]);

  constructor(
    private route: ActivatedRoute,
    private shopifyService: ShopifyService,
    private cartService: CartService
  ) {}

  async ngOnInit(): Promise<void> {
    const handle = this.route.snapshot.paramMap.get('handle');
    if (!handle) return;

    const data = await this.shopifyService.getProductByHandle(handle);
    this.product.set(data.product);
    this.extraInfo.set(this.mapMetafields(data.product?.metafields ?? []));

    const productsData = await this.shopifyService.getProducts();
    const recommended = productsData.products.nodes
      .filter((item) => item.handle !== handle)
      .slice(0, 4);
    this.recommendations.set(recommended);
  }

  addToCart(product: Product): void {
    const firstVariant = product.variants.nodes[0];
    if (!firstVariant) return;

    this.cartService.addItem({
      merchandiseId: firstVariant.id,
      title: product.title,
      variantTitle: firstVariant.title,
      price: product.priceRange.minVariantPrice,
    });
  }

  topTags(tags: string[]): string[] {
    return tags.filter(Boolean).slice(0, 4);
  }

  private mapMetafields(
    metafields: Array<{ namespace: string; key: string; value: string } | null>,
  ): Array<{ label: string; value: string }> {
    return metafields
      .filter((field): field is { namespace: string; key: string; value: string } => Boolean(field?.value?.trim()))
      .map((field) => ({
        label: `${field.namespace}.${field.key}`,
        value: field.value,
      }));
  }
}
