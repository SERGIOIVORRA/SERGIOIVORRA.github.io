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
      <h1>Colecciones</h1>
      <p>Explora y entra en cada coleccion real de la tienda.</p>
      <div class="grid">
        @for (collection of collections(); track collection.id) {
          <article class="card">
            @if (collection.image) {
              <img [src]="collection.image.url" [alt]="collection.image.altText || collection.title" />
            }
            <h3>{{ collection.title }}</h3>
            <p>{{ collection.description || 'Sin descripcion' }}</p>
            <div class="actions">
              <a [routerLink]="['/collections', collection.handle]">Ver productos</a>
              <a [href]="collectionUrl(collection.handle)" target="_blank" rel="noreferrer">Ir a la coleccion</a>
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
                <a [routerLink]="['/product', product.handle]">Ver producto</a>
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
    .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:16px; }
    .card { background:#fff; border:1px solid #ececec; padding:14px; border-radius:10px; }
    img { width:100%; height:180px; object-fit:cover; margin-bottom:10px; border-radius:8px; }
    .actions { display:flex; gap:12px; }
    .actions a, .product-card a { text-decoration:none; color:#111; font-weight:600; }
    .products { margin-top:32px; }
    .filters { display:grid; grid-template-columns:2fr 1fr 2fr; gap:12px; margin:16px 0 20px; }
    .filters input, .filters select { width:100%; padding:8px; border:1px solid #ddd; border-radius:6px; }
    .products-grid { grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); }
    .empty { color:#666; }
  `]
})
export class CollectionsPageComponent implements OnInit {
  readonly collections = signal<Collection[]>([]);
  readonly activeCollectionTitle = signal('');
  readonly collectionProducts = signal<CollectionProduct[]>([]);
  readonly searchTerm = signal('');
  readonly sortBy = signal('featured');
  readonly maxPrice = signal(250);

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
