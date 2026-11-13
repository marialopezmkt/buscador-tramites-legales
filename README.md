# Buscador de trámites legales — Estudio Bellocq Arrizabalaga

Encargo de Kodarvia: una persona escribe con sus palabras lo que le pasa ("me
echaron", "no me pasa plata") y la app le muestra el trámite correspondiente,
con sus papeles, plazo y honorario orientativo. Después puede pedir un lugar
para una primera consulta gratuita, sin crear ninguna cuenta.

## Cómo arrancarlo en tu computadora

Hace falta tener [Node.js](https://nodejs.org/) instalado (versión 20 o
superior).

```bash
npm install
npm run dev
```

Esto abre la app en `http://localhost:5173/`. Los cambios en el código se ven
al instante.

Para simular cómo queda en GitHub Pages (con la ruta `/buscador-tramites-legales/`
incluida):

```bash
npm run build
npm run preview
```

## Qué está simulado y qué no

**Todo acá es una simulación de prueba.** No hay backend, no hay base de
datos, no se envía ningún correo ni mensaje real, y no hay ninguna conexión
con sistemas del estudio:

- Los "pedidos de primera consulta" se guardan únicamente en el
  `localStorage` del navegador de quien usa la app. Si se abre en otra
  computadora o en modo incógnito, no va a ver esos pedidos.
- Los nombres y correos de ejemplo que aparecen ya cargados (la "semilla")
  son datos inventados, no personas reales.
- El control de lugares disponibles por semana es una regla simulada para
  mostrar el comportamiento esperado, no refleja la agenda real del estudio.
- Toda la información de trámites (papeles, plazos, honorarios) es
  orientativa y de prueba, tal como lo aclara la app en cada ficha.

## Cómo reiniciar los datos de ejemplo

Los datos viven en el `localStorage` del navegador, bajo claves que empiezan
con `eba:`. Para volver al estado inicial (la semilla original, sin los
pedidos que se hayan cargado durante una prueba):

1. Abrir la app en el navegador.
2. Abrir las herramientas de desarrollador (F12) → pestaña **Console**.
3. Ejecutar:
   ```js
   localStorage.clear();
   ```
4. Recargar la página. La app vuelve a cargar la semilla original.

(También sirve borrar los datos del sitio desde la configuración del
navegador, o probar en una ventana nueva de incógnito.)

## Stack

React + TypeScript + Vite + Tailwind CSS v4, con React Router (`HashRouter`,
para que funcione en GitHub Pages sin configuración de servidor) y
`localStorage` como única persistencia. Pruebas con Vitest y Testing Library.

```bash
npm test
```
