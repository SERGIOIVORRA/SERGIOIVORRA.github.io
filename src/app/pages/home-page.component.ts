import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../services/cart.service';
import { I18nService } from '../services/i18n.service';
import { ShopifyService } from '../services/shopify.service';

type Product = {
  handle: string;
  title: string;
  description: string;
  tags: string[];
  metafields: Array<{ namespace: string; key: string; value: string } | null>;
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
      <div class="yeezy-gains">
        <article>
          <h3>* Que gana una marca estilo Yeezy</h3>
          <p>Percepcion premium, menos ruido visual y foco total en la accion de compra.</p>
        </article>
        <article>
          <h3>+ Impacto de negocio</h3>
          <p>Mejor conversion en mobile, experiencia mas rapida y narrativa visual mas reconocible.</p>
        </article>
      </div>
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

    <section class="products" id="products-section">
      <h2>* Productos destacados</h2>
      <div class="grid">
        @for (product of products(); track product.handle) {
          <article class="card" [routerLink]="['/product', product.handle]">
            @if (product.featuredImage) {
              <img [src]="product.featuredImage.url" [alt]="product.featuredImage.altText || product.title" />
            }
            <div class="tag-list">
              @for (tag of topTags(product.tags); track tag) {
                <span class="tag">{{ tag }}</span>
              }
            </div>
            <h3>{{ product.title }}</h3>
            <div class="meta-list">
              @for (field of filledMetafields(product.metafields); track field.label) {
                <small>{{ field.label }}: {{ field.value }}</small>
              }
            </div>
            <p>{{ product.priceRange.minVariantPrice.amount | currency:product.priceRange.minVariantPrice.currencyCode:'symbol':'1.2-2' }}</p>
            <div class="actions">
              <a [routerLink]="['/product', product.handle]"><span class="icon">▸</span> {{ i18n.t('common.view') }}</a>
              <button (click)="onAddToCart($event, product)">+ {{ i18n.t('common.add') }}</button>
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
    .yeezy-gains { margin-top:10px; display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:10px; }
    .yeezy-gains article { border:1px solid #2b2b2b; background:#161616; padding:12px; }
    .value-grid { margin-top:12px; display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:12px; }
    .value-grid article { border:1px solid #2b2b2b; padding:12px; background:#161616; }
    .value-grid article h3::before { content:'+ '; color:#9f9f9f; }
    .hero-actions { display:flex; gap:10px; margin-top:12px; flex-wrap:wrap; }
    .cta { display:inline-block; background:#d6d6d6; color:#111; padding:10px 14px; text-decoration:none; border:1px solid #bdbdbd; font-weight:700; }
    .cta.ghost { background:transparent; color:#fff; border:1px solid #3d3d3d; }
    .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:16px; }
    .card { background:#111; padding:12px; border:1px solid #2f2f2f; transition: transform .25s ease; display:flex; flex-direction:column; cursor:pointer; }
    .card:hover { transform: translateY(-3px); }
    img { width:100%; height:180px; object-fit:cover; margin-bottom:8px; filter: grayscale(.12); }
    .tag-list { display:flex; flex-wrap:wrap; gap:6px; min-height:24px; margin-bottom:6px; }
    .tag { font-size:10px; letter-spacing:.7px; border:1px solid #3d3d3d; padding:3px 6px; color:#cfcfcf; }
    .card h3 { margin:6px 0 8px; min-height:56px; }
    .meta-list { display:grid; gap:4px; min-height:42px; margin-bottom:8px; }
    .meta-list small { color:#a5a5a5; font-size:10px; line-height:1.2; }
    .card p { margin:0 0 10px; }
    .actions { display:flex; gap:8px; margin-top:auto; }
    .actions a, .actions button { background:#171717; color:#fff; border:1px solid #373737; padding:8px 10px; text-decoration:none; font-weight:700; }
    .actions button { cursor:pointer; }
    .icon { margin-right:4px; color:#bcbcbc; }
  `]
})
export class HomePageComponent implements OnInit {
  readonly products = signal<Product[]>([]);

  constructor(
    private shopifyService: ShopifyService,
    private cartService: CartService,
    public i18n: I18nService,
  ) {}

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

  onAddToCart(event: Event, product: Product): void {
    event.stopPropagation();
    event.preventDefault();
    this.addToCart(product);
  }

  topTags(tags: string[]): string[] {
    return tags.filter(Boolean).slice(0, 3);
  }

  filledMetafields(
    metafields: Array<{ namespace: string; key: string; value: string } | null>,
  ): Array<{ label: string; value: string }> {
    return metafields
      .filter((field): field is { namespace: string; key: string; value: string } => Boolean(field?.value?.trim()))
      .map((field) => ({ label: `${field.namespace}.${field.key}`, value: field.value }));
  }
}
