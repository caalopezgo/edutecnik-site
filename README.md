# Edutecnik — Sitio público

Sitio bilingüe (ES/EN) de Edutecnik que presenta Atlas, el producto académico.

## Estado

- ✅ **Código**: GitHub en https://github.com/caalopezgo/edutecnik-site
- ✅ **Deployado**: Vercel en https://edutecnik-site.vercel.app
- ✅ **Dominio agregado en Vercel**: `edutecnik.com` (estado: "Invalid Configuration" — esperando DNS)
- ⏳ **DNS en Wix**: PENDIENTE (último paso)

## Próximos pasos

### 1. Terminar DNS en Wix (5 minutos)

En **Wix → Dominios → edutecnik.com → Editar DNS**, agrega este registro:

| Tipo | Nombre | Valor |
|------|--------|-------|
| A | @ | 216.198.79.1 |

Guarda. Espera 10-30 min a que propague.

Cuando esté listo, Vercel mostrará ✅ en lugar de "Invalid Configuration".

### 2. Verificar en Vercel

Una vez que DNS propague, `edutecnik.com` apuntará a tu sitio. Vercel lo confirmará automáticamente.

## Continuar desde otro computador

```bash
git clone https://github.com/caalopezgo/edutecnik-site.git
cd edutecnik-site
```

Para editar y probar localmente:

```bash
python3 -m http.server 4321 --directory .
```

Luego abre http://localhost:4321

## Estructura

- `index.html` — página completa (español por defecto)
- `styles.css` — estilos (tokens de Atlas)
- `main.js` — toggle de idioma, comportamientos
- `og-image.png` — previsualización para redes
- `favicon.svg`, `apple-touch-icon.png` — íconos
- `vercel.json` — configuración de deploy
- `robots.txt`, `sitemap.xml` — SEO

## Idioma

- Español es el HTML default (SEO)
- Inglés vive en atributos `data-en` / `data-en-html`
- Toggle en header: cambia todo incluido `<title>` y meta tags
- URL: `?lang=es` o `?lang=en` fuerza un idioma

## Deploy automático

Cada push a `main` en GitHub redespliega en Vercel automáticamente.

```bash
git add .
git commit -m "tu mensaje"
git push
```

En ~1 min aparece en producción.

## Notas

- `hola@edutecnik.com` es un placeholder en el HTML. Cambiar si es necesario.
- Contraste de texto está en WCAG AA (público web).
- Sin build step — HTML/CSS/JS directos, listos para Vercel.
