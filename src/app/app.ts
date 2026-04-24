import { Component, HostListener, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NavigationEnd, NavigationStart, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CartService } from './services/cart.service';
import { CurrencyPipe } from '@angular/common';
import { environment } from '../environments/environment';
import { I18nService } from './services/i18n.service';
import { ShopifyService } from './services/shopify.service';
import { Inject } from '@angular/core';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CurrencyPipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = 'Sergio Ivorra | Shopify';
  protected readonly accountUrl = `https://${environment.shopifyStoreDomain}/account`;
  protected readonly loginUrl = `https://${environment.shopifyStoreDomain}/account/login`;
  protected readonly registerUrl = `https://${environment.shopifyStoreDomain}/account/register`;
  readonly footerVisible = signal(false);
  readonly crystals = signal<Array<{ id: number; x: number; y: number; size: number; rotate: number }>>([]);
  private footerTimer: ReturnType<typeof setTimeout> | null = null;
  private crystalId = 0;
  private lastCrystalAt = 0;

  constructor(
    public cartService: CartService,
    public i18n: I18nService,
    private shopifyService: ShopifyService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.shopifyService.prefetchProducts();
    this.shopifyService.prefetchCollections();
    void this.shopifyService.getCollections().then((data) => {
      this.shopifyService.prefetchCollectionDetails(
        data.collections.nodes.map((collection) => collection.handle),
      );
      for (const collection of data.collections.nodes) {
        if (collection.image?.url) this.preloadImage(collection.image.url);
      }
    }).catch(() => {
      // Silent prefetch fail: user navigation still triggers normal loading.
    });
    void this.shopifyService.getProducts().then((data) => {
      for (const product of data.products.nodes) {
        if (product.featuredImage?.url) this.preloadImage(product.featuredImage.url);
      }
    }).catch(() => {
      // Silent warmup fail.
    });
    this.scheduleFooterReveal();
    this.router.events
      .pipe(filter((event): event is NavigationStart | NavigationEnd => event instanceof NavigationStart || event instanceof NavigationEnd))
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.footerVisible.set(false);
          if (this.footerTimer) {
            clearTimeout(this.footerTimer);
            this.footerTimer = null;
          }
          return;
        }
        this.scheduleFooterReveal();
      });
  }

  handleBrandClick(event: Event): void {
    if (this.router.url === '/') {
      event.preventDefault();
      const section = this.document.getElementById('products-section');
      section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  private scheduleFooterReveal(): void {
    if (this.footerTimer) {
      clearTimeout(this.footerTimer);
    }
    this.footerTimer = setTimeout(() => {
      this.footerVisible.set(true);
    }, 1700);
  }

  @HostListener('document:mousemove', ['$event'])
  emitCrystal(event: MouseEvent): void {
    const now = Date.now();
    if (now - this.lastCrystalAt < 28) return;
    this.lastCrystalAt = now;
    const crystal = {
      id: ++this.crystalId,
      x: event.pageX + (Math.random() * 14 - 7),
      y: event.pageY + (Math.random() * 14 - 7),
      size: 6 + Math.random() * 8,
      rotate: Math.random() * 180,
    };
    this.crystals.update((current) => [...current.slice(-24), crystal]);
    setTimeout(() => {
      this.crystals.update((current) => current.filter((item) => item.id !== crystal.id));
    }, 700);
  }

  private preloadImage(url: string): void {
    const image = new Image();
    image.decoding = 'async';
    image.loading = 'eager';
    image.src = url;
  }
}
