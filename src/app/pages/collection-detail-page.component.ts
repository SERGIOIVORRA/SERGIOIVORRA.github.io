import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ShopifyService } from '../services/shopify.service';

type CollectionProduct = {
  id: string;
  handle: string;
  title: string;
  tags: string[];
  availableForSale: boolean;
  productType: string;
  vendor: string;
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
        <a class="back" routerLink="/collections">- VOLVER A COLECCIONES</a>
        <h1>* {{ collectionTitle() || 'Coleccion' }}</h1>
        <p>{{ collectionDescription() || 'Filtrado en tiempo real estilo Shopify para navegar rapido.' }}</p>
      </div>

      <div class="layout">
        <aside class="filters">
          <h3>+ FILTROS</h3>

          <label class="field">
            Buscar
            <input
              type="search"
              [value]="searchTerm()"
              (input)="searchTerm.set($any($event.target).value)"
              placeholder="nombre producto"
            />
          </label>

          <label class="field">
            Orden
            <select [value]="sortBy()" (change)="sortBy.set($any($event.target).value)">
              <option value="featured">Destacados</option>
              <option value="price-asc">Precio asc</option>
              <option value="price-desc">Precio desc</option>
              <option value="title-asc">Nombre A-Z</option>
            </select>
          </label>

          <label class="field">
            Precio maximo: {{ maxPrice() }}
            <input type="range" min="10" max="1000" step="5" [value]="maxPrice()" (input)="maxPrice.set(+$any($event.target).value)" />
          </label>

          <label class="field checkbox">
            <input type="checkbox" [checked]="onlyInStock()" (change)="onlyInStock.set($any($event.target).checked)" />
            Solo disponibles
          </label>

          <label class="field">
            Tipo de producto
            <select [value]="selectedType()" (change)="selectedType.set($any($event.target).value)">
              <option value="all">Todos</option>
              @for (type of productTypes(); track type) {
                <option [value]="type">{{ type }}</option>
              }
            </select>
          </label>
        </aside>

        <div class="products">
          <p class="result-count">{{ filteredProducts().length }} resultados</p>
          <div class="grid">
            @for (product of filteredProducts(); track product.id) {
              <article class="card">
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
                <p>{{ product.priceRange.minVariantPrice.amount | currency:product.priceRange.minVariantPrice.currencyCode:'symbol':'1.2-2' }}</p>
                <div class="actions">
                  <a [routerLink]="['/product', product.handle]"><span class="icon">▸</span> VER</a>
                </div>
              </article>
            } @empty {
              <p class="empty">No hay productos que coincidan con tus filtros en tiempo real.</p>
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
    .card { border:1px solid #2f2f2f; background:#151515; padding:10px; display:flex; flex-direction:column; }
    .card img { width:100%; height:180px; object-fit:cover; margin-bottom:8px; }
    .tag-list { display:flex; flex-wrap:wrap; gap:6px; min-height:24px; margin-bottom:6px; }
    .tag { font-size:10px; letter-spacing:.7px; border:1px solid #3d3d3d; padding:3px 6px; color:#cfcfcf; }
    .card h3 { min-height:52px; margin:6px 0; }
    .card small { color:#9d9d9d; }
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
  readonly maxPrice = signal(300);
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

  constructor(private route: ActivatedRoute, private shopifyService: ShopifyService) {}

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
}
