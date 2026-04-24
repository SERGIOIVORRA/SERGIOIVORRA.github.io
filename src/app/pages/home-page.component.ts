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
        <a class="cta" routerLink="/collections">- VER COLECCIONES</a>
        <a class="cta ghost" href="https://artcuadros.myshopify.com/account" target="_blank" rel="noreferrer">+ LOGIN ACCOUNT</a>
      </div>
    </section>

    <section class="inspiration">
      <h2>Inspirado en Yeezy</h2>
      <p>
        Esta propuesta visual y de experiencia esta inspirada en la direccion creativa de
        <a href="https://yeezy.com/" target="_blank" rel="noreferrer">yeezy.com</a>:
        minimalismo, foco absoluto en producto y navegacion limpia orientada a conversion.
      </p>
    </section>

    <section class="value">
      <h2>Que ganan las marcas con esta arquitectura</h2>
      <div class="value-grid">
        <article>
          <h3>Mas conversion</h3>
          <p>Menos friccion en navegacion y compra, tiempos de interaccion mas rapidos y UX consistente.</p>
        </article>
        <article>
          <h3>Mas escalabilidad</h3>
          <p>Arquitectura por componentes para crecer por modulos sin romper el resto del proyecto.</p>
        </article>
        <article>
          <h3>Mas velocidad de equipo</h3>
          <p>Codigo tipado, reusable y mantenible para iterar campañas, landings y features enterprise.</p>
        </article>
        <article>
          <h3>Mas control tecnico</h3>
          <p>Capacidad de personalizacion avanzada frente a themes clasicos, ideal para marcas grandes.</p>
        </article>
      </div>
    </section>

    <section class="products">
      <h2>* Productos destacados</h2>
      <div class="grid">
        @for (product of products(); track product.handle) {
          <article class="card">
            @if (product.featuredImage) {
              <img [src]="product.featuredImage.url" [alt]="product.featuredImage.altText || product.title" />
            }
            <h3>{{ product.title }}</h3>
            <p>{{ product.priceRange.minVariantPrice.amount | currency:product.priceRange.minVariantPrice.currencyCode:'symbol':'1.2-2' }}</p>
            <div class="actions">
              <a [routerLink]="['/product', product.handle]">- VER</a>
              <button (click)="addToCart(product)">+ ANADIR</button>
            </div>
          </article>
        }
      </div>
    </section>
  `,
  styles: [`
    .hero { background:#111; border:1px solid #2f2f2f; padding:24px; margin-bottom:24px; position:relative; overflow:hidden; }
    .hero::after {
      content:'';
      position:absolute;
      right:0;
      top:0;
      width:0;
      height:0;
      border-left:44px solid transparent;
      border-top:44px solid #f5f5f5;
    }
    h1, h2, h3 { text-transform: uppercase; letter-spacing: .9px; }
    .hero p { color:#d0d0d0; }
    .hero-badges { display:flex; flex-wrap:wrap; gap:8px; margin-top:10px; }
    .hero-badges span { border:1px solid #3a3a3a; padding:5px 10px; font-size:12px; font-weight:600; background:#171717; color:#f1f1f1; }
    .hero-badges span::before { content:'* '; color:#9f9f9f; }
    .hero-detail { margin-top:10px; color:#bbb; line-height:1.55; max-width:900px; }
    .inspiration, .value { background:#111; border:1px solid #2f2f2f; padding:20px; margin-bottom:24px; }
    .inspiration a { color:#fff; font-weight:700; }
    .value-grid { margin-top:12px; display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:12px; }
    .value-grid article { border:1px solid #2b2b2b; padding:12px; background:#161616; }
    .value-grid article h3::before { content:'+ '; color:#9f9f9f; }
    .hero-actions { display:flex; gap:10px; margin-top:12px; flex-wrap:wrap; }
    .cta { display:inline-block; background:#f3f3f3; color:#111; padding:10px 14px; text-decoration:none; border:1px solid #f3f3f3; font-weight:700; }
    .cta.ghost { background:transparent; color:#fff; border:1px solid #3d3d3d; }
    .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:16px; }
    .card { background:#111; padding:12px; border:1px solid #2f2f2f; transition: transform .25s ease; }
    .card:hover { transform: translateY(-3px); }
    img { width:100%; height:180px; object-fit:cover; margin-bottom:8px; filter: grayscale(.12); }
    .actions { display:flex; gap:8px; }
    .actions a, .actions button { background:#171717; color:#fff; border:1px solid #373737; padding:8px 10px; text-decoration:none; font-weight:700; }
    .actions button { cursor:pointer; }
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
