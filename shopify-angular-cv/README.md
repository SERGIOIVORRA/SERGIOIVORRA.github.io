# Shopify Angular Theme Base

Base de tema estilo Shopify en Angular con:
- Home
- Colecciones
- Pagina de producto
- Carrito lateral
- Checkout real de Shopify (Storefront API)
- Pagina de estructura del proyecto

## Importante sobre tokens

- **No uses el token Admin API en frontend**: ese token da control total y no se puede ocultar en una app cliente.
- Para frontend usa solo `Storefront Access Token`.
- El token que has compartido ya se considera expuesto; recomendacion: regenerarlo.

## Configuracion de entorno (repo publico)

1. Copia `src/environments/environment.local.example.ts` a `src/environments/environment.local.ts`.
2. Rellena tu token Storefront en `environment.local.ts`.
3. No subas ese archivo: ya esta en `.gitignore`.

Para desarrollo rapido, puedes copiar los mismos valores en `src/environments/environment.ts` solo en local y **no hacer commit**.

## Desarrollo local

```bash
npm install
npm start
```

## Build para GitHub Pages en `/cv`

La config de produccion ya usa `baseHref: /cv/`.

```bash
npm run build
```

El output queda en `dist/shopify-angular-cv/browser`.
