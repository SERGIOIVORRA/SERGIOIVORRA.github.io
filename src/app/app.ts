import { Component, signal } from '@angular/core';
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
  private footerTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    public cartService: CartService,
    public i18n: I18nService,
    private shopifyService: ShopifyService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.shopifyService.prefetchCollections();
    void this.shopifyService.getCollections().then((data) => {
      this.shopifyService.prefetchCollectionDetails(
        data.collections.nodes.map((collection) => collection.handle),
      );
    }).catch(() => {
      // Silent prefetch fail: user navigation still triggers normal loading.
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

}
