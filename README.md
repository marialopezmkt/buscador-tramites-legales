# Buscador de trámites legales — Estudio Bellocq Arrizabalaga

Encargo de Kodarvia: una persona escribe con sus palabras lo que le pasa ("me
echaron", "no me pasa plata") y la app le muestra el trámite correspondiente,
con sus papeles, plazo y honorario orientativo. Después puede pedir un lugar
para una primera consulta gratuita, sin crear ninguna cuenta.

**App publicada:** https://marialopezmkt.github.io/buscador-tramites-legales/

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

## Cómo comprobar los criterios de aceptación

Conviene arrancar siempre desde la semilla original (ver "Cómo reiniciar los
datos de ejemplo"). Con la semilla: **Laboral 0 lugares libres de 8, Familia 4
de 6, Sucesiones y vivienda 2 de 5.**

1. **Búsqueda sin tilde ni mayúsculas.** Escribir `me echaron`, `ME ECHARON` o
   `  Me Echaron  `: en los tres casos aparece *Reclamo por despido* y no
   aparece *Desalojo por falta de pago* (lo escrito tiene que estar contenido
   en el nombre o en una palabra clave, nunca al revés). Para ver que ignora
   tildes: `indemnizacion`, `fallecio` y `separacion`, sin tilde, encuentran
   sus trámites.
2. **Chip de área + búsqueda.** Escribir `no me`: aparecen 3 trámites de áreas
   distintas. Tocar el chip **Familia**: queda solo *Cuota alimentaria*. Tocar
   **Laboral** con el mismo texto: ningún resultado, con el mensaje de ayuda.
3. **Laboral, semana completa.** Tocar el chip **Laboral**: sus 3 tarjetas
   dicen «Semana completa». Al entrar a cualquiera de sus fichas, el botón
   *Pedir primera consulta* está desactivado; entrando directo a
   `#/consulta/laboral` no aparece el formulario, sino el aviso de que el área
   se quedó sin lugares.
4. **Un pedido en Familia baja los lugares de 4 a 3, sin recargar.** Tocar el
   chip **Familia**: las 3 tarjetas dicen «Lugares disponibles: 4». Entrar a
   una ficha, pedir la consulta con datos válidos y volver al buscador: ahora
   las 3 tarjetas del área dicen «Lugares disponibles: 3». La página nunca se
   recarga: el descuento se ve al instante.
5. **«Últimos lugares» con 2 o menos.** Tocar **Sucesiones y vivienda**: sus 4
   tarjetas dicen «Últimos lugares: 2». Cargando pedidos en Familia, al llegar
   a 2 libres sus tarjetas también pasan a «Últimos lugares».
6. **Validación campo por campo.** En el formulario, tocar *Pedir mi lugar*
   con todo vacío: aparece un mensaje distinto debajo de cada campo y no se
   guarda nada. Con datos inválidos (`Ana`, `ana@mal`, `123`) aparece el
   mensaje específico de cada error y sigue sin guardar.
7. **Semana nueva: lugares al tope, pedidos conservados.** En la consola:
   ```js
   const p = JSON.parse(localStorage.getItem('eba:pedidos'));
   localStorage.setItem('eba:pedidos', JSON.stringify(p.map(x => ({ ...x, semana: '2026-W01' }))));
   ```
   Recargar: todas las áreas vuelven a su tope (Laboral pasa a «Lugares
   disponibles: 8») y los pedidos anteriores siguen guardados en
   `eba:pedidos`, nada se borró.
8. **Aviso orientativo.** Las 10 fichas muestran "Información orientativa y de
   prueba. No constituye asesoramiento legal.", y el formulario de pedido
   también.
9. **Persistencia y celular.** Después de pedir una consulta, recargar: el
   pedido sigue ahí. Las cuatro pantallas (buscador, ficha, formulario y
   confirmación) se usan sin desbordes horizontales en un ancho de 360 px.

Sobre el caso de aceptación del briefing: las 8 solicitudes laborales de la
semilla agotan **el área entera**, no un solo trámite, así que con la semilla
Laboral no deja pedir. Es el comportamiento pedido en el propio encargo. Para
recorrer un pedido de punta a punta hay que usar Familia o Sucesiones y
vivienda, o simular una semana nueva (punto 7), que devuelve los lugares de
Laboral al tope.

## Dónde está cada cosa

```
app/
├─ index.html                     Título, idioma y punto de entrada
├─ src/
│  ├─ main.tsx                    Arranque de React y del router (HashRouter)
│  ├─ App.tsx                     Las tres rutas de la app
│  ├─ index.css                   Paleta, tipografías y estilos base
│  ├─ pages/                      Una pantalla por archivo
│  │  ├─ Buscador.tsx             Pantalla principal: búsqueda y chips por área
│  │  ├─ Ficha.tsx                Detalle de un trámite
│  │  └─ Pedido.tsx               Formulario de primera consulta y confirmación
│  ├─ components/                 Piezas reutilizables: encabezado, tarjeta,
│  │                              chip de área, etiqueta de lugares, aviso legal
│  ├─ context/PedidosContext.tsx  Estado compartido de pedidos y lugares
│  ├─ lib/eba/                    Toda la lógica, sin nada de interfaz
│  │  ├─ catalogo.ts              Los 10 trámites, áreas, topes y franjas
│  │  ├─ busqueda.ts              Búsqueda sin tildes ni mayúsculas
│  │  ├─ lugares.ts               Lugares que quedan y etiqueta que corresponde
│  │  ├─ pedidos.ts               Alta de pedidos y control de duplicados
│  │  ├─ validacion.ts            Validación de nombre, correo y teléfono
│  │  ├─ semana.ts                Número de semana ISO
│  │  ├─ semilla.ts               Datos de ejemplo precargados
│  │  └─ almacen.ts               Lectura y escritura en localStorage
│  └─ test/                       Pruebas automáticas (Vitest)
└─ .github/workflows/deploy.yml   Publicación automática en GitHub Pages
```

Las tres pantallas están cableadas entre sí: el buscador lleva a la ficha del
trámite, y la ficha al formulario de primera consulta. El encabezado vuelve al
buscador desde cualquier pantalla.

## Stack

React + TypeScript + Vite + Tailwind CSS v4, con React Router (`HashRouter`,
para que funcione en GitHub Pages sin configuración de servidor) y
`localStorage` como única persistencia. Pruebas con Vitest y Testing Library.

```bash
npm test
```
