export interface FormPersistOptions {
  /** 'local' para LocalStorage o 'session' para SessionStorage. Por defecto es 'local'. */
  storage?: 'local' | 'session';
  /** Lista de atributos 'name' de los inputs que NO se deben guardar (ej. 'password'). */
  exclude?: string[];
  /** Tiempo de espera en ms antes de guardar para no saturar el almacenamiento. Por defecto 300ms. */
  debounceTime?: number;
}

export class FormPersist {
  private form: HTMLFormElement;
  private key: string;
  private storage: Storage;
  private exclude: string[];
  private debounceTime: number;
  private debounceTimeoutId: any = null;

  constructor(form: HTMLFormElement, key: string, options?: FormPersistOptions) {
    if (!form || !(form instanceof HTMLFormElement)) {
      throw new Error('[FormPersist] Se requiere un elemento HTMLFormElement válido.');
    }
    
    this.form = form;
    this.key = key;
    this.storage = options?.storage === 'session' ? sessionStorage : localStorage;
    this.exclude = options?.exclude || [];
    this.debounceTime = options?.debounceTime ?? 300;

    this.init();
  }

  /**
   * Inicializa la carga de datos y activa los escuchadores de eventos.
   */
  private init(): void {
    this.loadSavedData();
    
    // Escuchar cualquier cambio en los inputs del formulario
    this.form.addEventListener('input', this.handleInput);
  }

  /**
   * Obtiene los valores actuales del formulario y los guarda de forma segura.
   */
  private handleInput = (): void => {
    if (this.debounceTimeoutId) {
      clearTimeout(this.debounceTimeoutId);
    }

    this.debounceTimeoutId = setTimeout(() => {
      const formData = new FormData(this.form);
      const dataToSave: Record<string, any> = {};

      formData.forEach((value, key) => {
        // Ignorar campos excluidos
        if (this.exclude.includes(key)) return;

        // Manejar múltiples campos con el mismo nombre (ej. checkboxes múltiples)
        if (dataToSave[key]) {
          if (!Array.isArray(dataToSave[key])) {
            dataToSave[key] = [dataToSave[key]];
          }
          dataToSave[key].push(value);
        } else {
          dataToSave[key] = value;
        }
      });

      this.storage.setItem(this.key, JSON.stringify(dataToSave));
    }, this.debounceTime);
  };

  /**
   * Recupera los datos del almacenamiento y los reinyecta en el formulario.
   */
  private loadSavedData(): void {
    const saved = this.storage.getItem(this.key);
    if (!saved) return;

    try {
      const data = JSON.parse(saved);

      Object.keys(data).forEach((name) => {
        const elements = this.form.elements.namedItem(name);
        if (!elements) return;

        // Si hay múltiples elementos (como RadioButtons o Checkboxes)
        if (elements instanceof RadioNodeList || Array.isArray(elements)) {
          const elementsArray = Array.from(elements) as HTMLInputElement[];
          elementsArray.forEach((el) => {
            if (el.type === 'checkbox' || el.type === 'radio') {
              el.checked = Array.isArray(data[name]) 
                ? data[name].includes(el.value) 
                : el.value === data[name];
            } else {
              el.value = data[name];
            }
          });
        } else {
          // Input único (text, textarea, select, etc.)
          const el = elements as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
          if (el.type === 'checkbox') {
            (el as HTMLInputElement).checked = !!data[name];
          } else {
            el.value = data[name];
          }
        }
      });
    } catch (e) {
      console.error(`[FormPersist] Error al restaurar datos para la llave "${this.key}":`, e);
    }
  }

  /**
   * Limpia los datos guardados en el almacenamiento y remueve los listeners.
   * Úsalo al procesar el submit con éxito.
   */
  public clear(): void {
    this.storage.removeItem(this.key);
    this.form.removeEventListener('input', this.handleInput);
    if (this.debounceTimeoutId) {
      clearTimeout(this.debounceTimeoutId);
    }
  }
}