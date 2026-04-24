import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-project-structure-page',
  template: `
    <h1>Estructura del proyecto</h1>
    <p>Pagina de referencia para entender el theme en Angular.</p>
    <pre>
src/
  app/
    pages/
      home-page.component.ts
      collections-page.component.ts
      product-page.component.ts
      project-structure-page.component.ts
    services/
      shopify.service.ts
      cart.service.ts
  environments/
    environment.ts
    environment.prod.ts
    </pre>
  `
})
export class ProjectStructurePageComponent {}
