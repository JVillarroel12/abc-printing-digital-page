import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { JsonFormatPipe } from '../../../pipes/json-format.pipe';
import { faArrowRight, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { ClipboardService } from '../../../services/clipboard.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-credit-note',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, JsonFormatPipe],
  templateUrl: './credit-note.component.html',
  styleUrl: './credit-note.component.scss',
})
export class CreditNoteComponent {
  open: boolean = false;
  arrowRight = faArrowRight;
  arrowDown = faArrowDown;

  jsonExamples = [
    {
      title: 'Request del ejemplo',
      jsonData: {
        documento_electronico: {
          encabezado: {
            identificacion_documento: {
              tipo_documento: '02',
              numero_documento: '000001',
              tipo_proveedor: 'NO',
              numero_planilla_importacion: 'string',
              numero_expediente_importacion: 'string',
              serie_factura_afectada: '00',
              numero_factura_afectada: '000001',
              fecha_factura_afectada: '07/11/2024',
              monto_factura_afectada: '116.00',
              comentario_factura_afectada: 'prueba nc',
              regimen_esp_tributacion: 'PUERTO LIBRE ESTADO NUEVA ESPARTA',
              fecha_emision: '13/12/2024',
              hora_emision: '09:50:33 am',
              tipo_de_pago: 'INMEDIATO',
              serie: '00',
              tipo_de_venta: 'INT',
              moneda: 'VED',
            },
            vendedor: {
              codigo: '05',
              nombre: '[NOMBRE VENDEDOR]',
              num_cajero: '125',
            },
            comprador: {
              tipo_identificacion: 'J',
              numero_identificacion: '29000123',
              razon_social: '[RAZON SOCIAL]',
              direccion: '[DIRECCION COMPRADOR]',
              pais: 'VE',
              notificar: 'NO',
              telefonos: ['string'],
              correos: ['string'],
              otros_envios: [
                {
                  tipo: 'string',
                  destino: 'string',
                },
              ],
            },
            totales: {
              nro_items: '1',
              monto_gravado_total: '100.00',
              monto_exento_total: '0.00',
              subtotal: '100.00',
              total_a_pagar: '116.00',
              total_iva: '16.00',
              monto_total_con_iva: '116.00',
              monto_en_letras: 'CIENTO DIECISEIS',
              impuestos_subtotal: [
                {
                  codigo_total_imp: 'G',
                  alicuota_imp: '16.00',
                  base_imponible_imp: '100.00',
                  valor_total_imp: '16.00',
                },
              ],
              formas_pago: [
                {
                  descripcion: 'string',
                  fecha: '13/12/2024',
                  forma: '01',
                  monto: '104.00',
                  moneda: 'VED',
                  tipo_cambio: '0.00',
                },
              ],
              total_igtf: 'string',
            },
          },
          detalles_items: [
            {
              numero_linea: '0001',
              codigo: 'string',
              bien_o_servicio: '1',
              descripcion: 'JUGO',
              cantidad: '1.00',
              unidad_medida: 'UND',
              precio_unitario: '100.00',
              precio_item: '100.00',
              codigo_impuesto: 'G',
              tasa_iva: '16.00',
              valor_iva: '16.00',
              valor_total_item: '116.00',
            },
          ],
        },
      },
    },
    {
      title: 'Respuesta Exitosa (200 OK)',
      jsonData: {
        codigo: 200,
        mensaje: 'Emision Exitosa',
        documento: {
          imprenta: 'ABC DIGITAL PRINTER',
          serie: '00',
          tipo_documento: '02',
          numero_documento_dig: '00-2',
          numero_control_dig: '00-57',
          fecha_asignacion_dig: '10/02/2025',
          hora_asignacion_dig: '14:21:09',
        },
      },
    },
    {
      title: 'Respuesta de Error (400 Bad Request)',
      jsonData: {
        codigo: 404,
        mensaje: [
          ' ERROR. DOCUMENTO DUPLICADO, VERIFIQUE EL NUMERO DE DOCUMENTO: 000001',
          'TIPO DE TRANSACCION INVALIDO. EL IDENTIFICACION_DOCUMENTO->TIPO DE TRANSACCION NO EXISTE',
        ],
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
