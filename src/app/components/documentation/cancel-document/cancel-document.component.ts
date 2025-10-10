import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { JsonFormatPipe } from '../../../pipes/json-format.pipe';
import {
  faCircleArrowRight,
  faCircleArrowDown,
} from '@fortawesome/free-solid-svg-icons';
import { ClipboardService } from '../../../services/clipboard.service';
import { ToastService } from '../../../services/toast.service';
@Component({
  selector: 'app-cancel-document',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, JsonFormatPipe],
  templateUrl: './cancel-document.component.html',
  styleUrl: './cancel-document.component.scss',
})
export class CancelDocumentComponent {
  open: boolean = false;
  arrowRight = faCircleArrowRight;
  arrowDown = faCircleArrowDown;

  jsonExamples = [
    {
      title: 'Request del ejemplo',
      jsonData: {
        serie: '00',
        numero_documento: '000002',
        tipo_documento: '01',
        motivo_anulacion: 'motivo prueba',
        fecha_anulacion: '20/12/2024',
        hora_anulacion: '01:21:30 pm',
      },
    },
    {
      title: 'Respuesta Exitosa (200 OK)',
      jsonData: {
        codigo: 200,
        mensaje: 'ABC DIGITAL PRINTER, DOCUMENTO ANULADO EXITOSAMENTE',
        documento: {
          imprenta: 'ABC DIGITAL PRINTER',
          serie: '00',
          tipo_documento: '01',
          numero_documento_dig: '00-54',
          numero_control_dig: '00-59',
          fecha_asignacion_dig: '10/02/2025',
          hora_asignacion_dig: '15:04:50',
        },
      },
    },
    {
      title: 'Respuesta de Error (400 Bad Request)',
      jsonData: {
        codigo: 400,
        mensaje: {
          '0': 'ERROR EL DOCUMENTO AFECTADO NO EXISTE O YA FUE ANULADO',
        },
        token: null,
        expiracion: null,
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
