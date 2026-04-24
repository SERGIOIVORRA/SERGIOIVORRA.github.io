import { Injectable, signal } from '@angular/core';

type Lang = 'es' | 'en';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly storageKey = 'shopify_cv_lang';
  readonly lang = signal<Lang>(this.getInitialLang());

  private readonly messages: Record<Lang, Record<string, string>> = {
    es: {
      'nav.home': 'Inicio',
      'nav.collections': 'Colecciones',
      'nav.angularPro': 'Angular PRO',
      'nav.project': 'Proyecto',
      'nav.createAccount': 'Crear cuenta',
      'nav.login': 'Login',
      'nav.cart': 'Carrito',
      'cart.title': 'Tu carrito',
      'cart.empty': 'Tu carrito esta vacio.',
      'cart.checkout': 'Ir al checkout',
      'lang.toggle': 'EN',
      'project.title': 'Estructura del proyecto',
      'project.subtitle': 'Referencia rapida del theme en Angular.',
      'project.note': 'Auth y tokens van en variables de entorno (.env / environments) y no se exponen en cliente.',
      'project.cost': 'Esta arquitectura permite un super theme custom sobre Shopify con 0€ de coste adicional de plataforma.',
      'common.view': 'VER',
      'common.add': 'ANADIR',
      'common.backCollections': 'VOLVER A COLECCIONES',
      'common.results': 'resultados',
      'common.extraInfo': 'EXTRA INFO',
      'home.featuredProducts': 'Productos destacados',
      'product.loading': 'Cargando producto...',
      'product.loadError': 'Error cargando producto. Revisa Storefront token.',
      'product.notFound': 'No se encontro este producto.',
      'product.image.square': 'Cuadrado',
      'product.image.tall': 'Largo',
      'product.image.wide': 'Ancho',
      'product.addToCart': 'ANADIR AL CARRITO',
      'product.recommended': 'Recomendados para ti',
      'product.viewMore': 'Ver mas productos',
      'product.noRecommendations': 'No hay recomendados disponibles ahora mismo.',
      'collection.filterTitle': 'FILTROS',
      'collection.search': 'Buscar',
      'collection.order': 'Orden',
      'collection.priceMax': 'Precio maximo',
      'collection.onlyAvailable': 'Solo disponibles',
      'collection.productType': 'Tipo de producto',
      'collection.all': 'Todos',
      'collection.order.featured': 'Destacados',
      'collection.order.priceAsc': 'Precio asc',
      'collection.order.priceDesc': 'Precio desc',
      'collection.order.titleAsc': 'Nombre A-Z',
      'collection.noMatches': 'No hay productos que coincidan con tus filtros en tiempo real.'
    },
    en: {
      'nav.home': 'Home',
      'nav.collections': 'Collections',
      'nav.angularPro': 'Angular PRO',
      'nav.project': 'Project',
      'nav.createAccount': 'Create account',
      'nav.login': 'Login',
      'nav.cart': 'Cart',
      'cart.title': 'Your cart',
      'cart.empty': 'Your cart is empty.',
      'cart.checkout': 'Go to checkout',
      'lang.toggle': 'ES',
      'project.title': 'Project structure',
      'project.subtitle': 'Quick reference for the Angular theme.',
      'project.note': 'Auth and tokens are hidden in environment variables (.env / environments) and never exposed to the client.',
      'project.cost': 'This architecture enables a super custom Shopify theme with €0 additional platform cost.',
      'common.view': 'VIEW',
      'common.add': 'ADD',
      'common.backCollections': 'BACK TO COLLECTIONS',
      'common.results': 'results',
      'common.extraInfo': 'EXTRA INFO',
      'home.featuredProducts': 'Featured products',
      'product.loading': 'Loading product...',
      'product.loadError': 'Error loading product. Check Storefront token.',
      'product.notFound': 'This product was not found.',
      'product.image.square': 'Square',
      'product.image.tall': 'Tall',
      'product.image.wide': 'Wide',
      'product.addToCart': 'ADD TO CART',
      'product.recommended': 'Recommended for you',
      'product.viewMore': 'View more products',
      'product.noRecommendations': 'No recommendations available right now.',
      'collection.filterTitle': 'FILTERS',
      'collection.search': 'Search',
      'collection.order': 'Sort',
      'collection.priceMax': 'Max price',
      'collection.onlyAvailable': 'Only available',
      'collection.productType': 'Product type',
      'collection.all': 'All',
      'collection.order.featured': 'Featured',
      'collection.order.priceAsc': 'Price asc',
      'collection.order.priceDesc': 'Price desc',
      'collection.order.titleAsc': 'Name A-Z',
      'collection.noMatches': 'No products match your real-time filters.'
    }
  };

  t(key: string): string {
    return this.messages[this.lang()][key] ?? key;
  }

  toggleLang(): void {
    const nextLang: Lang = this.lang() === 'es' ? 'en' : 'es';
    this.lang.set(nextLang);
    localStorage.setItem(this.storageKey, nextLang);
  }

  private getInitialLang(): Lang {
    const saved = localStorage.getItem(this.storageKey);
    return saved === 'en' ? 'en' : 'es';
  }
}
