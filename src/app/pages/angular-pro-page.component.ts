import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-angular-pro-page',
  template: `
    <section class="wrap">
      <header class="hero">
        <p class="eyebrow">* ANGULAR PRO COMMERCE</p>
        <h1>Por que Angular para marcas grandes</h1>
        <p>
          Cuando una marca escala, no solo vende productos: ejecuta campanas, landings, AB tests,
          personalizacion y equipos grandes. Angular aguanta ese ritmo mejor que un theme tradicional.
        </p>
      </header>

      <section class="numbers">
        <h2>- Cifras reales (Yeezy / adidas)</h2>
        <div class="stats-grid">
          <article>
            <h3>€1.2B+</h3>
            <p>Ingresos Yeezy en 2022 (adidas annual report).</p>
          </article>
          <article>
            <h3>~€750M</h3>
            <p>Ventas de inventario Yeezy en 2023 (Q2/Q3).</p>
          </article>
          <article>
            <h3>€500M</h3>
            <p>Impacto negativo interanual por fin de partnership Yeezy.</p>
          </article>
          <article>
            <h3>€5.2B</h3>
            <p>North America 2023 en adidas, mercado clave para performance digital.</p>
          </article>
        </div>
      </section>

      <section class="grid">
        <article>
          <h3>+ Lady Gaga (Shopify Hydrogen)</h3>
          <p>Caso headless oficial: +128% add-to-cart y +55% AOV tras el rebuild con Shopify Hydrogen.</p>
        </article>
        <article>
          <h3>+ Mattel (Shopify + Headless CMS)</h3>
          <p>Primera venta agotada en 13 minutos sin caida; evolucion a flash sales diarias con stack composable.</p>
        </article>
        <article>
          <h3>+ Mattel CX (Headless)</h3>
          <p>Mejora de conversion de 4.9x en web y 9.5x en mobile con arquitectura modular y reusable.</p>
        </article>
        <article>
          <h3>+ Haus Labs (Composable stack)</h3>
          <p>Lanzamiento global en 100 paises desde dia uno y flujo digital que mejora conversion del trial a full-size.</p>
        </article>
        <article>
          <h3>+ adidas (escala enterprise)</h3>
          <p>Facturacion 2023: €21.4B. Referencia real de operacion global con altisimo volumen.</p>
        </article>
        <article>
          <h3>+ SKIMS (Shopify ecosystem)</h3>
          <p>Sold out en 10 minutos en lanzamiento y operacion data-driven conectada con Shopify.</p>
        </article>
        <article>
          <h3>+ Gymshark (Shopify Plus)</h3>
          <p>£41M en ventas (2017) y crecimiento internacional acelerado en 131 paises.</p>
        </article>
        <article>
          <h3>+ Mastermind Toys (Shopify)</h3>
          <p>+286% conversion y +288% clientes por chat en estrategia omnicanal.</p>
        </article>
        <article>
          <h3>+ Heinz to Home (D2C)</h3>
          <p>Canal directo levantado a alta velocidad: ejemplo de time-to-market en empresa de gran facturacion.</p>
        </article>
        <article>
          <h3>+ Kylie Cosmetics (high-demand)</h3>
          <p>Marca multimillonaria con picos de trafico masivos en drops y operacion D2C global.</p>
        </article>
      </section>

      <section class="sources">
        <h2>* Fuentes</h2>
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
        <h2>* Ventajas clave frente a un theme clasico</h2>
        <ul>
          <li>- Escalabilidad por arquitectura, no por parches.</li>
          <li>- Mejor experiencia para equipos de dev grandes.</li>
          <li>- Control total de UX y componentes de negocio.</li>
          <li>- Base perfecta para proyectos premium y enterprise.</li>
          <li>- Frontend desacoplado para evolucionar diseño sin romper la capa de comercio.</li>
          <li>- Navegacion SPA mas rapida y con menos friccion en conversion.</li>
          <li>- Integraciones enterprise con CRM, ERP, PIM, CDP, BI y DAM sin rehacer la tienda.</li>
          <li>- Arquitectura apta para equipos grandes con testing, CI/CD y despliegues continuos.</li>
          <li>- Mejor soporte para multi-brand, multi-country y catálogos complejos.</li>
          <li>- Personalizacion avanzada y experimentacion (AB tests, segmentacion, reglas).</li>
          <li>- Menos dependencia de plantillas cerradas y mas libertad de experiencia de marca.</li>
          <li>- Posibilidad de usar servicios externos profesionales fuera del ecosistema de apps.</li>
          <li>- Evita quedar limitado solo a apps de Shopify: puedes integrar herramientas best-of-breed.</li>
          <li>- Coste tecnico mas eficiente a medio plazo cuando escalas trafico y complejidad.</li>
        </ul>
      </section>
    </section>
  `,
  styles: [`
    .wrap { display:grid; gap:18px; }
    .hero, .numbers, .wins, .sources, .grid article { border:1px solid #2f2f2f; background:#111; padding:18px; }
    .eyebrow { font-size:12px; letter-spacing:1px; color:#a1a1a1; }
    h1, h2, h3 { text-transform: uppercase; }
    .stats-grid { margin-top:10px; display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:10px; }
    .stats-grid article { border:1px solid #2f2f2f; background:#141414; padding:10px; }
    .stats-grid h3 { margin:0 0 6px; font-size:24px; }
    .grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:12px; }
    .sources a { color:#d4d4d4; }
    ul { margin:10px 0 0; padding-left:18px; }
    li { margin-bottom:8px; color:#cecece; }
  `]
})
export class AngularProPageComponent {}
