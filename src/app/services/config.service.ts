import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
interface Config {
  api_url: string;
  api_port: string;
}
@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private config: Config | null = null;

  constructor(private http: HttpClient) {}

  /**
   * Carga la configuración desde el archivo config.json.
   * Retorna una Promesa que se resuelve con la configuración,
   * o rechaza con un error.
   */
  loadConfig(): Promise<Config> {
    return new Promise((resolve, reject) => {
      // Determina la ruta del archivo config.json.  En desarrollo,
      // se buscará en la carpeta 'assets', en producción se asume
      // que está en la raíz (o en el mismo directorio que el index.html)
      const configPath = environment.production
        ? 'config.json'
        : 'assets/config.json';

      this.http
        .get<Config>(configPath)
        .pipe(
          catchError((error: any) => {
            reject(error);
            return new Observable<Config>(); // Importante: retornar un Observable para evitar errores
          })
        )
        .subscribe((config) => {
          this.config = config;
          resolve(config);
        });
    });
  }

  /**
   * Obtiene la configuración cargada.  Debe llamarse DESPUÉS de `loadConfig()`.
   * Retorna la configuración, o `null` si aún no se ha cargado.
   */
  getConfig(): Config | null {
    return this.config;
  }

  /**
   * Obtiene la URL base de la API.
   * Llama a `getConfig()` para obtener la configuración.
   * Retorna la URL base, o una cadena vacía si la configuración no está disponible.
   */
  getApiUrl(): any {
    const config = this.getConfig();
    if (config) {
      return config;
    } else {
      return ''; // O una URL por defecto, si es apropiado
    }
  }
}
