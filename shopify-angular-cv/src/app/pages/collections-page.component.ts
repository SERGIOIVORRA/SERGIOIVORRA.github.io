import { Component, OnInit, signal } from '@angular/core';
import { ShopifyService } from '../services/shopify.service';

type Collection = { id: string; handle: string; title: string; description: string };

@Component({
  standalone: true,
  selector: 'app-collections-page',
  template: `
    <section>
      <h1>Colecciones</h1>
      <p>Listado de colecciones reales de Shopify.</p>
      <div class="grid">
        @for (collection of collections(); track collection.id) {
          <article class="card">
            <h3>{{ collection.title }}</h3>
            <p>{{ collection.description || 'Sin descripcion' }}</p>
            <small>{{ collection.handle }}</small>
          </article>
        }
      </div>
    </section>
  `,
  styles: [`
    .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:16px; }
    .card { background:#fff; border:1px solid #ececec; padding:14px; }
  `]
})
export class CollectionsPageComponent implements OnInit {
  readonly collections = signal<Collection[]>([]);

  constructor(private shopifyService: ShopifyService) {}

  async ngOnInit(): Promise<void> {
    const data = await this.shopifyService.getCollections();
    this.collections.set(data.collections.nodes);
  }
}
