import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ShopifyService } from '../services/shopify.service';
import { environment } from '../../environments/environment';

type Collection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: { url: string; altText: string | null } | null;
};

type CollectionProduct = {
  id: string;
  handle: string;
  title: string;
  featuredImage: { url: string; altText: string | null } | null;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
};

@Component({
  standalone: true,
  selector: 'app-collections-page',
  imports: [RouterLink, CurrencyPipe],
  template: `
    <section>
      <div class="collections-hero">
        <div>
          <p class="eyebrow">* SHOPIFY COLLECTIONS</p>
          <h1>Colecciones con estilo pro</h1>
          <p>Explora, filtra y entra a colecciones reales en un layout premium.</p>
        </div>
        <a [href]="'https://' + storeDomain + '/account'" target="_blank" rel="noreferrer">+ IR A TU CUENTA</a>
      </div>
      <div class="grid">
        @for (collection of collections(); track collection.id) {
          <article class="card">
            <div class="media-wrap">
              @if (collection.image) {
                <img [src]="collection.image.url" [alt]="collection.image.altText || collection.title" />
              } @else {
                <div class="fallback">{{ collection.title.slice(0, 1) }}</div>
              }
              <div class="media-overlay">
                <span>{{ collection.handle }}</span>
              </div>
            </div>
            <div class="card-content">
              <h3>{{ collection.title }}</h3>
              <p>{{ collection.description || 'Coleccion destacada con seleccion curada de productos.' }}</p>
              <div class="actions">
                <a [routerLink]="['/collections', collection.handle]">- VER PRODUCTOS</a>
                <a [href]="collectionUrl(collection.handle)" target="_blank" rel="noreferrer">+ OPEN COLLECTION</a>
              </div>
            </div>
          </article>
        }
      </div>

      @if (activeCollectionTitle()) {
        <section class="products">
          <div class="products-head">
            <h2>{{ activeCollectionTitle() }}</h2>
            <p>Filtra y ordena los productos de esta coleccion.</p>
          </div>

          <div class="filters">
            <input
              type="search"
              [value]="searchTerm()"
              (input)="searchTerm.set($any($event.target).value)"
              placeholder="Buscar producto..."
            />
            <select [value]="sortBy()" (change)="sortBy.set($any($event.target).value)">
              <option value="featured">Destacados</option>
              <option value="price-asc">Precio ascendente</option>
              <option value="price-desc">Precio descendente</option>
              <option value="title-asc">Nombre A-Z</option>
            </select>
            <label>
              Precio maximo:
              <input type="range" min="10" max="500" step="5" [value]="maxPrice()" (input)="maxPrice.set(+$any($event.target).value)" />
              <span>{{ maxPrice() }} {{ filteredProducts()[0]?.priceRange?.minVariantPrice?.currencyCode || 'EUR' }}</span>
            </label>
          </div>

          <div class="grid products-grid">
            @for (product of filteredProducts(); track product.id) {
              <article class="card product-card">
                @if (product.featuredImage) {
                  <img [src]="product.featuredImage.url" [alt]="product.featuredImage.altText || product.title" />
                }
                <h3>{{ product.title }}</h3>
                <p>{{ product.priceRange.minVariantPrice.amount | currency:product.priceRange.minVariantPrice.currencyCode:'symbol':'1.2-2' }}</p>
                <a [routerLink]="['/product', product.handle]">- VER PRODUCTO</a>
              </article>
            } @empty {
              <p class="empty">No hay productos que coincidan con estos filtros.</p>
            }
          </div>
        </section>
      }
    </section>
  `,
  styles: [`
    .collections-hero {
      background: linear-gradient(140deg, #111, #1a1a1a 60%, #0d0d0d);
      color: #fff;
      border: 1px solid #2f2f2f;
      padding: 20px;
      margin-bottom: 22px;
      display: flex;
      justify-content: space-between;
      gap: 20px;
      align-items: center;
    }
    .collections-hero a {
      color: #fff;
      background: #131313;
      border: 1px solid #3a3a3a;
      text-decoration: none;
      padding: 10px 14px;
      font-weight: 700;
      white-space: nowrap;
    }
    .eyebrow { margin: 0 0 8px; font-size: 12px; letter-spacing: 1.1px; opacity: .8; }
    .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:16px; }
    .card { background:#111; border:1px solid #2f2f2f; overflow:hidden; transition:transform .2s ease, box-shadow .2s ease; }
    .card:hover { transform: translateY(-4px); box-shadow: 0 14px 24px rgba(0,0,0,.35); }
    .media-wrap { position:relative; }
    img { width:100%; height:210px; object-fit:cover; display:block; }
    .fallback {
      height:210px;
      display:grid;
      place-items:center;
      background: linear-gradient(135deg, #111, #666);
      color:#fff;
      font-size:48px;
      font-weight:800;
    }
    .media-overlay {
      position:absolute;
      left:10px;
      bottom:10px;
      background:rgba(0,0,0,.65);
      color:#fff;
      padding:4px 10px;
      font-size:12px;
    }
    .card-content { padding:14px; }
    .actions { display:flex; gap:12px; }
    .actions a, .product-card a {
      text-decoration:none;
      color:#fff;
      font-weight:700;
      background:#151515;
      border:1px solid #3a3a3a;
      padding:8px 10px;
      display:inline-block;
    }
    .products { margin-top:32px; }
    .filters { display:grid; grid-template-columns:2fr 1fr 2fr; gap:12px; margin:16px 0 20px; }
    .filters input, .filters select { width:100%; padding:8px; border:1px solid #3a3a3a; background:#111; color:#fff; }
    .products-grid { grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); }
    .empty { color:#9f9f9f; }
    @media (max-width: 768px) {
      .collections-hero { flex-direction: column; align-items: flex-start; }
    }
  `]
})
export class CollectionsPageComponent implements OnInit {
  readonly collections = signal<Collection[]>([]);
  readonly activeCollectionTitle = signal('');
  readonly collectionProducts = signal<CollectionProduct[]>([]);
  readonly searchTerm = signal('');
  readonly sortBy = signal('featured');
  readonly maxPrice = signal(250);
  readonly storeDomain = environment.shopifyStoreDomain;

  readonly filteredProducts = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    let products = this.collectionProducts().filter((product) => {
      const price = Number(product.priceRange.minVariantPrice.amount || 0);
      const matchesPrice = price <= this.maxPrice();
      const matchesTerm = !term || product.title.toLowerCase().includes(term);
      return matchesPrice && matchesTerm;
    });

    switch (this.sortBy()) {
      case 'price-asc':
        products = [...products].sort((a, b) => Number(a.priceRange.minVariantPrice.amount) - Number(b.priceRange.minVariantPrice.amount));
        break;
      case 'price-desc':
        products = [...products].sort((a, b) => Number(b.priceRange.minVariantPrice.amount) - Number(a.priceRange.minVariantPrice.amount));
        break;
      case 'title-asc':
        products = [...products].sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return products;
  });

  constructor(private shopifyService: ShopifyService, private route: ActivatedRoute) {}

  async ngOnInit(): Promise<void> {
    const data = await this.shopifyService.getCollections();
    this.collections.set(data.collections.nodes);

    this.route.paramMap.subscribe(async (params) => {
      const handle = params.get('handle');
      if (!handle) {
        this.activeCollectionTitle.set('');
        this.collectionProducts.set([]);
        return;
      }

      const response = await this.shopifyService.getCollectionByHandle(handle);
      if (!response.collection) {
        this.activeCollectionTitle.set('');
        this.collectionProducts.set([]);
        return;
      }

      this.activeCollectionTitle.set(response.collection.title);
      this.collectionProducts.set(response.collection.products.nodes);
    });
  }

  collectionUrl(handle: string): string {
    return `https://${environment.shopifyStoreDomain}/collections/${handle}`;
  }
}
