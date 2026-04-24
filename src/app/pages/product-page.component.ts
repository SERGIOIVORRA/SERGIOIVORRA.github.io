import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CartService } from '../services/cart.service';
import { ShopifyService } from '../services/shopify.service';

type Product = {
  handle?: string;
  title: string;
  description: string;
  featuredImage: { url: string; altText: string | null } | null;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  variants: { nodes: Array<{ id: string; title: string }> };
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
          <p class="description">{{ p.description }}</p>
          <strong>{{ p.priceRange.minVariantPrice.amount | currency:p.priceRange.minVariantPrice.currencyCode:'symbol':'1.2-2' }}</strong>
          <div>
            <button (click)="addToCart(p)">Agregar al carrito</button>
          </div>
        </div>
      </article>

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
                <a [routerLink]="['/product', item.handle]">Ver</a>
                <button (click)="addToCart(item)">Agregar</button>
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
    .product { display:grid; grid-template-columns: 1fr 1fr; gap:24px; background:#fff; padding:20px; border-radius:12px; }
    img { width:100%; max-height:420px; object-fit:cover; border-radius:10px; }
    .description { color:#333; line-height:1.6; }
    button { margin-top:12px; padding:10px 14px; background:#111; color:#fff; border:0; cursor:pointer; border-radius:6px; }
    .recommended { margin-top:28px; }
    .recommended-head { display:flex; justify-content:space-between; align-items:center; }
    .recommended-head a { color:#111; text-decoration:none; font-weight:600; }
    .recommended-grid { margin-top:14px; display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:16px; }
    .recommended-card { background:#fff; border:1px solid #ececec; border-radius:10px; padding:12px; }
    .recommended-card img { width:100%; height:180px; object-fit:cover; margin-bottom:10px; }
    .recommended-actions { display:flex; gap:8px; align-items:center; }
    .recommended-actions a { text-decoration:none; color:#111; font-weight:600; }
    .recommended-actions button { margin-top:0; }
  `]
})
export class ProductPageComponent implements OnInit {
  readonly product = signal<Product | null>(null);
  readonly recommendations = signal<Array<Product & { handle: string }>>([]);

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
}
