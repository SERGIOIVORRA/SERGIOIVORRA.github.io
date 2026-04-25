import { Component, effect, signal } from '@angular/core';
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
  private pageScrollBeforeDrawer = 0;
  private drawerLockedBody = false;

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

    effect(() => {
      if (!this.cartService.isDrawerOpen()) return;
      const savedTop = this.cartService.drawerScrollTop();
      this.document.defaultView?.requestAnimationFrame(() => {
        const drawer = this.document.querySelector('.cart-drawer') as HTMLElement | null;
        if (drawer) {
          drawer.scrollTop = savedTop;
        }
      });
    });

    effect(() => {
      const body = this.document.body;
      const win = this.document.defaultView;
      if (!body || !win) return;

      if (this.cartService.isDrawerOpen()) {
        if (!this.drawerLockedBody) {
          this.pageScrollBeforeDrawer = win.scrollY || this.document.documentElement.scrollTop || 0;
          body.style.position = 'fixed';
          body.style.top = `-${this.pageScrollBeforeDrawer}px`;
          body.style.left = '0';
          body.style.right = '0';
          body.style.width = '100%';
          body.style.overflow = 'hidden';
          this.drawerLockedBody = true;
        }
        return;
      }

      if (this.drawerLockedBody) {
        body.style.position = '';
        body.style.top = '';
        body.style.left = '';
        body.style.right = '';
        body.style.width = '';
        body.style.overflow = '';
        win.scrollTo(0, this.pageScrollBeforeDrawer);
        this.drawerLockedBody = false;
      }
    });
  }

  handleBrandClick(event: Event): void {
    if (this.router.url === '/') {
      event.preventDefault();
      const section = this.document.getElementById('products-section');
      section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /** Texto de variante para carrito: quita sufijos basura (p. ej. "/ NO") y valores vacios. */
  formatCartVariant(variantTitle: string | undefined): string | null {
    let v = (variantTitle ?? '').trim();
    if (!v) return null;
    v = v.replace(/\s*\/\s*NO\s*$/i, '').replace(/\s*\/\s*N\/A\s*$/i, '').trim();
    if (!v) return null;
    const up = v.toUpperCase();
    if (up === 'NO' || up === 'DEFAULT TITLE' || up === 'TITLE') return null;
    return v;
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
