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

  constructor(private shopifyService: ShopifyService) {}

  toggleDrawer() {
    this.isDrawerOpen.set(!this.isDrawerOpen());
  }

  totalItems() {
    return this.items().length;
  }

  async addItem(item: CartItem): Promise<void> {
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
  }
}
