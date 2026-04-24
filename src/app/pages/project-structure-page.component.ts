import { Component } from '@angular/core';
import { I18nService } from '../services/i18n.service';

@Component({
  standalone: true,
  selector: 'app-project-structure-page',
  template: `
    <h1>{{ i18n.t('project.title') }}</h1>
    <p>{{ i18n.t('project.subtitle') }}</p>
    <p><strong>{{ i18n.t('project.note') }}</strong></p>
    <p>{{ i18n.t('project.cost') }}</p>
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
export class ProjectStructurePageComponent {
  constructor(public i18n: I18nService) {}
}
