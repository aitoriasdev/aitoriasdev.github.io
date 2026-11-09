---
title: "CDM Optimiser"
tagline: "Panel web y aplicación de escritorio para Windows que ayuda a las consultas de medicina general de Irlanda a encontrar pacientes que cumplen los requisitos del programa de Gestión de Enfermedades Crónicas pero aún no están inscritos."
status: "active"
startDate: "2025-11-20"
order: 1
role: "Responsable de front-end"
techStack: ["React", "TypeScript", "Tailwind", "Supabase", "TanStack Query", "Electron", "Vite", "Vitest", "Playwright"]
thumbnail: "../../../assets/images/projects/cdm-optimiser.webp"
gitHubUrl: "https://github.com/CDM-Optimiser/cdm-optimiser"
liveUrl: "https://cdm-optimiser.netlify.app"
featured: true
lang: "es"
highlights:
  - "Una sola base de código React con dos destinos: una aplicación web en Netlify y una aplicación Electron para las clínicas, reforzada y con actualizaciones automáticas."
  - "Seguridad y privacidad desde el diseño para datos de salud: CSP estricta con Trusted Types, seguridad a nivel de fila, inicio de sesión en dos pasos con TOTP y un build que falla si un secreto pudiera acabar en el bundle."
  - "Unas 200 pruebas automatizadas: pruebas unitarias, pruebas de componentes en un navegador real, pruebas end-to-end con Playwright contra un backend simulado y comprobaciones de accesibilidad WCAG 2.2 AA en modo claro y oscuro."
  - "Publicaciones sin intervención manual: basta con subir la versión para generar el instalador de Windows, publicar una release en GitHub y actualizar las aplicaciones instaladas en las clínicas."
screenshots:
  - src: "../../../assets/images/projects/cdm-optimiser-patients-list.webp"
    alt: "Listado de pacientes con buscador, filtros por estado, recuento en directo de pacientes aceptados, rechazados y pendientes, y una tabla paginada de pacientes ficticios."
    caption: "Listado de pacientes: paginación en el servidor, búsqueda, filtros por estado y recuentos en directo."
  - src: "../../../assets/images/projects/cdm-optimiser-patient-card.webp"
    alt: "Ventana con la información del paciente: datos de contacto, enfermedades e interruptores para marcarlo como aceptado o rechazado."
    caption: "Ficha del paciente: datos de contacto, enfermedades y el flujo para aceptar o rechazar."
  - src: "../../../assets/images/projects/cdm-optimiser-pending-patients.webp"
    alt: "Página de pacientes pendientes que muestra un paciente cada vez, con botones de anterior y siguiente."
    caption: "Pacientes pendientes: una vista centrada en un paciente cada vez para ir trabajando la cola."
  - src: "../../../assets/images/projects/cdm-optimiser-patients-list-dark.webp"
    alt: "El listado de pacientes en modo oscuro."
    caption: "El modo oscuro sigue al sistema operativo o al menú de tema de la aplicación de escritorio."
---

## El problema

El programa de **Gestión de Enfermedades Crónicas (CDM)** de Irlanda financia a las consultas de medicina general para que den una atención estructurada a pacientes con asma, diabetes, enfermedad cardiovascular (CVD) y EPOC (COPD). Muchos pacientes que cumplen los requisitos nunca llegan a inscribirse, porque encontrarlos obliga a revisar historiales a mano. El resultado es atención que no se presta a los pacientes e ingresos del programa que la consulta deja de percibir.

## Qué hace

CDM Optimiser ofrece al equipo administrativo de la consulta una auditoría basada en datos de los pacientes que cumplen los criterios clínicos pero aún no están inscritos. También le da un flujo de trabajo sencillo para contactar con esos pacientes y registrar el resultado.

- **Listado de pacientes.** Paginación en el servidor; búsqueda por nombre, fecha de nacimiento o número GMS; filtros por estado; y recuento en directo de pacientes aceptados, rechazados y pendientes.
- **Pacientes pendientes.** Una vista centrada que muestra un paciente cada vez para ir trabajando la cola.
- **Ficha del paciente.** Datos de contacto y enfermedades de un vistazo. Al marcar al paciente como aceptado o rechazado, los listados y los contadores se actualizan solos.
- **Inicio de sesión seguro.** Correo y contraseña más un código de una aplicación de autenticación (TOTP). Cada usuario puede registrar varias aplicaciones de autenticación.
- **Aplicación de escritorio.** Un instalador de Windows para las clínicas. La aplicación se actualiza sola desde GitHub Releases y verifica cada descarga.

> **Pruébala:** inicia sesión en la [demo en vivo](https://cdm-optimiser.netlify.app) con la cuenta de demostración que aparece en el [README del repositorio](https://github.com/CDM-Optimiser/cdm-optimiser#try-the-demo). Todos los pacientes de la demo son ficticios.

## Mi rol

CDM Optimiser es un proyecto de dos personas que estoy desarrollando con un amigo. Como **responsable de front-end** me encargo de todo el lado cliente:

- la arquitectura React, la interfaz y la accesibilidad
- la aplicación de escritorio con Electron
- las baterías de pruebas
- el pipeline de CI/CD y de publicación

## Arquitectura

El código vive en un **monorepo con Yarn workspaces**:

- `apps/web`: una aplicación de una sola página con React 19 (Vite, React Router, TanStack Query, Tailwind CSS 4). Está organizada por funcionalidades: `auth`, `patients`, `two-step`, `updates`, etc.
- `apps/desktop`: una aplicación Electron que distribuye el mismo build web.
- `packages/ui`: una librería de componentes React compartida.
- `packages/desktop-bridge`: un contrato tipado para los mensajes entre la aplicación de escritorio y la web.

El backend es **Supabase**. Solo se puede acceder a los datos de pacientes mediante funciones de Postgres limitadas a la consulta del usuario, y la **seguridad a nivel de fila (RLS)** es la barrera de seguridad. En el cliente, TanStack Query gestiona el estado del servidor. Las claves de las consultas salen de una única factoría, así que una sola invalidación tras un cambio de estado actualiza a la vez los listados y los contadores.

## Aspectos técnicos destacados

### Una base de código, dos destinos

La aplicación de escritorio no carga el build web desde `file://`. Lo sirve mediante un protocolo privilegiado propio, `app://`. Así el enrutado en el cliente funciona exactamente igual que en la web y la sesión tiene un origen estable. El código que resuelve los archivos de ese protocolo tiene pruebas contra ataques de path traversal.

### Seguridad y privacidad para datos de salud

- Un plugin propio de Vite inyecta una **Content Security Policy estricta con Trusted Types**. El hosting web y la aplicación de escritorio usan la misma política.
- El **build falla** si la URL de Supabase no usa HTTPS o si una clave secreta pudiera acabar en el bundle.
- **Electron está reforzado:**
  - sandbox y aislamiento de contexto
  - sin Node.js en el renderer
  - validación de los mensajes entre procesos
  - fuses de Electron, incluida la comprobación de integridad del ASAR
- **Las búsquedas nunca van en la URL.** Una búsqueda puede contener el nombre de un paciente, así que se envía en el cuerpo de la petición, donde no puede acabar en los logs del servidor. La aplicación borra su caché al cerrar sesión y no tiene analítica ni scripts de terceros.

### Pruebas

- Pruebas unitarias con **Vitest**, más pruebas de componentes que se ejecutan en un Chromium real (modo navegador de Vitest).
- Pruebas end-to-end con **Playwright** contra un backend de Supabase simulado. Cada prueba comprueba además que ninguna petición ha ido a otro origen.
- **Comprobaciones automáticas de accesibilidad** (axe, WCAG 2.2 AA) en todas las páginas, en modo claro y oscuro.
- Pruebas de maquetación que garantizan que ninguna página tenga scroll horizontal, en tamaños desde móvil hasta escritorio.

### CI/CD y publicaciones

Cada pull request ejecuta:

1. una comprobación de formato
2. una comprobación de sincronización de versiones
3. ESLint sin ningún aviso permitido
4. un build de TypeScript
5. las pruebas unitarias y de componentes
6. el build de producción
7. la batería end-to-end

Publicar requiere solo subir la versión. La CI genera el instalador de Windows y publica una release en GitHub. Las aplicaciones instaladas se actualizan solas tras comprobar el hash SHA-512.

## Qué he aprendido

El primer prototipo (finales de 2025) tenía un backend en Python con **FastAPI + SQLite** y columnas cifradas, empaquetado con PyInstaller dentro de Electron. Funcionaba, pero cada instalación tenía que distribuir y mantener su propio servidor y base de datos locales.

Pasar a **Supabase** eliminó por completo el servidor local, y ahora la seguridad a nivel de fila garantiza el aislamiento de los datos. La aplicación de escritorio pasó a ser una capa fina y segura sobre el mismo build web. Después reconstruí la aplicación como un monorepo tipado mediante una serie de pull requests pequeñas y acotadas. Eso me enseñó cuánto acelera a un equipo pequeño un buen pipeline de pruebas y publicación.

## Estado

La versión **1.3.1** está publicada en la web y como aplicación de escritorio para Windows. El siguiente paso es firmar digitalmente el instalador de Windows.
