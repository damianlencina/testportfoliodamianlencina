# Damián Lencina · Portfolio

> Portfolio personal de Damián Lencina · Diseño de aprendizaje y realización audiovisual.
> Versión Z · Estilo "AI Studio / Future Editorial"

Sitio estático sin dependencias de servidor. Vanilla HTML + CSS + JS.

## Estructura del proyecto

```
portfolio_z_v1/
├── index.html              ← Home
├── sobre.html              ← Página de presentación
├── caso_transformacion.html ← Caso 01 · COTO transformación
├── caso_coto.html          ← Caso 02 · Medios de Pago
├── caso_magoya.html        ← Caso 03 · Magoya Cine
├── caso_ia.html            ← Caso 04 · Portfolio con IA
├── notas.html              ← Blog / Notas
├── 404.html                ← Página de error
├── style.css               ← Sistema visual completo
├── script.js               ← Interactividad
├── favicon.svg             ← Marca aurora
├── favicon-32.png          ← Favicon PNG
├── apple-touch-icon.png    ← Icono iOS
├── robots.txt              ← Indicaciones para crawlers
├── sitemap.xml             ← Mapa del sitio para SEO
├── Damian_Lencina_Resumen.pdf ← CV
└── img/                    ← Imágenes (JPG + WebP)
```

## Stack y características

- **Sin frameworks** — Vanilla HTML/CSS/JS. Cero dependencias de build.
- **Sistema de diseño** — Design tokens en CSS variables (`:root`).
- **Tipografía** — Inter + JetBrains Mono (Google Fonts).
- **Imágenes optimizadas** — Cada JPG tiene su versión WebP servida con `<picture>` (34% menos peso en navegadores modernos).
- **Modo oscuro** — Toggle con persistencia en localStorage. Respeta `prefers-color-scheme`. Sin "flash of wrong theme".
- **SEO completo** — Meta tags, Open Graph, Twitter Cards, Schema.org JSON-LD, sitemap.xml, robots.txt.
- **Accesibilidad** — Atributos ARIA en componentes interactivos, contraste WCAG AA, navegación por teclado.
- **Responsive** — Mobile-first probado en 375px, 414px y 1024px+.
- **Performance** — Sin librerías externas, fuentes con `font-display: swap`, lazy-loading en imágenes.

## ⚠️ Antes de hacer deploy: ajustar URLs

Las páginas internas tienen hardcoded `https://damianlencina.com` como dominio en:
- Canonical URLs
- Open Graph (`og:url`, `og:image`)
- Twitter Cards
- Schema.org JSON-LD
- sitemap.xml

Si tu dominio final es distinto (ej: `damilencina.github.io`, `damian.com.ar`, etc.), reemplazá `damianlencina.com` por el real en todos los archivos.

### Reemplazo rápido con un comando

```bash
# Reemplazar en todos los .html, .xml y .txt
find . -type f \( -name "*.html" -o -name "*.xml" -o -name "*.txt" \) \
  -exec sed -i 's|damianlencina\.com|TU-DOMINIO.com|g' {} +
```

(En Mac usar `sed -i ''` con dos comillas vacías después de `-i`.)

## Deploy a GitHub Pages

GitHub Pages es **gratis** y perfecto para sitios estáticos como este.

### Opción A — Usando GitHub Web (sin instalar nada)

1. **Crear cuenta en GitHub** (si no tenés): https://github.com/signup
2. **Crear un nuevo repositorio**:
   - Nombre del repo: `damianlencina.github.io` (importante: tiene que ser exactamente así, con tu usuario)
   - Público
   - Sin README (porque ya lo tenemos)
3. **Subir los archivos**:
   - En el repo nuevo, clic en "uploading an existing file"
   - Arrastrar todo el contenido de la carpeta `portfolio_z_v1/` (no la carpeta, su contenido)
   - Commit message: "Initial deploy"
4. **Activar Pages**:
   - Ir a Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: `main`, folder: `/ (root)`
   - Save
5. **Esperar 1-2 minutos** y entrar a `https://TU-USUARIO.github.io/`

### Opción B — Con dominio propio

Si comprás un dominio (ej: `damianlencina.com`, `damilencina.ar`):

1. Hacer todos los pasos de la Opción A
2. En tu proveedor de dominio (Nic.ar, Namecheap, etc.), agregar estos registros DNS:
   ```
   A     @     185.199.108.153
   A     @     185.199.109.153
   A     @     185.199.110.153
   A     @     185.199.111.153
   CNAME www   TU-USUARIO.github.io.
   ```
3. En el repo, agregar un archivo llamado `CNAME` (sin extensión) con el dominio:
   ```
   damianlencina.com
   ```
4. En Settings → Pages → Custom domain: poner `damianlencina.com`
5. Activar "Enforce HTTPS" (después de que el DNS propague, ~30 min)

### Opción C — Vercel (alternativa gratis, con previews automáticos)

1. Crear cuenta en https://vercel.com (puede ser con GitHub)
2. New Project → Import desde GitHub
3. Deploy (Vercel detecta automáticamente que es estático)
4. URL final: `tu-proyecto.vercel.app` o dominio propio

## Trabajar localmente

No necesitás build ni instalación. Cualquier servidor estático sirve.

### Con Python (ya instalado en macOS/Linux):
```bash
cd portfolio_z_v1
python3 -m http.server 8080
```
Abrir `http://localhost:8080`

### Con VS Code:
Instalar la extensión **Live Server** y hacer clic derecho sobre `index.html` → "Open with Live Server".

## Roadmap / Mejoras futuras

- [ ] Grabar y subir el video de presentación real (placeholder en hero)
- [ ] Escribir las 3 notas del blog
- [ ] Mini-galería de Magoya con más piezas audiovisuales
- [ ] Página de "Proceso" propia
- [ ] Easter egg / detalle interactivo
- [ ] Página de servicios separada con más detalle por cada uno

## Sobre el proyecto

Este portfolio se construyó en una conversación iterativa con IA. Es a la vez:
- Un portfolio profesional para Damián Lencina
- La demostración del Caso 04 ("Aprender a crear con IA")

El proceso completo y las decisiones de diseño están documentadas en `caso_ia.html`.

---

© 2026 Damián Lencina · Buenos Aires, Argentina
[LinkedIn](https://www.linkedin.com/in/damian-ezequiel-lencina/) · [Instagram](https://www.instagram.com/magoyacine)
