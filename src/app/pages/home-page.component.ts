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
      <p>
        Experiencia ultra rapida tipo SPA: navegacion sin recargas, transiciones fluidas y UX premium
        para ecommerce de marcas grandes.
      </p>
      <div class="hero-badges">
        <span>Sin recargas completas</span>
        <span>Arquitectura escalable por componentes</span>
        <span>Preparado para equipos y features enterprise</span>
      </div>
      <p class="hero-detail">
        Angular permite separar dominios (catalogo, carrito, checkout, cuenta), reutilizar logica y escalar
        con testing, tipado estricto y mantenimiento profesional a largo plazo. Frente a un theme tradicional,
        tienes mas control de producto, rendimiento y evolucion tecnica.
      </p>
      <div class="hero-actions">
        <a class="cta" routerLink="/collections">Ir a colecciones</a>
        <a class="cta ghost" href="https://artcuadros.myshopify.com/account" target="_blank" rel="noreferrer">Entrar a mi cuenta</a>
      </div>
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
    .hero-badges { display:flex; flex-wrap:wrap; gap:8px; margin-top:10px; }
    .hero-badges span { border:1px solid #ddd; border-radius:999px; padding:5px 10px; font-size:12px; font-weight:600; background:#fafafa; }
    .hero-detail { margin-top:10px; color:#333; line-height:1.55; max-width:900px; }
    .hero-actions { display:flex; gap:10px; margin-top:12px; flex-wrap:wrap; }
    .cta { display:inline-block; background:#111; color:#fff; padding:10px 14px; text-decoration:none; border-radius:6px; }
    .cta.ghost { background:#fff; color:#111; border:1px solid #111; }
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
