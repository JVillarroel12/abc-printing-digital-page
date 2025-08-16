import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { JsonFormatPipe } from '../../../pipes/json-format.pipe';
import { faArrowRight, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { ClipboardService } from '../../../services/clipboard.service';
import { ToastService } from '../../../services/toast.service';
@Component({
  selector: 'app-autentication',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, JsonFormatPipe],
  templateUrl: './autentication.component.html',
  styleUrl: './autentication.component.scss',
})
export class AutenticationComponent {
  open: boolean = false;
  arrowRight = faArrowRight;
  arrowDown = faArrowDown;

  jsonExamples = [
    {
      title: 'Request del ejemplo',
      jsonData: {
        usuario: 'usuario',
        clave: 'clave',
      },
    },
    {
      title: 'Respuesta Exitosa (200 OK)',
      jsonData: {
        codigo: 200,
        mensaje: 'AUTENTICACION EXITOSA',
        token: '37da6ce0-95ba-45dc-80e1-89504a381a79',
        expiracion: '2025-02-11 14:01:29',
      },
    },
    {
      title: 'Respuesta de Error (400 Bad Request)',
      jsonData: {
        info: 'mal usuario',
        data: {
          codigo: 400,
          mensaje: 'USUARIO NO ENCONTRADO',
          token: null,
          expiracion: null,
        },
      },
    },
  ];
  copied = false;
  constructor(
    private clipboard: ClipboardService,
    private notificationService: ToastService
  ) {}
  openSection() {
    this.open = !this.open;
  }
  copyJson(jsonDataToCopy: any) {
    // Usamos el método estático del Pipe con el JSON que nos pasaron
    const rawJson = JsonFormatPipe.getRawJson(jsonDataToCopy);

    navigator.clipboard.writeText(rawJson).then(() => {
      this.copied = true;
      this.notificationService.showSuccess('¡JSON copiado al portapapeles!');
    });
  }
}
