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
      <h1>{{ i18n.t('home.heroTitle') }}</h1>
      <p>{{ i18n.t('home.heroText') }}</p>
      <div class="hero-badges">
        <span>{{ i18n.t('home.badge1') }}</span>
        <span>{{ i18n.t('home.badge2') }}</span>
        <span>{{ i18n.t('home.badge3') }}</span>
      </div>
      <p class="hero-detail">{{ i18n.t('home.heroDetail') }}</p>
      <div class="hero-actions">
        <a class="cta" routerLink="/collections">- {{ i18n.t('home.goCollections') }}</a>
        <a class="cta ghost" href="https://artcuadros.myshopify.com/account" target="_blank" rel="noreferrer">+ {{ i18n.t('home.loginAccount') }}</a>
      </div>
    </section>

    <section class="inspiration">
      <h2>{{ i18n.t('home.inspiredTitle') }}</h2>
      <p>
        {{ i18n.t('home.inspiredText') }}
        <a href="https://yeezy.com/" target="_blank" rel="noreferrer">yeezy.com</a>:
        {{ i18n.t('home.inspiredTail') }}
      </p>
      <div class="yeezy-gains">
        <article>
          <h3>* {{ i18n.t('home.gainTitle') }}</h3>
          <p>{{ i18n.t('home.gainText') }}</p>
        </article>
        <article>
          <h3>+ {{ i18n.t('home.impactTitle') }}</h3>
          <p>{{ i18n.t('home.impactText') }}</p>
        </article>
      </div>
    </section>

    <section class="value">
      <h2>{{ i18n.t('home.archTitle') }}</h2>
      <div class="value-grid">
        <article>
          <h3>{{ i18n.t('home.card1Title') }}</h3>
          <p>{{ i18n.t('home.card1Text') }}</p>
        </article>
        <article>
          <h3>{{ i18n.t('home.card2Title') }}</h3>
          <p>{{ i18n.t('home.card2Text') }}</p>
        </article>
        <article>
          <h3>{{ i18n.t('home.card3Title') }}</h3>
          <p>{{ i18n.t('home.card3Text') }}</p>
        </article>
        <article>
          <h3>{{ i18n.t('home.card4Title') }}</h3>
          <p>{{ i18n.t('home.card4Text') }}</p>
        </article>
      </div>
    </section>

    <section class="products" id="products-section">
      <h2>* {{ i18n.t('home.featuredProducts') }}</h2>
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
            <details class="meta-collapse">
              <summary>? {{ i18n.t('common.metafields') }}</summary>
              <div class="meta-list">
                @for (field of filledMetafields(product.metafields); track field.label) {
                  <label class="meta-input">{{ field.label }}<input [value]="field.value" readonly /></label>
                }
              </div>
            </details>
            <p>{{ product.priceRange.minVariantPrice.amount | currency:product.priceRange.minVariantPrice.currencyCode:'symbol':'1.2-2' }}</p>
            <div class="actions">
              <a [routerLink]="['/product', product.handle]"><span class="icon">?</span> {{ i18n.t('common.view') }}</a>
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
    .meta-collapse { margin-bottom:8px; border:1px solid #2f2f2f; background:#141414; }
    .meta-collapse summary { cursor:pointer; padding:6px 8px; font-size:11px; color:#d0d0d0; list-style:none; }
    .meta-list { display:grid; gap:6px; padding:8px; }
    .meta-input { display:grid; gap:4px; font-size:10px; color:#a5a5a5; }
    .meta-input input { border:1px solid #3a3a3a; background:#111; color:#ddd; padding:4px 6px; font-size:10px; }
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
