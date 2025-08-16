import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { JsonFormatPipe } from '../../../pipes/json-format.pipe';
import { faArrowRight, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { ClipboardService } from '../../../services/clipboard.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-retention',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, JsonFormatPipe],
  templateUrl: './retention.component.html',
  styleUrl: './retention.component.scss',
})
export class RetentionComponent {
  open: boolean = false;
  arrowRight = faArrowRight;
  arrowDown = faArrowDown;

  jsonExamples = [
    {
      title: 'Request del ejemplo',
      jsonData: {
        retencion: {
          serie: '00',
          numero_documento: '000002',
          numero_control_dig: '00-4',
          total_retencion: {
            total_base_imponible: '100.00',
            numero_comprobante_retencion: '33333',
            fecha_emision_cr: '16/12/2024',
            total_IVA: '16.00',
            total_retenido: '12.00',
            total_ISLR: '0.00',
            total_IGTF: '0.00',
          },
        },
      },
    },
    {
      title: 'Respuesta Exitosa (200 OK)',
      jsonData: {
        codigo: 200,
        mensaje: 'Retencion aplicada exitosamente',
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
        mensaje: ['ERROR EL DOCUMENTO AFECTADO ESTA DUPLICADO'],
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
