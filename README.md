<div align="center">
  <img src=".github/preview.png" alt="Atlas Tech Preview" width="100%" />
  <h1>Atlas Tech</h1>
  <p>Directorio del ecosistema tecnologico estatal</p>

<a href="https://atlas-sinaloa.tech"><img src="https://img.shields.io/badge/sitio-atlas--sinaloa.tech-blue?style=flat-square" alt="Sitio web" /></a>
<img src="https://img.shields.io/badge/astro-5.x-purple?style=flat-square&logo=astro" alt="Astro" />
<img src="https://img.shields.io/badge/react-19-blue?style=flat-square&logo=react" alt="React" />
<img src="https://img.shields.io/badge/tailwind-4-cyan?style=flat-square&logo=tailwindcss" alt="Tailwind" />
<img src="https://img.shields.io/badge/hosting-Cloudflare%20Pages-orange?style=flat-square&logo=cloudflarepages" alt="Cloudflare Pages" />

</div>

<br />

Sitio estatico construido con Astro, React y Tailwind CSS, pensado para ser de bajo costo: los unicos gastos son el dominio y el tiempo invertido.

Este repositorio cubre un solo estado por ahora, pero esta disenado para que cualquier persona pueda hacer fork y crear el atlas de su propio estado.

## 🚀 Inicio rapido

```bash
pnpm install
pnpm dev        # servidor de desarrollo
pnpm build      # build de produccion
pnpm preview    # preview del build
```

También puedes hacer uso de `npm` pero asegurate de eliminar el archivo `pnpm-lock.yaml` y elimina la línea de _packageManager_ en el _package.json_

## 🗺️ Mapas

Los mapas geograficos utilizan archivos tipo **AGEM** (Area Geoestadistica Municipal). Puedes descargarlos desde el **Marco Geoestadistico** de INEGI en la plataforma de Geografia Nacional:

https://www.inegi.org.mx/temas/mg/#mapas

Una vez descargado, coloca el archivo en la carpeta `public/topo/`.

## 📝 Formulario de registro (SubmitWizard)

El componente `src/components/forms/SubmitWizard.tsx` es un wizard multi-paso para que usuarios envien sus registros (startups, empresas, comunidades, personas, etc.).

Este formulario **requiere un backend** para funcionar. En nuestra implementacion usamos un **flujo de n8n** como webhook que recibe los datos del formulario. Sin embargo, como el sitio es estatico, **los datos se agregan manualmente** al contenido del repositorio para mantener los costos bajos.

Puedes reemplazar el webhook con cualquier backend o servicio que prefieras.

## 📅 Calendario de eventos (EventCalendar)

El componente `src/components/calendar/EventCalendar.tsx` consume un **Google Sheets publicado como CSV**. La hoja debe tener las siguientes columnas en orden:

| Columna     | Formato    | Ejemplo                     |
| ----------- | ---------- | --------------------------- |
| title       | texto      | Meetup React Sinaloa        |
| organizer   | texto      | Comunidad JS                |
| date        | M/DD/YYYY  | 3/15/2026                   |
| startTime   | texto      | 18:00                       |
| endTime     | texto      | 20:00                       |
| description | texto      | Charla sobre hooks          |
| url         | URL        | https://...                 |
| location    | texto      | WeWork Culiacan             |
| mapsUrl     | URL        | https://maps.google.com/... |
| isInPerson  | TRUE/FALSE | TRUE                        |
| meetLink    | URL        | https://meet.google.com/... |
| image       | URL        | https://...                 |
| registerUrl | URL        | https://...                 |

Los eventos se mantienen actualizados manualmente en la hoja de Google Sheets.

## ☁️ Hosting

Hospedamos en **Cloudflare Pages** en lugar de GitHub Pages para aprovechar su CDN global con mejor rendimiento. El deploy es automatico desde la rama `main`.

## 🍴 Crea tu propio atlas

1. Haz fork de este repositorio
2. Reemplaza los datos de contenido con los de tu estado
3. Descarga los mapas AGEM de tu estado desde INEGI
4. Configura tu Google Sheet de eventos
5. Conecta tu backend para el formulario de registro (o agrega datos manualmente)
6. Despliega en Cloudflare Pages u otro hosting estatico
