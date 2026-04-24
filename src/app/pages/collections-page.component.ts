import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ShopifyService } from '../services/shopify.service';
import { environment } from '../../environments/environment';

type Collection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: { url: string; altText: string | null } | null;
};

@Component({
  standalone: true,
  selector: 'app-collections-page',
  imports: [RouterLink],
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
    .actions a {
      text-decoration:none;
      color:#fff;
      font-weight:700;
      background:#151515;
      border:1px solid #3a3a3a;
      padding:8px 10px;
      display:inline-block;
    }
    @media (max-width: 768px) {
      .collections-hero { flex-direction: column; align-items: flex-start; }
    }
  `]
})
export class CollectionsPageComponent implements OnInit {
  readonly collections = signal<Collection[]>([]);
  readonly storeDomain = environment.shopifyStoreDomain;
  constructor(private shopifyService: ShopifyService) {}

  async ngOnInit(): Promise<void> {
    const data = await this.shopifyService.getCollections();
    this.collections.set(data.collections.nodes);
  }

  collectionUrl(handle: string): string {
    return `https://${this.storeDomain}/collections/${handle}`;
  }
}
