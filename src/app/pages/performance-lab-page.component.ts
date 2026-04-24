import { Component } from '@angular/core';
import { I18nService } from '../services/i18n.service';

@Component({
  standalone: true,
  selector: 'app-performance-lab-page',
  template: `
    <section class="wrap">
      <header class="hero">
        <p class="eyebrow">* PERFORMANCE / CAPACITY LAB</p>
        <h1>{{ i18n.lang() === 'en' ? 'Angular vs Shopify stack limits' : 'Limites de stack: Angular vs Shopify' }}</h1>
        <p>
          {{ i18n.lang() === 'en'
            ? 'Visual comparison of JS load, traffic peaks, and resilience under stress for enterprise storefronts.'
            : 'Comparativa visual de carga JS, picos de trafico y resistencia bajo estres para storefronts enterprise.' }}
        </p>
      </header>

      <section class="diagram">
        <h2>* {{ i18n.lang() === 'en' ? 'Stress map (illustrative)' : 'Mapa de estres (ilustrativo)' }}</h2>
        <div class="rows">
          @for (item of stressRows; track item.labelEs) {
            <article class="row">
              <strong>{{ i18n.lang() === 'en' ? item.labelEn : item.labelEs }}</strong>
              <div class="bars">
                <div><small>Angular</small><span class="bar a" [style.width.%]="item.angular"></span></div>
                <div><small>Hydrogen</small><span class="bar h" [style.width.%]="item.hydrogen"></span></div>
                <div><small>Theme</small><span class="bar t" [style.width.%]="item.theme"></span></div>
              </div>
            </article>
          }
        </div>
      </section>

      <section class="brands">
        <h2>* {{ i18n.lang() === 'en' ? 'Major ecommerce references' : 'Referencias ecommerce importantes' }}</h2>
        <div class="grid">
          @for (item of ecommerceRefs; track item.name) {
            <article>
              <h3>+ {{ item.name }}</h3>
              <p>{{ i18n.lang() === 'en' ? item.en : item.es }}</p>
            </article>
          }
        </div>
      </section>

      <section class="notes">
        <h2>* {{ i18n.lang() === 'en' ? 'Theme editor benchmark context' : 'Contexto benchmark editor de theme' }}</h2>
        <a href="https://admin.shopify.com/store/pepagreen/themes/187256701301/editor?previewPath=%2Fpages%2Favada-faqs%3Fview%3D8&section=template--26973621518709__benefits_product_8cTCBf" target="_blank" rel="noreferrer">
          {{ i18n.lang() === 'en' ? 'Open reference editor URL' : 'Abrir URL de referencia del editor' }}
        </a>
      </section>
    </section>
  `,
  styles: [`
    .wrap { display:grid; gap:16px; }
    .hero, .diagram, .brands, .notes { border:1px solid #2f2f2f; background:#111; padding:16px; }
    .eyebrow { font-size:12px; color:#a8a8a8; letter-spacing:.8px; }
    h1, h2, h3 { text-transform:uppercase; }
    .rows { display:grid; gap:10px; margin-top:10px; }
    .row { border:1px solid #2f2f2f; background:#151515; padding:10px; }
    .bars { display:grid; gap:6px; margin-top:8px; }
    .bars div { display:grid; grid-template-columns:72px 1fr; gap:8px; align-items:center; }
    .bars small { color:#b9b9b9; text-transform:uppercase; font-size:10px; }
    .bar { display:block; height:10px; border:1px solid #2f2f2f; }
    .bar.a { background:linear-gradient(90deg,#d7d7d7,#9f9f9f); }
    .bar.h { background:linear-gradient(90deg,#9cb8d4,#5f7080); }
    .bar.t { background:linear-gradient(90deg,#6a6a6a,#3e3e3e); }
    .grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(230px,1fr)); gap:10px; margin-top:10px; }
    .grid article { border:1px solid #2f2f2f; background:#151515; padding:10px; }
    .notes a { color:#cfe2ff; text-decoration:none; border:1px solid #3a3a3a; padding:8px 10px; display:inline-block; }
  `]
})
export class PerformanceLabPageComponent {
  constructor(public i18n: I18nService) {}

  readonly stressRows = [
    { labelEs: 'Capacidad JS en frontend', labelEn: 'Frontend JS capacity', angular: 92, hydrogen: 86, theme: 58 },
    { labelEs: 'Resistencia a picos de trafico', labelEn: 'Traffic peak resilience', angular: 90, hydrogen: 88, theme: 63 },
    { labelEs: 'Control de UX compleja', labelEn: 'Complex UX control', angular: 95, hydrogen: 87, theme: 61 },
    { labelEs: 'Mantenibilidad a largo plazo', labelEn: 'Long-term maintainability', angular: 94, hydrogen: 85, theme: 57 },
  ];

  readonly ecommerceRefs = [
    { name: 'Gymshark', es: 'Escala internacional sobre Shopify Plus y stack moderno de alto rendimiento.', en: 'International scale on Shopify Plus with a modern high-performance stack.' },
    { name: 'SKIMS', es: 'Drops de altisima demanda, data stack y operacion D2C global.', en: 'High-demand drops, data stack and global D2C operations.' },
    { name: 'Allbirds', es: 'Caso conocido en ecosistema Shopify con foco en velocidad y conversion.', en: 'Known Shopify ecosystem case focused on speed and conversion.' },
    { name: 'Kylie Cosmetics', es: 'Picos masivos de trafico y necesidad de frontend robusto para lanzamientos.', en: 'Massive traffic peaks and need for robust frontend during launches.' },
    { name: 'Heinz to Home', es: 'Go-to-market rapido D2C con estructura preparada para evolucion tecnica.', en: 'Fast D2C go-to-market with a structure ready for technical evolution.' },
    { name: 'Mattel', es: 'Arquitectura composable/headless para marcas y experiencias multiples.', en: 'Composable/headless architecture for multiple brands and experiences.' },
  ];
}

