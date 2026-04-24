import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CartService } from './services/cart.service';
import { CurrencyPipe } from '@angular/common';
import { environment } from '../environments/environment';

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

  constructor(public cartService: CartService) {}
}
