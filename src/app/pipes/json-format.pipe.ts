import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jsonFormat',
  standalone: true,
})
export class JsonFormatPipe implements PipeTransform {
  transform(value: any): string {
    if (!value) return '';

    return (
      JSON.stringify(value, null, 2)
        // Aplica color solo al nombre del campo (key)
        .replace(/"([^"]+)":/g, '"<span class="json-key">$1</span>":')
    );
  }

  // Método para copiar (JSON limpio, sin HTML)
  static getRawJson(value: any): string {
    // <-- ¡Método estático!
    return JSON.stringify(value, null, 2);
  }
}
