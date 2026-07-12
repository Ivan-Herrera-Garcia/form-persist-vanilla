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
```

## Modo de Uso
1. Estructura HTML Base

Asegúrate de que tus elementos <input>, <textarea> o <select> tengan asignado el atributo name. La librería utiliza este atributo como llave para identificar y guardar los datos.

```
<form id="registro-form">
  <input type="text" name="nombre" placeholder="Tu nombre" />
  <input type="email" name="correo" placeholder="Tu correo" />
  <input type="password" name="contrasena" placeholder="Contraseña" />
  
  <button type="submit">Enviar</button>
</form>
```

2. Inicialización en JavaScript (ES Modules)

```
import { FormPersist } from 'form-persist-vanilla';

// Seleccionar el formulario del DOM
const miFormulario = document.getElementById('registro-form');

// Inicializar la persistencia de datos
const formGuardado = new FormPersist(miFormulario, 'registro-usuario-key', {
  storage: 'local',           // 'local' (permanente) o 'session' (efímero)
  exclude: ['contrasena'],    // No guardará el campo de contraseña por seguridad
  debounceTime: 400           // Esperará 400ms tras dejar de escribir para guardar
});

// LIMPIEZA: Eliminar los datos del almacenamiento cuando el formulario se envíe con éxito
miFormulario.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Tu lógica de envío aquí (ej. fetch a tu API)...
  
  // Al terminar con éxito, limpia el storage y remueve los listeners internos
  formGuardado.clear();
});
```

3. Uso en entornos CommonJS (Node/Bundlers antiguos)

```
const { FormPersist } = require('form-persist-vanilla');

const form = document.querySelector('#registro-form');
const persistor = new FormPersist(form, 'mi-llave-unica');
```

4. Metodos disponibles
clear(): Limpia de forma inmediata el registro del almacenamiento del navegador (localStorage/sessionStorage) y remueve los escuchadores de eventos para liberar memoria.

