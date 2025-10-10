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
  selector: 'app-debit-note',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, JsonFormatPipe],
  templateUrl: './debit-note.component.html',
  styleUrl: './debit-note.component.scss',
})
export class DebitNoteComponent {
  open: boolean = false;
  arrowRight = faCircleArrowRight;
  arrowDown = faCircleArrowDown;

  jsonExamples = [
    {
      title: 'Request del ejemplo',
      jsonData: {
        documento_electronico: {
          encabezado: {
            identificacion_documento: {
              tipo_documento: '03',
              numero_documento: '000001',
              tipo_proveedor: 'NO',
              numero_planilla_importacion: 'string',
              numero_expediente_importacion: 'string',
              serie_factura_afectada: '00',
              numero_factura_afectada: '000001',
              fecha_factura_afectada: '07/11/2024',
              monto_factura_afectada: '116.00',
              comentario_factura_afectada: 'string',
              regimen_esp_tributacion: 'PUERTO LIBRE ESTADO NUEVA ESPARTA',
              fecha_emision: '13/12/2024',
              fecha_vencimiento: null,
              hora_emision: '09:59:33 am',
              tipo_de_pago: 'INMEDIATO',
              serie: '00',
              sucursal: null,
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
              monto_gravado_total: '50.00',
              monto_exento_total: '0.00',
              subtotal: '50.00',
              total_a_pagar: '58.00',
              total_iva: '8.00',
              monto_total_con_iva: '58.00',
              monto_en_letras: 'CINCUENTA Y OCHO',
              total_descuento: '0.00',
              impuestos_subtotal: [
                {
                  codigo_total_imp: 'G',
                  alicuota_imp: '16.00',
                  base_imponible_imp: '50.00',
                  valor_total_imp: '8.00',
                },
              ],
              formas_pago: [
                {
                  descripcion: 'string',
                  fecha: '13/12/2024',
                  forma: '01',
                  monto: '58.00',
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
              descripcion: 'DIFERENCIAL CAMBIARIO',
              cantidad: '1.00',
              unidad_medida: 'UND',
              precio_unitario: '50.00',
              precio_item: '50.00',
              codigo_impuesto: 'G',
              tasa_iva: '16.00',
              valor_iva: '8.00',
              valor_total_item: '58.00',
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
          tipo_documento: '03',
          numero_documento_dig: '00-2',
          numero_control_dig: '00-58',
          fecha_asignacion_dig: '10/02/2025',
          hora_asignacion_dig: '14:25:31',
        },
      },
    },
    {
      title: 'Respuesta de Error (400 Bad Request)',
      jsonData: {
        codigo: 404,
        mensaje: {
          '0': ' ERROR. DOCUMENTO DUPLICADO, VERIFIQUE EL NUMERO DE DOCUMENTO: 000001',
          '1': 'TIPO DE TRANSACCION INVALIDO. EL IDENTIFICACION_DOCUMENTO->TIPO DE TRANSACCION NO EXISTE',
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
