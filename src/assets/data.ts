interface data {
  title: string;
  icon: string;
  subtitle: string;
  method: "POST" | "GET" | "PUT";
  url: string;
  headers: { key: string; type: string; desc: string; isRequired: boolean }[];
  req: any;
  success: any;
  failure: any[];
}

export const source: data[] = [
  {
    title: "Autenticacion",
    icon: "key",
    subtitle: "",
    method: "POST",
    url: "BaseURL + '/login'",
    headers: [
      {
        key: "Content-Type",
        type: "string",
        desc: "",
        isRequired: false,
      },
    ],
    req: {
      usuario: "&/4a9#4a9{2",
      clave: ")^4a9b=20fd(4a",
    },
    success: {
      codigo: 200,
      mensaje: "AUTENTICACION EXITOSA",
      token: "37da6ce0-95ba-45dc-80e1-89504a381a79",
      expiracion: "2025-02-11 14:01:29",
    },
    failure: [
      {
        info: "mal usuario",
        data: {
          codigo: 400,
          mensaje: "USUARIO NO ENCONTRADO",
          token: null,
          expiracion: null,
        },
      },
      {
        info: "mal clave",
        data: {
          codigo: 401,
          mensaje: "CLAVE INVALIDA",
          token: null,
          expiracion: null,
        },
      },
    ],
  },
  {
    title: "Factura",
    icon: "receipt",
    subtitle: "",
    method: "POST",
    url: "BaseURL + '/emision'",
    headers: [
      {
        key: "Content-Type",
        type: "string",
        desc: "",
        isRequired: false,
      },
      {
        key: "token",
        type: "string",
        desc: "Token de sesion",
        isRequired: true,
      },
    ],
    req: {
      documento_electronico: {
        encabezado: {
          identificacion_documento: {
            tipo_documento: "01",
            numero_documento: "000005",
            tipo_proveedor: "NO",
            numero_planilla_importacion: "string",
            numero_expediente_importacion: "string",
            regimen_esp_tributacion: "PUERTO LIBRE ESTADO NUEVA ESPARTA",
            fecha_emision: "13/01/2025",
            hora_emision: "09:04:33 am",
            tipo_de_pago: "INMEDIATO",
            serie: "00",
            tipo_de_venta: "INT",
            moneda: "VED",
          },
          vendedor: {
            codigo: "05",
            nombre: "[NOMBRE VENDEDOR]eeeee",
            num_cajero: "125",
          },
          comprador: {
            tipo_identificacion: "J",
            numero_identificacion: "29000123",
            razon_social: "[RAZON SOCIAL]",
            direccion: "[DIRECCION COMPRADOR]",
            pais: "VE",
            notificar: "NO",
            telefonos: ["string"],
            correos: ["string"],
            otros_envios: [
              {
                tipo: "string",
                destino: "string",
              },
            ],
          },
          totales: {
            nro_items: "1",
            monto_gravado_total: "100.00",
            monto_exento_total: "0.00",
            subtotal: "100.00",
            total_a_pagar: "116.00",
            total_iva: "16.00",
            monto_total_con_iva: "116.00",
            monto_en_letras: "CIENTO DIECISEIS",
            impuestos_subtotal: [
              {
                codigo_total_imp: "G",
                alicuota_imp: "16.00",
                base_imponible_imp: "100.00",
                valor_total_imp: "16.00",
              },
            ],
            formas_pago: [
              {
                descripcion: "string",
                fecha: "13/12/2024",
                forma: "01",
                monto: "104.00",
                moneda: "VED",
                tipo_cambio: "0.00",
              },
            ],
            total_igtf: "string",
          },
          totales_retencion: {
            total_base_imponible: "100.00",
            numero_comp_retencion: null,
            fecha_emision_cr: null,
            total_iva: "16.00",
            total_retenido: "12.00",
            total_isrl: "0.00",
            total_igtf: "0.00",
          },
        },
        detalles_items: [
          {
            numero_linea: "0001",
            codigo: "string",
            bien_o_servicio: "1",
            descripcion: "JUGO",
            cantidad: "1.00",
            unidad_medida: "UND",
            precio_unitario: "100.00",
            precio_item: "100.00",
            codigo_impuesto: "G",
            tasa_iva: "16.00",
            valor_iva: "16.00",
            valor_total_item: "116.00",
          },
        ],
        detalles_retencion: [
          {
            numero_linea: "1",
            fecha_documento: "13/12/2024",
            serie_ocumento: "00",
            numero_documento: "000001",
            numero_control: null,
            monto_total: "116.00",
            monto_exento: "0.00",
            base_imponible: "100",
            porcentaje_iva: "16.00",
            monto_iva: "16.00",
            retenido_iva: "12.00",
            moneda: "VED",
          },
        ],
      },
    },
    success: {
      codigo: 200,
      mensaje: "Emision Exitosa",
      documento: {
        imprenta: "ABC DIGITAL PRINTER",
        serie: "00",
        tipo_documento: "01",
        numero_documento_dig: "00-53",
        numero_control_dig: "00-56",
        fecha_asignacion_dig: "10/02/2025",
        hora_asignacion_dig: "14:16:47",
      },
    },
    failure: [
      {
        codigo: 404,
        mensaje: [
          " ERROR. DOCUMENTO DUPLICADO, VERIFIQUE EL NUMERO DE DOCUMENTO: 000005",
          "TIPO DE TRANSACCION INVALIDO. EL IDENTIFICACION_DOCUMENTO->TIPO DE TRANSACCION NO EXISTE",
        ],
        token: null,
        expiracion: null,
      },
    ],
  },
  {
    title: "Nota de Credito",
    icon: "receipt",
    subtitle: "",
    method: "POST",
    url: "BaseURL + '/emision'",
    headers: [
      {
        key: "Content-Type",
        type: "string",
        desc: "",
        isRequired: false,
      },
      {
        key: "token",
        type: "string",
        desc: "Token de sesion",
        isRequired: true,
      },
    ],
    req: {
      documento_electronico: {
        encabezado: {
          identificacion_documento: {
            tipo_documento: "02",
            numero_documento: "000001",
            tipo_proveedor: "NO",
            numero_planilla_importacion: "string",
            numero_expediente_importacion: "string",
            serie_factura_afectada: "00",
            numero_factura_afectada: "000001",
            fecha_factura_afectada: "07/11/2024",
            monto_factura_afectada: "116.00",
            comentario_factura_afectada: "prueba nc",
            regimen_esp_tributacion: "PUERTO LIBRE ESTADO NUEVA ESPARTA",
            fecha_emision: "13/12/2024",
            hora_emision: "09:50:33 am",
            tipo_de_pago: "INMEDIATO",
            serie: "00",
            tipo_de_venta: "INT",
            moneda: "VED",
          },
          vendedor: {
            codigo: "05",
            nombre: "[NOMBRE VENDEDOR]",
            num_cajero: "125",
          },
          comprador: {
            tipo_identificacion: "J",
            numero_identificacion: "29000123",
            razon_social: "[RAZON SOCIAL]",
            direccion: "[DIRECCION COMPRADOR]",
            pais: "VE",
            notificar: "NO",
            telefonos: ["string"],
            correos: ["string"],
            otros_envios: [
              {
                tipo: "string",
                destino: "string",
              },
            ],
          },
          totales: {
            nro_items: "1",
            monto_gravado_total: "100.00",
            monto_exento_total: "0.00",
            subtotal: "100.00",
            total_a_pagar: "116.00",
            total_iva: "16.00",
            monto_total_con_iva: "116.00",
            monto_en_letras: "CIENTO DIECISEIS",
            impuestos_subtotal: [
              {
                codigo_total_imp: "G",
                alicuota_imp: "16.00",
                base_imponible_imp: "100.00",
                valor_total_imp: "16.00",
              },
            ],
            formas_pago: [
              {
                descripcion: "string",
                fecha: "13/12/2024",
                forma: "01",
                monto: "104.00",
                moneda: "VED",
                tipo_cambio: "0.00",
              },
            ],
            total_igtf: "string",
          },
        },
        detalles_items: [
          {
            numero_linea: "0001",
            codigo: "string",
            bien_o_servicio: "1",
            descripcion: "JUGO",
            cantidad: "1.00",
            unidad_medida: "UND",
            precio_unitario: "100.00",
            precio_item: "100.00",
            codigo_impuesto: "G",
            tasa_iva: "16.00",
            valor_iva: "16.00",
            valor_total_item: "116.00",
          },
        ],
      },
    },
    success: {
      codigo: 200,
      mensaje: "Emision Exitosa",
      documento: {
        imprenta: "ABC DIGITAL PRINTER",
        serie: "00",
        tipo_documento: "02",
        numero_documento_dig: "00-2",
        numero_control_dig: "00-57",
        fecha_asignacion_dig: "10/02/2025",
        hora_asignacion_dig: "14:21:09",
      },
    },
    failure: [
      {
        codigo: 404,
        mensaje: [
          " ERROR. DOCUMENTO DUPLICADO, VERIFIQUE EL NUMERO DE DOCUMENTO: 000001",
          "TIPO DE TRANSACCION INVALIDO. EL IDENTIFICACION_DOCUMENTO->TIPO DE TRANSACCION NO EXISTE",
        ],
        token: null,
        expiracion: null,
      },
    ],
  },

  {
    title: "Nota de Debito",
    icon: "receipt",
    subtitle: "",
    method: "POST",
    url: "BaseURL + '/emision'",
    headers: [
      {
        key: "Content-Type",
        type: "string",
        desc: "",
        isRequired: false,
      },
      {
        key: "token",
        type: "string",
        desc: "Token de sesion",
        isRequired: true,
      },
    ],
    req: {
      documento_electronico: {
        encabezado: {
          identificacion_documento: {
            tipo_documento: "03",
            numero_documento: "000001",
            tipo_proveedor: "NO",
            numero_planilla_importacion: "string",
            numero_expediente_importacion: "string",
            serie_factura_afectada: "00",
            numero_factura_afectada: "000001",
            fecha_factura_afectada: "07/11/2024",
            monto_factura_afectada: "116.00",
            comentario_factura_afectada: "string",
            regimen_esp_tributacion: "PUERTO LIBRE ESTADO NUEVA ESPARTA",
            fecha_emision: "13/12/2024",
            fecha_vencimiento: null,
            hora_emision: "09:59:33 am",
            tipo_de_pago: "INMEDIATO",
            serie: "00",
            sucursal: null,
            tipo_de_venta: "INT",
            moneda: "VED",
          },
          vendedor: {
            codigo: "05",
            nombre: "[NOMBRE VENDEDOR]",
            num_cajero: "125",
          },
          comprador: {
            tipo_identificacion: "J",
            numero_identificacion: "29000123",
            razon_social: "[RAZON SOCIAL]",
            direccion: "[DIRECCION COMPRADOR]",
            pais: "VE",
            notificar: "NO",
            telefonos: ["string"],
            correos: ["string"],
            otros_envios: [
              {
                tipo: "string",
                destino: "string",
              },
            ],
          },
          totales: {
            nro_items: "1",
            monto_gravado_total: "50.00",
            monto_exento_total: "0.00",
            subtotal: "50.00",
            total_a_pagar: "58.00",
            total_iva: "8.00",
            monto_total_con_iva: "58.00",
            monto_en_letras: "CINCUENTA Y OCHO",
            total_descuento: "0.00",
            impuestos_subtotal: [
              {
                codigo_total_imp: "G",
                alicuota_imp: "16.00",
                base_imponible_imp: "50.00",
                valor_total_imp: "8.00",
              },
            ],
            formas_pago: [
              {
                descripcion: "string",
                fecha: "13/12/2024",
                forma: "01",
                monto: "58.00",
                moneda: "VED",
                tipo_cambio: "0.00",
              },
            ],
            total_igtf: "string",
          },
        },
        detalles_items: [
          {
            numero_linea: "0001",
            codigo: "string",
            bien_o_servicio: "1",
            descripcion: "DIFERENCIAL CAMBIARIO",
            cantidad: "1.00",
            unidad_medida: "UND",
            precio_unitario: "50.00",
            precio_item: "50.00",
            codigo_impuesto: "G",
            tasa_iva: "16.00",
            valor_iva: "8.00",
            valor_total_item: "58.00",
          },
        ],
      },
    },
    success: {
      codigo: 200,
      mensaje: "Emision Exitosa",
      documento: {
        imprenta: "ABC DIGITAL PRINTER",
        serie: "00",
        tipo_documento: "03",
        numero_documento_dig: "00-2",
        numero_control_dig: "00-58",
        fecha_asignacion_dig: "10/02/2025",
        hora_asignacion_dig: "14:25:31",
      },
    },
    failure: [
      {
        codigo: 404,
        mensaje: [
          " ERROR. DOCUMENTO DUPLICADO, VERIFIQUE EL NUMERO DE DOCUMENTO: 000001",
          "TIPO DE TRANSACCION INVALIDO. EL IDENTIFICACION_DOCUMENTO->TIPO DE TRANSACCION NO EXISTE",
        ],
        token: null,
        expiracion: null,
      },
    ],
  },

  {
    title: "Aplicar Retencion",
    icon: "receipt-tax",
    subtitle: "",
    method: "POST",
    url: "BaseURL + '/aplicar/retencion'",
    headers: [
      {
        key: "Content-Type",
        type: "string",
        desc: "",
        isRequired: false,
      },
      {
        key: "token",
        type: "string",
        desc: "Token de sesion",
        isRequired: true,
      },
    ],
    req: {
      retencion: {
        serie: "00",
        numero_documento: "000002",
        numero_control_dig: "00-4",
        total_retencion: {
          total_base_imponible: "100.00",
          numero_comprobante_retencion: "33333",
          fecha_emision_cr: "16/12/2024",
          total_IVA: "16.00",
          total_retenido: "12.00",
          total_ISLR: "0.00",
          total_IGTF: "0.00",
        },
      },
    },
    success: {
      codigo: 200,
      mensaje: "Retencion aplicada exitosamente",
      documento: {
        imprenta: "ABC DIGITAL PRINTER",
        serie: "00",
        tipo_documento: "01",
        numero_documento_dig: "00-54",
        numero_control_dig: "00-59",
        fecha_asignacion_dig: "10/02/2025",
        hora_asignacion_dig: "15:04:50",
      },
    },
    failure: [
      {
        codigo: 400,
        mensaje: ["ERROR EL DOCUMENTO AFECTADO ESTA DUPLICADO"],
        token: null,
        expiracion: null,
      },
    ],
  },

  {
    title: "Anular Documento",
    icon: "receipt-off",
    subtitle: "",
    method: "POST",
    url: "BaseURL + '/anular'",
    headers: [
      {
        key: "Content-Type",
        type: "string",
        desc: "",
        isRequired: false,
      },
      {
        key: "token",
        type: "string",
        desc: "Token de sesion",
        isRequired: true,
      },
    ],
    req: {
      serie: "00",
      numero_documento: "000002",
      tipo_documento: "01",
      motivo_anulacion: "motivo prueba",
      fecha_anulacion: "20/12/2024",
      hora_anulacion: "01:21:30 pm",
    },
    success: {
      codigo: 200,
      mensaje: "ABC DIGITAL PRINTER, DOCUMENTO ANULADO EXITOSAMENTE",
      documento: {
        imprenta: "ABC DIGITAL PRINTER",
        serie: "00",
        tipo_documento: "01",
        numero_documento_dig: "00-54",
        numero_control_dig: "00-59",
        fecha_asignacion_dig: "10/02/2025",
        hora_asignacion_dig: "15:04:50",
      },
    },
    failure: [
      {
        codigo: 400,
        mensaje: ["ERROR EL DOCUMENTO AFECTADO NO EXISTE O YA FUE ANULADO"],
        token: null,
        expiracion: null,
      },
    ],
  },
];
