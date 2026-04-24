import { Injectable, signal } from '@angular/core';
import { ShopifyService } from './shopify.service';

type CartItem = {
  merchandiseId: string;
  title: string;
  variantTitle: string;
  price: { amount: string; currencyCode: string };
};

@Injectable({ providedIn: 'root' })
export class CartService {
  readonly items = signal<CartItem[]>([]);
  readonly isDrawerOpen = signal(false);
  readonly checkoutUrl = signal('https://www.shopify.com');
  private cartId: string | null = null;
  private readonly storageKey = 'shopify_cv_cart_state';
  private readonly cookieKey = 'shopify_cv_cart_items';

  constructor(private shopifyService: ShopifyService) {
    this.restoreState();
  }

  toggleDrawer() {
    this.isDrawerOpen.set(!this.isDrawerOpen());
  }

  totalItems() {
    return this.items().length;
  }

  hasItem(merchandiseId: string): boolean {
    return this.items().some((item) => item.merchandiseId === merchandiseId);
  }

  async addItem(item: CartItem): Promise<void> {
    if (this.hasItem(item.merchandiseId)) {
      this.isDrawerOpen.set(true);
      return;
    }

    if (!this.cartId) {
      const data = await this.shopifyService.createCart(item.merchandiseId);
      this.cartId = data.cartCreate.cart.id;
      this.checkoutUrl.set(data.cartCreate.cart.checkoutUrl);
    } else {
      const data = await this.shopifyService.addCartLine(this.cartId, item.merchandiseId);
      this.checkoutUrl.set(data.cartLinesAdd.cart.checkoutUrl);
    }

    this.items.set([...this.items(), item]);
    this.isDrawerOpen.set(true);
    this.persistState();
  }

  removeItem(index: number): void {
    this.items.update((currentItems) => currentItems.filter((_, currentIndex) => currentIndex !== index));
    this.persistState();
  }

  private persistState(): void {
    const state = {
      cartId: this.cartId,
      checkoutUrl: this.checkoutUrl(),
      items: this.items(),
    };
    localStorage.setItem(this.storageKey, JSON.stringify(state));
    document.cookie = `${this.cookieKey}=${encodeURIComponent(String(this.items().length))}; path=/; max-age=2592000; SameSite=Lax`;
  }

  private restoreState(): void {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as {
        cartId?: string | null;
        checkoutUrl?: string;
        items?: CartItem[];
      };
      this.cartId = parsed.cartId ?? null;
      if (parsed.checkoutUrl) {
        this.checkoutUrl.set(parsed.checkoutUrl);
      }
      if (Array.isArray(parsed.items)) {
        this.items.set(parsed.items);
      }
    } catch {
      localStorage.removeItem(this.storageKey);
    }
  }
}
