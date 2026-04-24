import { CurrencyPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CartService } from '../services/cart.service';
import { I18nService } from '../services/i18n.service';
import { ShopifyService } from '../services/shopify.service';

type Product = {
  handle?: string;
  title: string;
  description: string;
  tags: string[];
  availableForSale: boolean;
  featuredImage: { url: string; altText: string | null } | null;
  images?: { nodes: Array<{ url: string; altText: string | null }> };
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  variants: { nodes: Array<{ id: string; title: string }> };
  metafields?: Array<{ namespace: string; key: string; value: string } | null>;
};

type ExtraField = {
  label: string;
  value: string;
  imageUrl?: string;
  cdnUrl?: string;
};

@Component({
  standalone: true,
  selector: 'app-product-page',
  imports: [CurrencyPipe, RouterLink],
  template: `
    @if (isLoading()) {
      <p>{{ i18n.t('product.loading') }}</p>
    } @else if (loadError()) {
      <p>{{ loadError() }}</p>
    } @else if (product(); as p) {
      <article class="product">
        <div class="product-gallery">
          @if (mainDisplayImage(); as mainImg) {
            <img
              class="product-main-img"
              [src]="mainImg.url"
              [alt]="mainImg.altText || p.title"
              [class]="imageModeClass()"
            />
          }
          @if (galleryImages().length > 1) {
            <div class="gallery-thumbs" role="tablist" [attr.aria-label]="i18n.t('product.galleryLabel')">
              @for (img of galleryImages(); track img.url; let idx = $index) {
                <button
                  type="button"
                  class="thumb"
                  [class.active]="selectedImageIndex() === idx"
                  [attr.aria-selected]="selectedImageIndex() === idx"
                  (click)="selectGallery(idx)"
                >
                  <img [src]="img.url" alt="" />
                </button>
              }
            </div>
          }
        </div>
        <div class="product-side">
          <h1>{{ p.title }}</h1>
          <div class="image-mode-switch">
            <button type="button" (click)="setImageMode('square')" [class.active]="imageMode() === 'square'">{{ i18n.t('product.image.square') }}</button>
            <button type="button" (click)="setImageMode('tall')" [class.active]="imageMode() === 'tall'">{{ i18n.t('product.image.tall') }}</button>
            <button type="button" (click)="setImageMode('wide')" [class.active]="imageMode() === 'wide'">{{ i18n.t('product.image.wide') }}</button>
          </div>
          <div class="tag-list">
            @for (tag of topTags(p.tags); track tag) {
              <span class="tag">{{ tag }}</span>
            }
          </div>
          <p class="description">{{ p.description }}</p>
          <strong>{{ p.priceRange.minVariantPrice.amount | currency:p.priceRange.minVariantPrice.currencyCode:'symbol':'1.2-2' }}</strong>
          <div>
            <button type="button" [disabled]="!p.availableForSale" (click)="addToCart(p)">
              @if (p.availableForSale) {
                + {{ i18n.t('product.addToCart') }}
              } @else {
                {{ i18n.t('common.outOfStock') }}
              }
            </button>
          </div>

          <section class="recommended in-side">
            <div class="recommended-head">
              <h2>{{ i18n.t('product.recommended') }}</h2>
              <a routerLink="/collections">{{ i18n.t('product.viewMore') }}</a>
            </div>
            <div class="recommended-grid">
              @for (item of recommendations(); track item.handle) {
                <article class="recommended-card">
                  @if (nuevoTag(item.metafields ?? []); as badge) {
                    <span class="corner-badge">{{ badge }}</span>
                  }
                  @if (item.featuredImage) {
                    <img [src]="item.featuredImage.url" [alt]="item.featuredImage.altText || item.title" (click)="goToProduct(item.handle)" />
                  }
                  <h3 (click)="goToProduct(item.handle)">{{ item.title }}</h3>
                  <p>{{ item.priceRange.minVariantPrice.amount | currency:item.priceRange.minVariantPrice.currencyCode:'symbol':'1.2-2' }}</p>
                  <div class="recommended-actions">
                    <button type="button" [disabled]="!item.availableForSale || isInCart(item)" (click)="onAddToCart($event, item)">
                      @if (!item.availableForSale) {
                        {{ i18n.t('common.outOfStock') }}
                      } @else if (isInCart(item)) {
                        {{ i18n.t('common.added') }}
                      } @else {
                        + {{ i18n.t('common.add') }}
                      }
                    </button>
                  </div>
                </article>
              } @empty {
                <p>{{ i18n.t('product.noRecommendations') }}</p>
              }
            </div>
          </section>
        </div>
      </article>

      @if (extraInfo().length > 0) {
        <section class="meta-section">
          <details class="meta-collapse">
            <summary>? {{ i18n.t('common.metafields') }}</summary>
            <div class="meta-grid">
              @for (field of extraInfo(); track field.label) {
                <article class="meta-card">
                  <small>{{ field.label }}</small>
                  <input [value]="field.value" readonly />
                  @if (field.imageUrl) {
                    <img class="meta-image" [src]="field.imageUrl" [alt]="field.label" />
                    <input class="cdn-url" [value]="field.cdnUrl || field.imageUrl" readonly />
                  }
                </article>
              }
            </div>
          </details>
        </section>
      }

    }
  `,
  styles: [`
    .product {
      display:grid;
      grid-template-columns: 1fr 1fr;
      gap:24px;
      background:#111;
      padding:20px;
      border:1px solid #2f2f2f;
      position: relative;
    }
    .product-side { display:grid; gap:14px; align-content:start; }
    .product-gallery { display:grid; gap:10px; align-content:start; }
    .product-gallery .product-main-img { width:100%; object-fit:cover; border:1px solid #2f2f2f; background:#0f0f0f; }
    .img-square { aspect-ratio:1/1; }
    .img-tall { aspect-ratio:4/5; }
    .img-wide { aspect-ratio:16/9; }
    .gallery-thumbs { display:flex; flex-wrap:wrap; gap:8px; }
    .thumb {
      padding:0;
      border:2px solid #2f2f2f;
      background:#0f0f0f;
      cursor:pointer;
      line-height:0;
    }
    .thumb.active { border-color:#c9a227; }
    .thumb img { width:76px; height:76px; object-fit:cover; margin:0; display:block; border:0; }
    .image-mode-switch { display:flex; gap:8px; margin:8px 0 10px; }
    .image-mode-switch button {
      margin-top:0;
      padding:6px 10px;
      background:#171717;
      color:#f0f0f0;
      border:1px solid #3a3a3a;
      cursor:pointer;
      font-size:12px;
    }
    .image-mode-switch .active {
      background:#d6d6d6;
      color:#111;
      border-color:#bdbdbd;
      font-weight:700;
    }
    .tag-list { display:flex; flex-wrap:wrap; gap:6px; margin:8px 0 6px; }
    .tag { font-size:10px; letter-spacing:.7px; border:1px solid #3d3d3d; padding:3px 6px; color:#cfcfcf; }
    .description { color:#bdbdbd; line-height:1.6; }
    button {
      margin-top:12px;
      padding:10px 14px;
      background:#f2f2f2;
      color:#111;
      border:1px solid #f2f2f2;
      cursor:pointer;
      font-weight:700;
    }
    .meta-section { margin-top:18px; border:1px solid #2f2f2f; background:#111; padding:14px; }
    .meta-collapse { border:1px solid #2f2f2f; background:#141414; }
    .meta-collapse summary { cursor:pointer; padding:8px 10px; font-size:12px; color:#d0d0d0; list-style:none; }
    .meta-grid { margin-top:10px; display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:10px; padding:0 10px 10px; }
    .meta-card { border:1px solid #2f2f2f; background:#141414; padding:10px; }
    .meta-card small { color:#9c9c9c; text-transform:uppercase; letter-spacing:.7px; }
    .meta-card input { margin-top:4px; border:1px solid #3a3a3a; background:#111; color:#ddd; padding:6px; width:100%; }
    .meta-image { margin-top:8px; width:100%; height:140px; object-fit:cover; border:1px solid #2f2f2f; }
    .cdn-url { font-size:10px; color:#9ec3ff; }
    .recommended { margin-top:28px; }
    .recommended.in-side { margin-top:8px; border-top:1px solid #2f2f2f; padding-top:12px; }
    .recommended-head { display:flex; justify-content:space-between; align-items:center; }
    .recommended-head a { color:#fff; text-decoration:none; font-weight:700; }
    .recommended-grid { margin-top:14px; display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:16px; }
    .recommended-card { background:#111; border:1px solid #2f2f2f; padding:12px; display:flex; flex-direction:column; cursor:pointer; position:relative; overflow:hidden; }
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
    .recommended-card img { width:100%; height:180px; object-fit:cover; margin-bottom:10px; }
    .recommended-card img, .recommended-card h3 { cursor:pointer; }
    .recommended-card h3 { min-height:52px; margin:6px 0; }
    .recommended-card p { margin:8px 0 10px; }
    .recommended-actions { display:flex; gap:8px; align-items:stretch; margin-top:auto; }
    .icon { margin-right:4px; color:#bcbcbc; }
    .recommended-actions button {
      margin-top:0;
      flex:1;
      min-width:0;
      height:40px;
      min-height:40px;
      max-height:40px;
      box-sizing:border-box;
      display:inline-flex;
      align-items:center;
      justify-content:center;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
      font-size:10px;
      padding:0 10px;
    }
    button:disabled { opacity:.6; cursor:not-allowed; border-color:#4a2323; color:#c7a8a8; }
    @media (max-width: 980px) {
      .product { grid-template-columns:1fr; }
    }
    @media (max-width: 640px) {
      .product { padding:12px; gap:14px; max-width:100%; box-sizing:border-box; overflow-x:clip; }
      .product-gallery { width:100%; min-width:0; }
      .product-gallery .product-main-img {
        width:100%;
        max-width:none;
        object-fit:cover;
        object-position:center;
      }
      .product-gallery .product-main-img.img-square {
        aspect-ratio:3/4;
        min-height:min(88vw, 480px);
      }
      .product-gallery .product-main-img.img-tall {
        aspect-ratio:2/3;
        min-height:min(95vw, 520px);
      }
      .product-gallery .product-main-img.img-wide {
        aspect-ratio:1/1;
        min-height:min(92vw, 500px);
      }
      .gallery-thumbs { justify-content:flex-start; }
      .thumb img { width:64px; height:64px; }
      .recommended-grid { grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); }
    }
  `]
})
export class ProductPageComponent {
  readonly product = signal<Product | null>(null);
  readonly recommendations = signal<Array<Product & { handle: string }>>([]);
  readonly extraInfo = signal<ExtraField[]>([]);
  readonly imageMode = signal<'square' | 'tall' | 'wide'>('square');
  readonly selectedImageIndex = signal(0);
  readonly isLoading = signal(true);
  readonly loadError = signal('');

  readonly galleryImages = computed(() => {
    const p = this.product();
    if (!p) return [];
    const raw = p.images?.nodes?.filter((n) => Boolean(n?.url)) ?? [];
    if (raw.length) {
      const seen = new Set<string>();
      return raw.filter((n) => {
        if (seen.has(n.url)) return false;
        seen.add(n.url);
        return true;
      });
    }
    return p.featuredImage?.url ? [p.featuredImage] : [];
  });

  readonly mainDisplayImage = computed(() => {
    const list = this.galleryImages();
    if (!list.length) return null;
    const i = Math.max(0, Math.min(this.selectedImageIndex(), list.length - 1));
    return list[i] ?? list[0];
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private shopifyService: ShopifyService,
    private cartService: CartService,
    public i18n: I18nService,
  ) {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      void this.loadProduct(params.get('handle'));
    });
  }

  selectGallery(index: number): void {
    this.selectedImageIndex.set(index);
  }

  private async loadProduct(handle: string | null): Promise<void> {
    if (!handle) {
      this.isLoading.set(false);
      this.loadError.set(this.i18n.t('product.notFound'));
      this.product.set(null);
      return;
    }

    this.isLoading.set(true);
    this.loadError.set('');
    this.selectedImageIndex.set(0);
    try {
      const [productData, productsData] = await Promise.all([
        this.shopifyService.getProductByHandle(handle),
        this.shopifyService.getProducts(),
      ]);

      if (!productData.product) {
        this.loadError.set(this.i18n.t('product.notFound'));
        this.product.set(null);
        return;
      }

      this.product.set(productData.product);
      this.extraInfo.set(await this.mapMetafields(productData.product.metafields ?? []));

      const recommended = productsData.products.nodes
        .filter((item) => item.handle !== handle)
        .slice(0, 4);
      this.recommendations.set(recommended);
    } catch (error) {
      this.product.set(null);
      this.extraInfo.set([]);
      this.recommendations.set([]);
      this.loadError.set(this.i18n.t('product.loadError'));
      console.error(error);
    } finally {
      this.isLoading.set(false);
    }
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

  topTags(tags: string[]): string[] {
    return tags.filter(Boolean).slice(0, 4);
  }

  private async mapMetafields(
    metafields: Array<{ namespace: string; key: string; value: string } | null>,
  ): Promise<ExtraField[]> {
    const filled = metafields
      .filter((field): field is { namespace: string; key: string; value: string } => Boolean(field?.value?.trim()))
      .map((field) => ({
        label: `${field.namespace}.${field.key}`,
        value: field.value,
      }));

    const mediaIds = filled
      .flatMap((field) => this.extractMediaImageIds(field.value))
      .filter(Boolean);
    const mediaMap = await this.shopifyService.getMediaImageUrls(mediaIds);

    return filled.map((field) => ({
      ...field,
      imageUrl: this.extractMediaImageIds(field.value).map((id) => mediaMap[id]).find(Boolean),
      cdnUrl: this.extractMediaImageIds(field.value).map((id) => mediaMap[id]).find(Boolean),
    }));
  }

  private extractMediaImageIds(value: string): string[] {
    const matches = value.match(/gid:\/\/shopify\/MediaImage\/\d+/g);
    return matches ? [...new Set(matches)] : [];
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

  setImageMode(mode: 'square' | 'tall' | 'wide'): void {
    this.imageMode.set(mode);
  }

  goToProduct(handle: string | undefined): void {
    if (!handle) return;
    void this.router.navigate(['/product', handle]);
  }

  imageModeClass(): string {
    const mode = this.imageMode();
    if (mode === 'tall') return 'img-tall';
    if (mode === 'wide') return 'img-wide';
    return 'img-square';
  }

  nuevoTag(metafields: Array<{ namespace: string; key: string; value: string } | null>): string | null {
    const field = metafields.find((item) =>
      item?.namespace === 'custom'
      && item?.key === 'nuevo_sergio'
      && Boolean(item.value?.trim()),
    );
    return field?.value?.trim() ?? null;
  }
}
