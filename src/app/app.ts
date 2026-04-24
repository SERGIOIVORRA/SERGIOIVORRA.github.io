import { Component } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CartService } from './services/cart.service';
import { CurrencyPipe } from '@angular/common';
import { environment } from '../environments/environment';
import { I18nService } from './services/i18n.service';
import { Router } from '@angular/router';
import { Inject } from '@angular/core';

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

  constructor(
    public cartService: CartService,
    public i18n: I18nService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  handleBrandClick(event: Event): void {
    if (this.router.url === '/') {
      event.preventDefault();
      const section = this.document.getElementById('products-section');
      section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
