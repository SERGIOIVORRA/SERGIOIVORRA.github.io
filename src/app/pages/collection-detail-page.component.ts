import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { I18nService } from '../services/i18n.service';
import { ShopifyService } from '../services/shopify.service';

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
  selector: 'app-collection-detail-page',
  imports: [RouterLink, CurrencyPipe],
  template: `
    <section class="collection-page">
      <div class="collection-head">
        <a class="back" routerLink="/collections">- {{ i18n.t('common.backCollections') }}</a>
        <h1>* {{ collectionTitle() || i18n.t('nav.collections') }}</h1>
        <p>{{ collectionDescription() || i18n.t('collection.heroText') }}</p>
      </div>

      <div class="layout">
        <aside class="filters">
          <h3>+ {{ i18n.t('collection.filterTitle') }}</h3>

          <label class="field">
            {{ i18n.t('collection.search') }}
            <input
              type="search"
              [value]="searchTerm()"
              (input)="searchTerm.set($any($event.target).value)"
              [placeholder]="i18n.t('collection.namePlaceholder')"
            />
          </label>

          <label class="field">
            {{ i18n.t('collection.order') }}
            <select [value]="sortBy()" (change)="sortBy.set($any($event.target).value)">
              <option value="featured">{{ i18n.t('collection.order.featured') }}</option>
              <option value="price-asc">{{ i18n.t('collection.order.priceAsc') }}</option>
              <option value="price-desc">{{ i18n.t('collection.order.priceDesc') }}</option>
              <option value="title-asc">{{ i18n.t('collection.order.titleAsc') }}</option>
            </select>
          </label>

          <label class="field">
            {{ i18n.t('collection.priceMax') }}: {{ maxPrice() }}
            <input type="range" min="10" max="1000" step="5" [value]="maxPrice()" (input)="maxPrice.set(+$any($event.target).value)" />
          </label>

          <label class="field checkbox">
            <input type="checkbox" [checked]="onlyInStock()" (change)="onlyInStock.set($any($event.target).checked)" />
            {{ i18n.t('collection.onlyAvailable') }}
          </label>

          <label class="field">
            {{ i18n.t('collection.productType') }}
            <select [value]="selectedType()" (change)="selectedType.set($any($event.target).value)">
              <option value="all">{{ i18n.t('collection.all') }}</option>
              @for (type of productTypes(); track type) {
                <option [value]="type">{{ type }}</option>
              }
            </select>
          </label>
        </aside>

        <div class="products">
          <p class="result-count">{{ filteredProducts().length }} {{ i18n.t('common.results') }}</p>
          <div class="grid">
            @for (product of filteredProducts(); track product.id) {
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
                <small>{{ product.vendor }} · {{ product.productType || 'General' }}</small>
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
                </div>
              </article>
            } @empty {
              <p class="empty">{{ i18n.t('collection.noMatches') }}</p>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .collection-page { display:grid; gap:20px; }
    .collection-head { border:1px solid #2f2f2f; background:#111; padding:20px; }
    .back { color:#fff; text-decoration:none; font-weight:700; font-size:12px; }
    .layout { display:grid; grid-template-columns:280px 1fr; gap:16px; }
    .filters { border:1px solid #2f2f2f; background:#111; padding:14px; align-self:start; position:sticky; top:90px; }
    .field { display:grid; gap:6px; margin:0 0 12px; font-size:13px; }
    .field input, .field select { border:1px solid #3a3a3a; background:#131313; color:#fff; padding:8px; }
    .checkbox { grid-template-columns:auto 1fr; align-items:center; }
    .products { border:1px solid #2f2f2f; background:#111; padding:14px; }
    .result-count { color:#a7a7a7; margin-top:0; }
    .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:14px; }
    .card { border:1px solid #2f2f2f; background:#151515; padding:10px; display:flex; flex-direction:column; cursor:pointer; }
    .card img { width:100%; height:180px; object-fit:cover; margin-bottom:8px; }
    .tag-list { display:flex; flex-wrap:wrap; gap:6px; min-height:24px; margin-bottom:6px; }
    .tag { font-size:10px; letter-spacing:.7px; border:1px solid #3d3d3d; padding:3px 6px; color:#cfcfcf; }
    .card h3 { min-height:52px; margin:6px 0; }
    .card small { color:#9d9d9d; }
    .meta-collapse { margin-bottom:8px; border:1px solid #2f2f2f; background:#141414; }
    .meta-collapse summary { cursor:pointer; padding:6px 8px; font-size:11px; color:#d0d0d0; list-style:none; }
    .meta-list { display:grid; gap:6px; padding:8px; }
    .meta-input { display:grid; gap:4px; font-size:10px; color:#a5a5a5; }
    .meta-input input { border:1px solid #3a3a3a; background:#111; color:#ddd; padding:4px 6px; font-size:10px; }
    .card p { margin:8px 0 10px; }
    .actions { margin-top:auto; }
    .actions a { display:inline-block; text-decoration:none; color:#fff; font-weight:700; border:1px solid #3a3a3a; padding:8px 10px; background:#101010; }
    .icon { margin-right:4px; color:#bcbcbc; }
    .empty { color:#9d9d9d; }
    @media (max-width: 980px) {
      .layout { grid-template-columns:1fr; }
      .filters { position: static; }
    }
  `]
})
export class CollectionDetailPageComponent implements OnInit {
  readonly collectionTitle = signal('');
  readonly collectionDescription = signal('');
  readonly products = signal<CollectionProduct[]>([]);
  readonly searchTerm = signal('');
  readonly maxPrice = signal(1000);
  readonly sortBy = signal('featured');
  readonly onlyInStock = signal(false);
  readonly selectedType = signal('all');

  readonly productTypes = computed(() => {
    const set = new Set(this.products().map((item) => item.productType).filter(Boolean));
    return [...set].sort((a, b) => a.localeCompare(b));
  });

  readonly filteredProducts = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const selectedType = this.selectedType();
    let result = this.products().filter((product) => {
      const price = Number(product.priceRange.minVariantPrice.amount || 0);
      if (price > this.maxPrice()) return false;
      if (this.onlyInStock() && !product.availableForSale) return false;
      if (selectedType !== 'all' && product.productType !== selectedType) return false;
      if (term && !product.title.toLowerCase().includes(term)) return false;
      return true;
    });

    switch (this.sortBy()) {
      case 'price-asc':
        result = [...result].sort((a, b) => Number(a.priceRange.minVariantPrice.amount) - Number(b.priceRange.minVariantPrice.amount));
        break;
      case 'price-desc':
        result = [...result].sort((a, b) => Number(b.priceRange.minVariantPrice.amount) - Number(a.priceRange.minVariantPrice.amount));
        break;
      case 'title-asc':
        result = [...result].sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }
    return result;
  });

  constructor(
    private route: ActivatedRoute,
    private shopifyService: ShopifyService,
    public i18n: I18nService,
  ) {}

  async ngOnInit(): Promise<void> {
    const handle = this.route.snapshot.paramMap.get('handle');
    if (!handle) return;

    const response = await this.shopifyService.getCollectionByHandle(handle);
    if (!response.collection) return;

    this.collectionTitle.set(response.collection.title);
    this.collectionDescription.set(response.collection.description);
    this.products.set(response.collection.products.nodes);
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

  stopCardNavigation(event: Event): void {
    event.stopPropagation();
  }
}
