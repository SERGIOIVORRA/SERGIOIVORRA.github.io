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

      <section class="diagram">
        <h2>- Dibujo de arquitectura real</h2>
        <pre>
        [ UI Angular SPA ]
                |
      [ Components + Signals ]
                |
      [ Shopify Storefront API ]
                |
      [ Cart | Collections | PDP ]
                |
      [ Checkout / Account ]
        </pre>
      </section>

      <section class="grid">
        <article>
          <h3>+ Caso real: equipos de marketing</h3>
          <p>Crean nuevas landings y experiencias sin romper el core de tienda, gracias a modulos desacoplados.</p>
        </article>
        <article>
          <h3>+ Caso real: catalogos gigantes</h3>
          <p>Filtros y paginacion en cliente con UX inmediata, evitando recargas completas en cada accion.</p>
        </article>
        <article>
          <h3>+ Caso real: internacional</h3>
          <p>Escala por features (idioma, moneda, reglas) con base de codigo mantenible y tipada.</p>
        </article>
        <article>
          <h3>+ Caso real: performance percibida</h3>
          <p>Navegacion SPA: el usuario siente velocidad continua al pasar de Home a Collection y PDP.</p>
        </article>
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
    .hero, .diagram, .wins, .grid article { border:1px solid #2f2f2f; background:#111; padding:18px; }
    .eyebrow { font-size:12px; letter-spacing:1px; color:#a1a1a1; }
    h1, h2, h3 { text-transform: uppercase; }
    .diagram pre {
      margin:0;
      background:#141414;
      border:1px solid #2f2f2f;
      padding:12px;
      color:#d5d5d5;
      overflow:auto;
    }
    .grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:12px; }
    ul { margin:10px 0 0; padding-left:18px; }
    li { margin-bottom:8px; color:#cecece; }
  `]
})
export class AngularProPageComponent {}
