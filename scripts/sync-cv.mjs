/**
 * Copia el build de produccion a /cv (GitHub Pages en /cv/).
 * Ejecutar tras: ng build
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const src = path.join(root, 'dist', 'shopify-angular-cv', 'browser');
const dest = path.join(root, 'cv');

if (!fs.existsSync(src)) {
  console.error('No existe', src, '— ejecuta antes: npm run build');
  process.exit(1);
}

fs.mkdirSync(dest, { recursive: true });
const incoming = new Set(fs.readdirSync(src));
for (const name of fs.readdirSync(dest)) {
  if (!incoming.has(name)) {
    fs.rmSync(path.join(dest, name), { recursive: true, force: true });
  }
}
for (const name of incoming) {
  const from = path.join(src, name);
  const to = path.join(dest, name);
  fs.rmSync(to, { recursive: true, force: true });
  fs.cpSync(from, to, { recursive: true });
}
console.log('OK: copiado', src, '->', dest);
