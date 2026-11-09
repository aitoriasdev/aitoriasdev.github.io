---
title: "Aitorias.is-a.dev Portfolio"
tagline: "Mi espacio personal en la web: un sitio estático rápido, accesible y bilingüe creado con Astro v7 y Tailwind CSS v4."
status: "active"
startDate: "2026-02-01"
order: 2
role: "Diseño y desarrollo"
techStack: ["Astro", "TypeScript", "Tailwind"]
thumbnail: "../../../assets/images/projects/aitoriasdev-portfolio.webp"
gitHubUrl: "https://github.com/aitoriasdev/aitoriasdev.github.io"
liveUrl: "https://aitorias.is-a.dev/es"
featured: true
lang: "es"
highlights:
  - "Accesibilidad ante todo: un menú de accesibilidad integrado (menos movimiento, alto contraste, texto más grande, fuente para dislexia) que se aplica antes del primer pintado, así que la página nunca parpadea."
  - "Totalmente bilingüe, con rutas traducidas (/projects ↔ /es/proyectos) y un diccionario de traducciones tipado que una prueba mantiene sincronizado entre idiomas."
  - "Pensado para el rendimiento: build estático, imágenes responsive y Google Analytics fuera del hilo principal con Partytown, tras un banner de consentimiento."
  - "Herramientas de nivel profesional: colecciones de contenido con tipos comprobados, Oxlint y Oxfmt, Vitest, astro check, CodeQL y Dependabot, con despliegue mediante GitHub Actions."
---

## Resumen

En esta web enseño mi trabajo. La he creado desde cero, sin plantillas, como banco de pruebas para las prácticas que más me importan como desarrollador front-end: accesibilidad, rendimiento, arquitectura limpia y buenas herramientas.

## Accesibilidad

- Un **menú de accesibilidad** permite reducir el movimiento, aumentar el contraste, agrandar el texto o cambiar a la fuente OpenDyslexic. Las preferencias se guardan en el navegador y un pequeño script inline las aplica antes del primer pintado.
- La web también respeta los ajustes `prefers-reduced-motion` y `prefers-color-scheme` del sistema operativo, además de un selector manual de tema claro, oscuro o del sistema.
- Incluye un enlace para saltar al contenido, un menú móvil que retiene el foco y se cierra con Escape, estilos de foco visibles y texto para lectores de pantalla en los enlaces que se abren en una pestaña nueva.

## Internacionalización

Todo el contenido está en inglés y en español, y las rutas también están traducidas. Unas pocas funciones pequeñas y con pruebas traducen cualquier ruta entre idiomas, así que el selector de idioma siempre te mantiene en la misma página. El diccionario de traducciones está tipado, y una prueba unitaria falla si falta una clave en cualquiera de los dos idiomas.

## Contenido y arquitectura

Los proyectos son archivos Markdown en una **colección de contenido** de Astro validada con un esquema de Zod, que cubre estado, fechas, rol, aspectos destacados y capturas. Un único componente `ProjectDetail` muestra todos los casos de estudio en ambos idiomas. Los filtros del listado se generan a partir de las tecnologías que usan realmente los proyectos.

## Rendimiento y privacidad

La web es completamente estática. Las imágenes se convierten a WebP en varios tamaños y se sirven de forma responsive. Google Analytics 4 se ejecuta dentro de un web worker mediante Partytown, y usa el modo de consentimiento: no se guardan cookies de analítica ni se envían eventos personalizados hasta que el visitante acepta.

## Herramientas y CI

- Oxlint y Oxfmt para el lint y el formato.
- `astro check` para comprobar los tipos de los archivos `.astro`.
- Vitest para las pruebas unitarias.
- Un hook de pre-commit con lint-staged.
- En GitHub, cada pull request ejecuta el pipeline completo, junto con CodeQL, la revisión de dependencias y Dependabot. Los merges a `main` se despliegan automáticamente en GitHub Pages.
