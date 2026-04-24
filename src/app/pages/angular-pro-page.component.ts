import { Component } from '@angular/core';
import { I18nService } from '../services/i18n.service';

@Component({
  standalone: true,
  selector: 'app-angular-pro-page',
  template: `
    <section class="wrap">
      <header class="hero">
        <p class="eyebrow">* ANGULAR PRO COMMERCE</p>
        <h1>{{ i18n.t('angularPro.title') }}</h1>
        <p>{{ i18n.t('angularPro.subtitle') }}</p>
      </header>

      <section class="numbers">
        <h2>- {{ i18n.t('angularPro.metricsTitle') }}</h2>
        <div class="stats-grid">
          <article>
            <h3>€1.2B+</h3>
            <p>{{ i18n.lang() === 'en' ? 'Yeezy revenue in 2022 (adidas annual report).' : 'Ingresos Yeezy en 2022 (adidas annual report).' }}</p>
          </article>
          <article>
            <h3>~€750M</h3>
            <p>{{ i18n.lang() === 'en' ? 'Yeezy inventory sales in 2023 (Q2/Q3).' : 'Ventas de inventario Yeezy en 2023 (Q2/Q3).' }}</p>
          </article>
          <article>
            <h3>€500M</h3>
            <p>{{ i18n.lang() === 'en' ? 'Year-over-year negative impact from ending the Yeezy partnership.' : 'Impacto negativo interanual por fin de partnership Yeezy.' }}</p>
          </article>
          <article>
            <h3>€5.2B</h3>
            <p>{{ i18n.lang() === 'en' ? 'North America 2023 in adidas, a key market for digital performance.' : 'North America 2023 en adidas, mercado clave para performance digital.' }}</p>
          </article>
        </div>
      </section>

      <section class="grid">
        @for (item of cases; track item.titleEs) {
          <article>
            <h3>+ {{ i18n.lang() === 'en' ? item.titleEn : item.titleEs }}</h3>
            <p>{{ i18n.lang() === 'en' ? item.textEn : item.textEs }}</p>
          </article>
        }
      </section>

      <section class="sources">
        <h2>* {{ i18n.t('angularPro.sources') }}</h2>
        <ul>
          <li><a href="https://report.adidas-group.com/2023/en/group-management-report-financial-review/business-performance/income-statement.html" target="_blank" rel="noreferrer">adidas Annual Report 2023 - Income Statement</a></li>
          <li><a href="https://report.adidas-group.com/2023/en/group-management-report-financial-review/business-performance-by-segment/north-america.html" target="_blank" rel="noreferrer">adidas Annual Report 2023 - North America</a></li>
          <li><a href="https://commerce-ui.com/work/official-lady-gaga-shopify-hydrogen-website" target="_blank" rel="noreferrer">Official Lady Gaga Shopify Hydrogen case</a></li>
          <li><a href="https://www.contentstack.com/resources/case-study/mattel-augments-shopifys-scalable-e-commerce-with-contentstacks-enterprise-ready-cms-capabilities-for-a-dynamic-cross-brand-experience" target="_blank" rel="noreferrer">Mattel headless + Shopify case</a></li>
          <li><a href="https://contentstack.com/resources/case-study/mattel-reimagines-customer-experience-to-maximize-engagement-and-drive-higher-conversions" target="_blank" rel="noreferrer">Mattel conversion uplift (headless)</a></li>
          <li><a href="https://www.flow.io/blog/how-lady-gagas-haus-labs-launched-around-the-world-in-one-day-and-you-can-too" target="_blank" rel="noreferrer">Haus Labs global launch (composable commerce)</a></li>
          <li><a href="http://customers.convertflow.com/stories/haus-labs" target="_blank" rel="noreferrer">Haus Labs conversion flow case</a></li>
          <li><a href="https://www.fivetran.com/case-studies/how-fivetran-powers-skims-fashion-empire" target="_blank" rel="noreferrer">SKIMS + Shopify data case</a></li>
          <li><a href="https://www.shopify.com/case-studies/gymshark" target="_blank" rel="noreferrer">Gymshark Shopify Plus case</a></li>
          <li><a href="https://www.shopify.com/au/case-studies/mastermind-toys" target="_blank" rel="noreferrer">Mastermind Toys Shopify case</a></li>
          <li><a href="https://extuitive.com/articles/what-companies-use-shopify" target="_blank" rel="noreferrer">Heinz to Home and enterprise Shopify examples</a></li>
          <li><a href="https://shopplaza.io/blog/kylie-cosmetics-shopify.html" target="_blank" rel="noreferrer">Kylie Cosmetics Shopify case overview</a></li>
        </ul>
      </section>

      <section class="wins">
        <h2>* {{ i18n.t('angularPro.wins') }}</h2>
        <ul>
          @for (item of wins; track item.es) {
            <li>- {{ i18n.lang() === 'en' ? item.en : item.es }}</li>
          }
        </ul>
      </section>

      <section class="compare">
        <h2>* {{ i18n.lang() === 'en' ? 'Angular vs Shopify Theme - Technical comparison' : 'Angular vs Shopify Theme - comparativa tecnica' }}</h2>
        <p>{{ i18n.lang() === 'en' ? 'Higher is better in all axes. Reference values for enterprise implementation capacity.' : 'Cuanto mas alto, mejor en todos los ejes. Valores de referencia para capacidad de implementacion enterprise.' }}</p>
        <div class="chart">
          @for (row of compareRows; track row.metricEs) {
            <article class="chart-row">
              <h3>{{ i18n.lang() === 'en' ? row.metricEn : row.metricEs }}</h3>
              <div class="bars">
                <div class="bar-label">{{ i18n.lang() === 'en' ? 'Angular' : 'Angular' }}</div>
                <div class="bar-wrap"><span class="bar angular" [style.width.%]="row.angular">{{ row.angular }}/100</span></div>
              </div>
              <div class="bars">
                <div class="bar-label">{{ i18n.lang() === 'en' ? 'Shopify Theme' : 'Tema Shopify' }}</div>
                <div class="bar-wrap"><span class="bar theme" [style.width.%]="row.theme">{{ row.theme }}/100</span></div>
              </div>
            </article>
          }
        </div>
      </section>
    </section>
  `,
  styles: [`
    .wrap { display:grid; gap:18px; }
    .hero, .numbers, .wins, .sources, .compare, .grid article { border:1px solid #2f2f2f; background:#111; padding:18px; }
    .eyebrow { font-size:12px; letter-spacing:1px; color:#a1a1a1; }
    h1, h2, h3 { text-transform: uppercase; }
    .stats-grid { margin-top:10px; display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:10px; }
    .stats-grid article { border:1px solid #2f2f2f; background:#141414; padding:10px; }
    .stats-grid h3 { margin:0 0 6px; font-size:24px; }
    .grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:12px; }
    .sources a { color:#d4d4d4; }
    ul { margin:10px 0 0; padding-left:18px; }
    li { margin-bottom:8px; color:#cecece; }
    .compare p { color:#b8b8b8; margin:8px 0 12px; }
    .chart { display:grid; gap:10px; }
    .chart-row { border:1px solid #2f2f2f; background:#141414; padding:10px; }
    .chart-row h3 { margin:0 0 8px; font-size:13px; }
    .bars { display:grid; grid-template-columns:72px 1fr; gap:8px; align-items:center; margin-bottom:6px; }
    .bar-label { font-size:11px; color:#b8b8b8; text-transform:uppercase; }
    .bar-wrap { border:1px solid #2f2f2f; background:#0f0f0f; height:20px; }
    .bar { height:100%; display:flex; align-items:center; padding:0 6px; font-size:10px; font-weight:700; }
    .bar.angular { background:linear-gradient(90deg,#d5d5d5,#9f9f9f); color:#111; }
    .bar.theme { background:linear-gradient(90deg,#5d5d5d,#3e3e3e); color:#f2f2f2; }
  `]
})
export class AngularProPageComponent {
  constructor(public i18n: I18nService) {}

  readonly cases = [
    { titleEs: 'Lady Gaga (Shopify Hydrogen)', textEs: 'Caso headless oficial: +128% add-to-cart y +55% AOV tras el rebuild con Shopify Hydrogen.', titleEn: 'Lady Gaga (Shopify Hydrogen)', textEn: 'Official headless case: +128% add-to-cart and +55% AOV after the Shopify Hydrogen rebuild.' },
    { titleEs: 'Mattel (Shopify + Headless CMS)', textEs: 'Primera venta agotada en 13 minutos sin caida; evolucion a flash sales diarias con stack composable.', titleEn: 'Mattel (Shopify + Headless CMS)', textEn: 'First sale sold out in 13 minutes with no downtime; evolved into daily flash sales with a composable stack.' },
    { titleEs: 'Mattel CX (Headless)', textEs: 'Mejora de conversion de 4.9x en web y 9.5x en mobile con arquitectura modular y reusable.', titleEn: 'Mattel CX (Headless)', textEn: '4.9x web and 9.5x mobile conversion uplift through modular and reusable architecture.' },
    { titleEs: 'Haus Labs (Composable stack)', textEs: 'Lanzamiento global en 100 paises desde dia uno y flujo digital que mejora conversion del trial a full-size.', titleEn: 'Haus Labs (Composable stack)', textEn: 'Global launch in 100 countries from day one and digital flow improving trial-to-full-size conversion.' },
    { titleEs: 'SKIMS (Shopify headless ecosystem)', textEs: 'Operacion de alto volumen sobre Shopify con enfoque composable, picos de trafico masivos y ejecucion de drops globales.', titleEn: 'SKIMS (Shopify headless ecosystem)', textEn: 'High-volume operation on Shopify with a composable approach, massive traffic peaks and global drop execution.' },
    { titleEs: 'Gymshark (Headless-ready Shopify Plus)', textEs: 'Escala internacional en Shopify Plus con arquitectura desacoplable para performance, campañas y crecimiento en multiples mercados.', titleEn: 'Gymshark (Headless-ready Shopify Plus)', textEn: 'International scale on Shopify Plus with decouplable architecture for performance, campaigns and growth across markets.' },
    { titleEs: 'Kylie Cosmetics (High-demand headless direction)', textEs: 'Marca de altisima demanda con operativa D2C global en Shopify y stack preparado para experiencias desacopladas.', titleEn: 'Kylie Cosmetics (High-demand headless direction)', textEn: 'High-demand brand with global D2C operations on Shopify and a stack prepared for decoupled experiences.' },
    { titleEs: 'Heinz to Home (Composable D2C on Shopify)', textEs: 'Canal D2C lanzado en tiempo record con una base Shopify preparada para evolucion composable y activaciones rapidas.', titleEn: 'Heinz to Home (Composable D2C on Shopify)', textEn: 'D2C channel launched in record time on a Shopify base prepared for composable evolution and fast activations.' },
    { titleEs: 'Staples Canada (Headless commerce on Shopify)', textEs: 'Caso enterprise de migracion a experiencia headless para mejorar velocidad, mantenibilidad y consistencia omnicanal.', titleEn: 'Staples Canada (Headless commerce on Shopify)', textEn: 'Enterprise migration case to a headless experience to improve speed, maintainability and omnichannel consistency.' },
    { titleEs: 'Mastermind Toys (Composable customer experience)', textEs: 'Estrategia de experiencia desacoplada conectada a Shopify con mejora fuerte de conversion y relacion digital con cliente.', titleEn: 'Mastermind Toys (Composable customer experience)', textEn: 'Decoupled experience strategy connected to Shopify with strong conversion uplift and digital customer relationship gains.' },
  ];

  readonly wins = [
    { es: 'Escalabilidad por arquitectura, no por parches.', en: 'Scalability by architecture, not by patches.' },
    { es: 'Mejor experiencia para equipos de dev grandes.', en: 'Better experience for large development teams.' },
    { es: 'Control total de UX y componentes de negocio.', en: 'Full control over UX and business components.' },
    { es: 'Base perfecta para proyectos premium y enterprise.', en: 'Perfect foundation for premium and enterprise projects.' },
    { es: 'Frontend desacoplado para evolucionar diseño sin romper la capa de comercio.', en: 'Decoupled frontend to evolve design without breaking the commerce layer.' },
    { es: 'Navegacion SPA mas rapida y con menos friccion en conversion.', en: 'Faster SPA navigation with less conversion friction.' },
    { es: 'Integraciones enterprise con CRM, ERP, PIM, CDP, BI y DAM sin rehacer la tienda.', en: 'Enterprise integrations with CRM, ERP, PIM, CDP, BI and DAM without rebuilding the store.' },
    { es: 'Arquitectura apta para equipos grandes con testing, CI/CD y despliegues continuos.', en: 'Architecture ready for large teams with testing, CI/CD and continuous deployments.' },
    { es: 'Mejor soporte para multi-brand, multi-country y catalogos complejos.', en: 'Better support for multi-brand, multi-country and complex catalogs.' },
    { es: 'Personalizacion avanzada y experimentacion (AB tests, segmentacion, reglas).', en: 'Advanced personalization and experimentation (AB tests, segmentation, rules).' },
    { es: 'Menos dependencia de plantillas cerradas y mas libertad de experiencia de marca.', en: 'Less dependence on closed templates and more brand-experience freedom.' },
    { es: 'Posibilidad de usar servicios externos profesionales fuera del ecosistema de apps.', en: 'Ability to use professional external services beyond the app ecosystem.' },
    { es: 'Evita quedar limitado solo a apps de Shopify: puedes integrar herramientas best-of-breed.', en: 'Avoid being limited to Shopify apps only: integrate best-of-breed tools.' },
    { es: 'Coste tecnico mas eficiente a medio plazo cuando escalas trafico y complejidad.', en: 'More efficient technical cost over time when scaling traffic and complexity.' },
  ];

  readonly compareRows = [
    { metricEs: 'Rendimiento SPA sin recargas', metricEn: 'SPA performance without reloads', angular: 94, theme: 62 },
    { metricEs: 'Escalabilidad frontend', metricEn: 'Frontend scalability', angular: 96, theme: 58 },
    { metricEs: 'Arquitectura para equipos grandes', metricEn: 'Architecture for large teams', angular: 95, theme: 55 },
    { metricEs: 'Integracion con sistemas externos', metricEn: 'External systems integration', angular: 91, theme: 64 },
    { metricEs: 'Control de bundle JS', metricEn: 'JS bundle control', angular: 88, theme: 60 },
    { metricEs: 'Capacidad de UX custom', metricEn: 'Custom UX capability', angular: 97, theme: 67 },
    { metricEs: 'Testing y CI/CD enterprise', metricEn: 'Enterprise testing and CI/CD', angular: 93, theme: 57 },
    { metricEs: 'Flexibilidad en datos y metacampos', metricEn: 'Data and metafield flexibility', angular: 92, theme: 69 },
  ];
}
