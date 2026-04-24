import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../services/cart.service';
import { ShopifyService } from '../services/shopify.service';

type Product = {
  title: string;
  description: string;
  featuredImage: { url: string; altText: string | null } | null;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  variants: { nodes: Array<{ id: string; title: string }> };
};

@Component({
  standalone: true,
  selector: 'app-product-page',
  imports: [CurrencyPipe],
  template: `
    @if (product(); as p) {
      <article class="product">
        @if (p.featuredImage) {
          <img [src]="p.featuredImage.url" [alt]="p.featuredImage.altText || p.title" />
        }
        <div>
          <h1>{{ p.title }}</h1>
          <p>{{ p.description }}</p>
          <strong>{{ p.priceRange.minVariantPrice.amount | currency:p.priceRange.minVariantPrice.currencyCode:'symbol':'1.2-2' }}</strong>
          <div>
            <button (click)="addToCart(p)">Agregar al carrito</button>
          </div>
        </div>
      </article>
    } @else {
      <p>Cargando producto...</p>
    }
  `,
  styles: [`
    .product { display:grid; grid-template-columns: 1fr 1fr; gap:24px; }
    img { width:100%; max-height:420px; object-fit:cover; }
    button { margin-top:12px; padding:10px 14px; background:#111; color:#fff; border:0; cursor:pointer; }
  `]
})
export class ProductPageComponent implements OnInit {
  readonly product = signal<Product | null>(null);

  constructor(
    private route: ActivatedRoute,
    private shopifyService: ShopifyService,
    private cartService: CartService
  ) {}

  async ngOnInit(): Promise<void> {
    const handle = this.route.snapshot.paramMap.get('handle');
    if (!handle) return;
    const data = await this.shopifyService.getProductByHandle(handle);
    this.product.set(data.product);
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
