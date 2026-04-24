import { CurrencyPipe, DOCUMENT } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../services/cart.service';
import { I18nService } from '../services/i18n.service';
import { ShopifyService } from '../services/shopify.service';
import { Inject } from '@angular/core';

type Product = {
  handle: string;
  title: string;
  description: string;
  tags: string[];
  availableForSale: boolean;
  metafields: Array<{ namespace: string; key: string; value: string } | null>;
  featuredImage: { url: string; altText: string | null } | null;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  variants: { nodes: Array<{ id: string; title: string }> };
};

type CollectionProduct = {
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
};

@Component({
  standalone: true,
  selector: 'app-home-page',
  imports: [RouterLink, CurrencyPipe],
  template: `
    <div class="home-layout">
    <section class="hero" [style.order]="sectionOrder('hero')">
      @if (blockEditMode()) {
        <div class="block-tools">
          <button type="button" (click)="moveSection('hero', -1)">↑</button>
          <button type="button" (click)="moveSection('hero', 1)">↓</button>
        </div>
      }
      <div class="hero-main">
        <div>
          <h1>{{ i18n.t('home.heroTitle') }}</h1>
          <p>{{ i18n.t('home.heroText') }}</p>
          <div class="hero-badges">
            <span>{{ i18n.t('home.badge1') }}</span>
            <span>{{ i18n.t('home.badge2') }}</span>
            <span>{{ i18n.t('home.badge3') }}</span>
          </div>
        </div>
        <aside class="speed-demo" aria-label="Angular vs Shopify speed demo">
          <h3>* {{ i18n.lang() === 'en' ? 'Navigation speed demo' : 'Demo de velocidad de navegacion' }}</h3>
          <div class="demo-icons">
            <span class="demo-chip loading">⟳ {{ i18n.lang() === 'en' ? 'Page reload flow' : 'Flujo con recarga de pagina' }}</span>
            <span class="demo-chip no-reload">✕ {{ i18n.lang() === 'en' ? 'No reload when navigating' : 'No hay recarga al navegar' }}</span>
          </div>
          <div class="demo-track before">
            <small>{{ i18n.lang() === 'en' ? 'Classic theme reload' : 'Theme clasico con recarga' }}</small>
            <div class="pulse"><span></span></div>
          </div>
          <div class="demo-track after">
            <small>{{ i18n.lang() === 'en' ? 'Angular SPA transition' : 'Transicion SPA en Angular' }}</small>
            <div class="pulse"><span></span></div>
          </div>
          <p>{{ i18n.lang() === 'en' ? 'Before: full page refresh. Now: route change inside the app.' : 'Antes: recarga completa. Ahora: cambio de ruta dentro de la app.' }}</p>
        </aside>
      </div>
      <p class="hero-detail">{{ i18n.t('home.heroDetail') }}</p>
      <div class="hero-actions">
        <a class="cta" routerLink="/collections">- {{ i18n.t('home.goCollections') }}</a>
        <a class="cta ghost" href="https://artcuadros.myshopify.com/account" target="_blank" rel="noreferrer">+ {{ i18n.t('home.loginAccount') }}</a>
      </div>
    </section>

    <section class="visual-controls" [style.order]="sectionOrder('controls')">
      @if (blockEditMode()) {
        <div class="block-tools">
          <button type="button" (click)="moveSection('controls', -1)">↑</button>
          <button type="button" (click)="moveSection('controls', 1)">↓</button>
        </div>
      }
      <details class="editor-panel" open>
        <summary>* {{ i18n.lang() === 'en' ? 'Visual controls' : 'Controles visuales' }}</summary>
        <div class="controls-grid">
          <label>
            {{ i18n.lang() === 'en' ? 'Brightness' : 'Brillo' }}: {{ brightness() }}%
            <input type="range" min="70" max="130" step="1" [value]="brightness()" (input)="setBrightness(+$any($event.target).value)" />
          </label>
          <label>
            {{ i18n.lang() === 'en' ? 'Darkness' : 'Oscuridad' }}: {{ darkness() }}%
            <input type="range" min="0" max="45" step="1" [value]="darkness()" (input)="setDarkness(+$any($event.target).value)" />
          </label>
          <label>
            {{ i18n.lang() === 'en' ? 'Contrast' : 'Contraste' }}: {{ contrast() }}%
            <input type="range" min="80" max="140" step="1" [value]="contrast()" (input)="setContrast(+$any($event.target).value)" />
          </label>
          <label>
            {{ i18n.lang() === 'en' ? 'Saturation' : 'Saturacion' }}: {{ saturation() }}%
            <input type="range" min="60" max="160" step="1" [value]="saturation()" (input)="setSaturation(+$any($event.target).value)" />
          </label>
          <label>
            {{ i18n.lang() === 'en' ? 'Crystal fx' : 'Efecto cristal' }}: {{ crystalFx() }}%
            <input type="range" min="0" max="100" step="1" [value]="crystalFx()" (input)="setCrystalFx(+$any($event.target).value)" />
          </label>
          <label>
            {{ i18n.lang() === 'en' ? 'Orb visibility' : 'Visibilidad orbe' }}: {{ orbFx() }}%
            <input type="range" min="0" max="100" step="1" [value]="orbFx()" (input)="setOrbFx(+$any($event.target).value)" />
          </label>
          <button type="button" (click)="blockEditMode.set(!blockEditMode())">
            {{ blockEditMode() ? (i18n.lang() === 'en' ? 'Finish block move' : 'Terminar mover bloques') : (i18n.lang() === 'en' ? 'Move blocks mode' : 'Modo mover bloques') }}
          </button>
          <button type="button" (click)="resetVisuals()">{{ i18n.lang() === 'en' ? 'Revert visuals' : 'Revertir visual' }}</button>
        </div>
      </details>
    </section>

    <section class="live-price-lab" [style.order]="sectionOrder('price')">
      @if (blockEditMode()) {
        <div class="block-tools">
          <button type="button" (click)="moveSection('price', -1)">↑</button>
          <button type="button" (click)="moveSection('price', 1)">↓</button>
        </div>
      }
      <div class="live-head">
        <h2>* {{ i18n.t('home.livePriceTitle') }}</h2>
        <p>{{ i18n.t('home.livePriceDesc') }}</p>
      </div>
      <label class="live-field">
        {{ i18n.t('home.livePriceLabel') }}: {{ livePriceMax() }}€
        <input type="range" min="0" max="1000" step="5" [value]="livePriceMax()" (input)="livePriceMax.set(+$any($event.target).value)" />
      </label>
      <p class="live-result">{{ filteredByLivePrice().length }} {{ i18n.t('home.livePriceResults') }}</p>
      <div class="live-grid">
        @for (product of filteredByLivePrice(); track product.handle) {
          <article class="live-card">
            @if (product.featuredImage) {
              <img [src]="product.featuredImage.url" [alt]="product.featuredImage.altText || product.title" />
            }
            <div class="live-card-body">
              <strong>{{ product.title }}</strong>
              <span>{{ product.priceRange.minVariantPrice.amount | currency:product.priceRange.minVariantPrice.currencyCode:'symbol':'1.2-2' }}</span>
            </div>
          </article>
        } @empty {
          <p class="live-empty">{{ i18n.t('home.livePriceEmpty') }}</p>
        }
      </div>
    </section>

    <section class="inspiration" [style.order]="sectionOrder('inspiration')">
      @if (blockEditMode()) {
        <div class="block-tools">
          <button type="button" (click)="moveSection('inspiration', -1)">↑</button>
          <button type="button" (click)="moveSection('inspiration', 1)">↓</button>
        </div>
      }
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

    <section class="value" [style.order]="sectionOrder('value')">
      @if (blockEditMode()) {
        <div class="block-tools">
          <button type="button" (click)="moveSection('value', -1)">↑</button>
          <button type="button" (click)="moveSection('value', 1)">↓</button>
        </div>
      }
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

    <section class="products" id="products-section" [style.order]="sectionOrder('products')">
      @if (blockEditMode()) {
        <div class="block-tools">
          <button type="button" (click)="moveSection('products', -1)">↑</button>
          <button type="button" (click)="moveSection('products', 1)">↓</button>
        </div>
      }
      <h2>* {{ i18n.t('home.featuredProducts') }}</h2>
      <p class="real-cases-title">{{ i18n.lang() === 'en' ? 'Real ecommerce references in this showcase:' : 'Referencias ecommerce reales en este showcase:' }} Lady Gaga, Mattel, Ruggable, SKIMS, Allbirds, Staples, Gymshark, Brooklinen, JB Hi-Fi, Inkbox.</p>
      <div class="grid">
        @for (product of featuredProducts(); track product.handle; let idx = $index) {
          <article class="card" [routerLink]="['/product', product.handle]">
            @if (nuevoTag(product.metafields); as badge) {
              <span class="corner-badge">{{ badge }}</span>
            }
            @if (product.featuredImage) {
              <img [src]="product.featuredImage.url" [alt]="product.featuredImage.altText || product.title" />
            }
            <div class="tag-list">
              @for (tag of topTags(product.tags); track tag) {
                <span class="tag">{{ tag }}</span>
              }
            </div>
            <h3>{{ product.title }}</h3>
            <details class="meta-collapse" (click)="stopCardNavigation($event)">
              <summary>? {{ i18n.t('common.metafields') }}</summary>
              <div class="meta-list">
                @for (field of filledMetafields(product.metafields); track field.label) {
                  <label class="meta-input">{{ field.label }}<input [value]="field.value" readonly (click)="stopCardNavigation($event)" /></label>
                }
              </div>
            </details>
            <p>{{ product.priceRange.minVariantPrice.amount | currency:product.priceRange.minVariantPrice.currencyCode:'symbol':'1.2-2' }}</p>
            <div class="actions">
              <a [routerLink]="['/product', product.handle]"><span class="icon">?</span> {{ i18n.t('common.view') }}</a>
              <button class="tool-btn" (click)="moveCardRight($event, idx)">↔</button>
              <button [disabled]="!product.availableForSale || isInCart(product)" (click)="onAddToCart($event, product)">
                @if (!product.availableForSale) {
                  {{ i18n.t('common.outOfStock') }}
                } @else if (isInCart(product)) {
                  {{ i18n.t('common.added') }}
                } @else {
                  + {{ i18n.t('common.add') }}
                }
              </button>
            </div>
          </article>
        }
      </div>
    </section>
    </div>
  `,
  styles: [`
    .home-layout { display:flex; flex-direction:column; }
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
    .hero-main { display:grid; grid-template-columns:1fr 320px; gap:14px; align-items:start; }
    .hero-badges { display:flex; flex-wrap:wrap; gap:8px; margin-top:10px; }
    .hero-badges span { border:1px solid #3a3a3a; padding:5px 10px; font-size:12px; font-weight:600; background:#171717; color:#f1f1f1; }
    .hero-badges span::before { content:'* '; color:#9f9f9f; }
    .speed-demo { border:1px solid #2f2f2f; background:#141414; padding:10px; }
    .speed-demo h3 { margin:0 0 8px; font-size:12px; color:#e0e0e0; }
    .speed-demo p { margin:8px 0 0; font-size:11px; color:#bcbcbc; line-height:1.4; }
    .demo-icons { display:grid; gap:6px; margin-bottom:8px; }
    .demo-chip { display:inline-flex; align-items:center; gap:6px; border:1px solid #303030; background:#101010; color:#d3d3d3; padding:4px 6px; font-size:10px; text-transform:uppercase; }
    .demo-chip.loading { color:#d3b7b7; border-color:#4d3535; }
    .demo-chip.no-reload { color:#bfe2bf; border-color:#355235; }
    .demo-track { margin-bottom:8px; }
    .demo-track small { display:block; margin-bottom:4px; color:#a5a5a5; font-size:10px; text-transform:uppercase; }
    .pulse { border:1px solid #2f2f2f; background:#0f0f0f; height:12px; overflow:hidden; }
    .pulse span { display:block; height:100%; width:32%; }
    .demo-track.before .pulse span { background:#7b4040; animation: slowReload 2.6s ease-in-out infinite; }
    .demo-track.after .pulse span { background:#d6d6d6; animation: fastSpa .45s linear infinite; }
    .hero-detail { margin-top:10px; color:#bbb; line-height:1.55; max-width:900px; }
    .live-price-lab { background:#111; border:1px solid #2f2f2f; padding:16px; margin:0 0 24px; position:relative; }
    .visual-controls { background:#111; border:1px solid #2f2f2f; padding:16px; margin:0 0 24px; position:relative; }
    .editor-panel { border:1px solid #2f2f2f; background:#0f0f0f; }
    .editor-panel summary { cursor:pointer; list-style:none; padding:12px; text-transform:uppercase; font-weight:700; border-bottom:1px solid #252525; background:#151515; }
    .editor-panel > .controls-grid { padding:12px; }
    .block-tools { position:absolute; right:10px; top:10px; display:flex; gap:6px; z-index:4; }
    .block-tools button { border:1px solid #3a3a3a; background:#0f0f0f; color:#f5f5f5; width:28px; height:28px; font-weight:700; cursor:pointer; }
    .controls-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:10px; align-items:end; }
    .controls-grid label { display:grid; gap:6px; font-size:12px; }
    .controls-grid input { border:1px solid #3a3a3a; }
    .controls-grid button { border:1px solid #3a3a3a; background:#151515; color:#fff; padding:9px 12px; font-weight:700; cursor:pointer; }
    .live-head p { color:#bdbdbd; margin:6px 0 10px; }
    .live-field { display:grid; gap:6px; max-width:260px; font-size:12px; margin-bottom:8px; }
    .live-field select { border:1px solid #3a3a3a; background:#131313; color:#fff; padding:8px; }
    .live-result { color:#a8a8a8; font-size:12px; margin:8px 0; }
    .live-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:8px; }
    .live-card { border:1px solid #2f2f2f; background:#151515; padding:8px; display:grid; gap:8px; }
    .live-card img { width:100%; height:120px; object-fit:cover; border:1px solid #2f2f2f; margin:0; filter:none; }
    .live-card-body { display:flex; justify-content:space-between; gap:8px; align-items:flex-start; }
    .live-card strong { font-size:11px; }
    .live-card span { font-size:11px; color:#cfcfcf; white-space:nowrap; }
    .live-empty { color:#9a9a9a; font-size:12px; }
    .inspiration, .value { background:#111; border:1px solid #2f2f2f; padding:20px; margin-bottom:24px; position:relative; }
    .inspiration a { color:#fff; font-weight:700; }
    .yeezy-gains { margin-top:10px; display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:10px; }
    .yeezy-gains article { border:1px solid #2b2b2b; background:#161616; padding:12px; }
    .value-grid { margin-top:12px; display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:12px; }
    .value-grid article { border:1px solid #2b2b2b; padding:12px; background:#161616; }
    .value-grid article h3::before { content:'+ '; color:#9f9f9f; }
    .hero-actions { display:flex; gap:10px; margin-top:12px; flex-wrap:wrap; }
    .cta { display:inline-block; background:#d6d6d6; color:#111; padding:10px 14px; text-decoration:none; border:1px solid #bdbdbd; font-weight:700; }
    .cta.ghost { background:transparent; color:#fff; border:1px solid #3d3d3d; }
    .products { position:relative; }
    .real-cases-title { color:#bcbcbc; font-size:12px; margin:2px 0 14px; line-height:1.5; }
    .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:16px; }
    .card { background:#111; padding:12px; border:1px solid #2f2f2f; transition: transform .25s ease; display:flex; flex-direction:column; cursor:pointer; position:relative; overflow:hidden; }
    .card:hover { transform: translateY(-3px); }
    .corner-badge {
      position:absolute;
      top:8px;
      right:8px;
      writing-mode:vertical-rl;
      text-orientation:mixed;
      border:1px solid #3a3a3a;
      background:#151515;
      color:#f3f3f3;
      font-size:9px;
      letter-spacing:.8px;
      padding:6px 4px;
      text-transform:uppercase;
      z-index:2;
    }
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
    .actions .tool-btn { width:36px; padding:8px 0; }
    .actions button { cursor:pointer; }
    .actions button:disabled { opacity:.6; cursor:not-allowed; border-color:#4a2323; color:#c7a8a8; }
    .icon { margin-right:4px; color:#bcbcbc; }
    @keyframes slowReload {
      0% { transform:translateX(-115%); opacity:.2; }
      40% { transform:translateX(30%); opacity:1; }
      100% { transform:translateX(230%); opacity:.2; }
    }
    @keyframes fastSpa {
      0% { transform:translateX(-120%); }
      100% { transform:translateX(240%); }
    }
    @media (max-width: 980px) {
      .hero-main { grid-template-columns:1fr; }
    }
  `]
})
export class HomePageComponent implements OnInit {
  readonly products = signal<Product[]>([]);
  readonly featuredProducts = signal<Product[]>([]);
  readonly collectionProducts = signal<CollectionProduct[]>([]);
  readonly livePriceMax = signal(0);
  readonly brightness = signal(100);
  readonly darkness = signal(0);
  readonly contrast = signal(100);
  readonly saturation = signal(100);
  readonly crystalFx = signal(100);
  readonly orbFx = signal(26);
  readonly blockEditMode = signal(false);
  readonly sectionOrderMap = signal<Record<string, number>>({
    hero: 0, controls: 1, price: 2, inspiration: 3, value: 4, products: 5,
  });
  readonly filteredByLivePrice = computed(() =>
    this.collectionProducts()
      .filter((product) => Number(product.priceRange.minVariantPrice.amount || 0) <= this.livePriceMax())
      .sort((a, b) => Number(a.priceRange.minVariantPrice.amount) - Number(b.priceRange.minVariantPrice.amount))
      .slice(0, 12),
  );

  constructor(
    private shopifyService: ShopifyService,
    private cartService: CartService,
    public i18n: I18nService,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  async ngOnInit(): Promise<void> {
    const [data, collectionData] = await Promise.all([
      this.shopifyService.getProducts(),
      this.shopifyService.getCollectionByHandle('saintmichelart'),
    ]);
    this.products.set(data.products.nodes);
    this.featuredProducts.set(data.products.nodes.slice(0, 12));
    this.collectionProducts.set(collectionData.collection?.products.nodes ?? []);
    this.restoreVisualPrefs();
    this.restoreSectionOrder();
    this.applyVisualVars();
  }

  setBrightness(value: number): void {
    this.brightness.set(value);
    this.applyVisualVars();
  }

  setDarkness(value: number): void {
    this.darkness.set(value);
    this.applyVisualVars();
  }

  setContrast(value: number): void {
    this.contrast.set(value);
    this.applyVisualVars();
  }

  setSaturation(value: number): void {
    this.saturation.set(value);
    this.applyVisualVars();
  }

  setCrystalFx(value: number): void {
    this.crystalFx.set(value);
    this.applyVisualVars();
  }

  setOrbFx(value: number): void {
    this.orbFx.set(value);
    this.applyVisualVars();
  }

  resetVisuals(): void {
    this.brightness.set(100);
    this.darkness.set(0);
    this.contrast.set(100);
    this.saturation.set(100);
    this.crystalFx.set(100);
    this.orbFx.set(26);
    this.applyVisualVars();
  }

  sectionOrder(sectionId: string): number {
    return this.sectionOrderMap()[sectionId] ?? 0;
  }

  moveSection(sectionId: string, direction: 1 | -1): void {
    const sorted = Object.entries(this.sectionOrderMap())
      .sort((a, b) => a[1] - b[1])
      .map(([id]) => id);
    const index = sorted.indexOf(sectionId);
    const swapWith = index + direction;
    if (index < 0 || swapWith < 0 || swapWith >= sorted.length) return;
    const next = [...sorted];
    [next[index], next[swapWith]] = [next[swapWith], next[index]];
    const map = next.reduce<Record<string, number>>((acc, id, idx) => ({ ...acc, [id]: idx }), {});
    this.sectionOrderMap.set(map);
    this.document.defaultView?.localStorage.setItem('home.sectionOrder', JSON.stringify(map));
  }

  addToCart(product: Product): void {
    if (!product.availableForSale) return;
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

  isInCart(product: Product): boolean {
    const firstVariant = product.variants.nodes[0];
    return firstVariant ? this.cartService.hasOrPendingItem(firstVariant.id) : false;
  }

  stopCardNavigation(event: Event): void {
    event.stopPropagation();
  }

  moveCardRight(event: Event, index: number): void {
    event.stopPropagation();
    event.preventDefault();
    this.featuredProducts.update((items) => {
      if (!items.length) return items;
      const next = [...items];
      const swapIndex = index === next.length - 1 ? 0 : index + 1;
      [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
      return next;
    });
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

  nuevoTag(metafields: Array<{ namespace: string; key: string; value: string } | null>): string | null {
    const field = metafields.find((item) =>
      item?.namespace === 'custom'
      && item?.key === 'nuevo_sergio'
      && Boolean(item.value?.trim()),
    );
    return field?.value?.trim() ?? null;
  }

  private applyVisualVars(): void {
    this.document.documentElement.style.setProperty('--ui-brightness', `${this.brightness() / 100}`);
    this.document.documentElement.style.setProperty('--ui-darkness', `${this.darkness() / 100}`);
    this.document.documentElement.style.setProperty('--ui-contrast', `${this.contrast() / 100}`);
    this.document.documentElement.style.setProperty('--ui-saturation', `${this.saturation() / 100}`);
    this.document.documentElement.style.setProperty('--ui-crystal-opacity', `${this.crystalFx() / 100}`);
    this.document.documentElement.style.setProperty('--ui-orb-opacity', `${this.orbFx() / 100}`);
    this.document.defaultView?.localStorage.setItem('home.visualPrefs', JSON.stringify({
      brightness: this.brightness(),
      darkness: this.darkness(),
      contrast: this.contrast(),
      saturation: this.saturation(),
      crystalFx: this.crystalFx(),
      orbFx: this.orbFx(),
    }));
  }

  private restoreVisualPrefs(): void {
    const raw = this.document.defaultView?.localStorage.getItem('home.visualPrefs');
    if (!raw) return;
    try {
      const prefs = JSON.parse(raw) as Partial<Record<'brightness' | 'darkness' | 'contrast' | 'saturation' | 'crystalFx' | 'orbFx', number>>;
      if (typeof prefs.brightness === 'number') this.brightness.set(prefs.brightness);
      if (typeof prefs.darkness === 'number') this.darkness.set(prefs.darkness);
      if (typeof prefs.contrast === 'number') this.contrast.set(prefs.contrast);
      if (typeof prefs.saturation === 'number') this.saturation.set(prefs.saturation);
      if (typeof prefs.crystalFx === 'number') this.crystalFx.set(prefs.crystalFx);
      if (typeof prefs.orbFx === 'number') this.orbFx.set(prefs.orbFx);
    } catch {
      // ignore invalid persisted data
    }
  }

  private restoreSectionOrder(): void {
    const raw = this.document.defaultView?.localStorage.getItem('home.sectionOrder');
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as Record<string, number>;
      const keys = Object.keys(this.sectionOrderMap());
      const complete = keys.every((key) => typeof parsed[key] === 'number');
      if (complete) this.sectionOrderMap.set(parsed);
    } catch {
      // ignore invalid persisted data
    }
  }
}
