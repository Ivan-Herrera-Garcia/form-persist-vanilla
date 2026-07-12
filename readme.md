# FormPersist Vanilla 📝💾

**FormPersist Vanilla** es una librería de JavaScript/TypeScript ultra-ligera, rápida y sin dependencias externas, diseñada para guardar automáticamente el progreso de los usuarios en cualquier formulario HTML en tiempo real. 

Si un usuario recarga la página por accidente, pierde la conexión o cierra la pestaña, la librería restaura instantáneamente todos los datos introducidos (textos, checkboxes, selecciones) al regresar.

---

## Características Principales

* ⚡ **Ultra-ligera:** Menos de 3KB, sin dependencias de terceros.
* 📦 **Híbrida:** Soporte nativo para ES Modules (`import`) y CommonJS (`require`).
* 🔒 **Segura:** Permite excluir campos sensibles (como contraseñas o tarjetas de crédito) para que nunca se almacenen en el navegador.
* 🏎️ **Optimizada (Debounce):** Evita saturar el almacenamiento del navegador esperando a que el usuario deje de escribir antes de guardar.
* 🛠️ **Compatible:** Funciona con Vanilla JS, React, Vue, Svelte o cualquier framework del mercado.

---

## Instalación

Instala la librería desde tu gestor de paquetes favorito:

```bash
npm install form-persist-vanilla