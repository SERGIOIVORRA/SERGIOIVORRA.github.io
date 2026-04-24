import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../services/cart.service';
import { ShopifyService } from '../services/shopify.service';

type Product = {
  handle: string;
  title: string;
  description: string;
  featuredImage: { url: string; altText: string | null } | null;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  variants: { nodes: Array<{ id: string; title: string }> };
};

@Component({
  standalone: true,
  selector: 'app-home-page',
  imports: [RouterLink, CurrencyPipe],
  template: `
    <section class="hero">
      <h1>Storefront Shopify en Angular</h1>
      <p>Explora productos, colecciones y una PDP mejorada conectada con la Storefront API.</p>
      <a class="cta" routerLink="/collections">Ir a colecciones</a>
    </section>

    <section class="products">
      <h2>Productos destacados</h2>
      <div class="grid">
        @for (product of products(); track product.handle) {
          <article class="card">
            @if (product.featuredImage) {
              <img [src]="product.featuredImage.url" [alt]="product.featuredImage.altText || product.title" />
            }
            <h3>{{ product.title }}</h3>
            <p>{{ product.priceRange.minVariantPrice.amount | currency:product.priceRange.minVariantPrice.currencyCode:'symbol':'1.2-2' }}</p>
            <div class="actions">
              <a [routerLink]="['/product', product.handle]">Ver</a>
              <button (click)="addToCart(product)">Agregar</button>
            </div>
          </article>
        }
      </div>
    </section>
  `,
  styles: [`
    .hero { background:#fff; border:1px solid #ececec; border-radius:12px; padding:20px; margin-bottom:24px; }
    .cta { display:inline-block; margin-top:12px; background:#111; color:#fff; padding:10px 14px; text-decoration:none; border-radius:6px; }
    .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:16px; }
    .card { background:#fff; padding:12px; border:1px solid #ececec; border-radius:10px; }
    img { width:100%; height:180px; object-fit:cover; margin-bottom:8px; }
    .actions { display:flex; gap:8px; }
  `]
})
export class HomePageComponent implements OnInit {
  readonly products = signal<Product[]>([]);

  constructor(private shopifyService: ShopifyService, private cartService: CartService) {}

  async ngOnInit(): Promise<void> {
    const data = await this.shopifyService.getProducts();
    this.products.set(data.products.nodes);
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
