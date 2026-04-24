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
          <p>Case study publicado con +128% add-to-cart y +55% AOV tras el rebuild del sitio oficial.</p>
        </article>
        <article>
          <h3>+ Haus Labs (Lady Gaga brand)</h3>
          <p>Post-purchase quiz flow en Shopify con 16% de compra en full-size y hasta 75% completion.</p>
        </article>
        <article>
          <h3>+ Gymshark (Shopify Plus)</h3>
          <p>Replatform desde Adobe a Shopify; marca global con £41M ventas 2017 y escalado en 131 paises.</p>
        </article>
        <article>
          <h3>+ Mastermind Toys (Shopify)</h3>
          <p>Case Shopify reporta +286% conversion y +288% clientes atendidos via chat.</p>
        </article>
      </section>

      <section class="sources">
        <h2>* Fuentes</h2>
        <ul>
          <li><a href="https://report.adidas-group.com/2023/en/group-management-report-financial-review/business-performance/income-statement.html" target="_blank" rel="noreferrer">adidas Annual Report 2023 - Income Statement</a></li>
          <li><a href="https://report.adidas-group.com/2023/en/group-management-report-financial-review/business-performance-by-segment/north-america.html" target="_blank" rel="noreferrer">adidas Annual Report 2023 - North America</a></li>
          <li><a href="https://commerce-ui.com/work/official-lady-gaga-shopify-hydrogen-website" target="_blank" rel="noreferrer">Official Lady Gaga Shopify Hydrogen case</a></li>
          <li><a href="http://customers.convertflow.com/stories/haus-labs" target="_blank" rel="noreferrer">Haus Labs Shopify conversion case</a></li>
          <li><a href="https://www.shopify.com/case-studies/gymshark" target="_blank" rel="noreferrer">Gymshark - Shopify case study</a></li>
          <li><a href="https://www.shopify.com/au/case-studies/mastermind-toys" target="_blank" rel="noreferrer">Mastermind Toys - Shopify case study</a></li>
        </ul>
      </section>

      <section class="wins">
        <h2>* Ventajas clave frente a un theme clasico</h2>
        <ul>
          <li>- Escalabilidad por arquitectura, no por parches.</li>
          <li>- Mejor experiencia para equipos de dev grandes.</li>
          <li>- Control total de UX y componentes de negocio.</li>
          <li>- Base perfecta para proyectos premium y enterprise.</li>
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
