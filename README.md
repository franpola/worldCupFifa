# ⚽ World Cup 2026 Dashboard

Dashboard de la fase de grupos del Mundial 2026. Se actualiza automáticamente cada noche con los resultados del día.

## Stack

- **Frontend**: React + Vite
- **Datos**: JSON estático en el repo
- **Actualización automática**: GitHub Actions (cron diario a las 23:30 UTC)
- **Fuente de datos**: ESPN API (gratuita, sin registro)
- **Hosting**: GitHub Pages o Vercel (gratis)

## Instalación local

```bash
npm install
npm run dev
```

## Actualizar resultados manualmente

```bash
node scripts/fetch-results.js
```

## Build para producción

```bash
npm run build
```

## Despliegue en Vercel

1. Conecta el repo en [vercel.com](https://vercel.com)
2. Framework: **Vite**
3. Deploy → listo

## Despliegue en GitHub Pages

1. Instala el plugin: `npm install -D gh-pages`
2. Añade a `package.json`:
   ```json
   "homepage": "https://tu-usuario.github.io/worldcup-dashboard",
   "scripts": {
     "deploy": "gh-pages -d dist"
   }
   ```
3. `npm run build && npm run deploy`

## Cómo funciona la actualización automática

El archivo `.github/workflows/update-results.yml` ejecuta `scripts/fetch-results.js` cada noche. El script:
1. Llama a la ESPN API (sin key, sin registro)
2. Parsea los standings por grupo
3. Sobreescribe `src/data/groups.json`
4. Hace commit y push al repo

Vercel detecta el push y redesplega automáticamente en ~30 segundos.

También puedes lanzarlo manualmente desde la pestaña **Actions** de tu repo en GitHub.
