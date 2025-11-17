import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
//? pdfmaker
import * as fs from 'file-saver';
import { __values } from 'tslib';
import { format, formatDate } from 'date-fns';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

(pdfMake as any).vfs = pdfFonts.vfs;

// Configura las fuentes (necesario para que funcione)
@Injectable({
  providedIn: 'root',
})
export class PrintService {
  constructor() {}
  // ? FUNCTIONS STANDAR HEADER PDF
  generatePDFHeader(
    _title: string,
    logoBase64: string,
    _subtitle?: string
  ): any {
    const currentDateTime = formatDate(new Date(), 'dd/MM/yyyy');
    const currentDateTimeAux = formatDate(new Date(), 'hh:mm aa');
    const headerBlock = {
      table: {
        widths: ['auto', '*', 'auto'],
        body: [
          [
            {
              image: logoBase64,
              width: 100,
              alignment: 'left',
              margin: [0, 0, 0, 0],
            },
            {
              stack: [
                { text: '', style: 'orgNameStyle' },
                {
                  text: ``,
                  style: 'rifStyle',
                },
              ],
              alignment: 'left',
            },
            {
              text: [
                'Fecha: ',
                currentDateTime,
                '\n',
                'Hora: ',
                currentDateTimeAux,
              ],
              alignment: 'right',
              margin: [0, 20, 0, 0],
              style: 'dateStyle',
            },
          ],
        ],
      },
      layout: 'noBorders',
      margin: [0, 0, 0, 10],
    };

    const titleBlock = {
      text: _title,
      alignment: 'center',
      width: '100%',
      bold: true,
      fontSize: 16,
      margin: [0, 0, 0, 0], // ◄ Ajusta márgenes para mejor visualización
    };

    const subtitleBlock = {
      text: _subtitle,
      alignment: 'center',
      width: '100%',
      bold: true,
      fontSize: 16,
      margin: [0, 0, 0, 0], // ◄ Ajusta márgenes para mejor visualización
    };

    return [headerBlock, titleBlock, subtitleBlock];
  }
  // ? STANDAR HEADER EXCEL

  generateExcelHeader(
    worksheet: XLSX.WorkSheet,
    reportTitle: string,
    numberOfColumns: number
  ): void {
    const currentDateTime = formatDate(new Date(), 'dd/MM/yyyy  hh:mm aa');

    // 1. Crear las filas de datos para el encabezado
    const headerRows = [
      [reportTitle], // Fila 1: Título principal
      [], // Fila 2: Fila vacía para espaciar
      ['Organización:', 'ABC DIGITAL PRINTING', '', 'Fecha:', currentDateTime], // Fila 3
      ['RIF:', 'J-50604016-6'], // Fila 4
      [], // Fila 5: Fila vacía antes de los datos
    ];

    // 2. Pre-pender (añadir al principio) las filas del encabezado a la hoja de cálculo
    XLSX.utils.sheet_add_aoa(worksheet, headerRows, { origin: 'A1' });

    // 3. Definir la combinación de celdas para el título principal
    // Queremos que el título (en la fila 1, celda A1) ocupe todas las columnas.
    const merge = {
      s: { r: 0, c: 0 }, // Celda de inicio: Fila 0, Columna 0 (A1)
      e: { r: 0, c: numberOfColumns - 1 }, // Celda de fin: Fila 0, Última columna
    };

    // Si la hoja no tiene la propiedad !merges, la creamos
    if (!worksheet['!merges']) {
      worksheet['!merges'] = [];
    }
    worksheet['!merges'].push(merge);

    // Opcional: Centrar el título (esto es un hint para algunos visores de Excel)
    // La estilización en la librería es limitada, pero esto puede ayudar.
    // worksheet['A1'].s = { alignment: { horizontal: "center" } };
  }

  generateDynamicSimpleTable(
    // 🚨 1. ACTUALIZACIÓN: Añadir 'alignment' a la configuración de la columna
    columnsConfig: Array<{
      header: string;
      key: string;
      width?: string | number;
      alignment?: 'left' | 'right' | 'center' | 'justify'; // Agregamos la alineación opcional
    }>,
    data: any[],
    options?: {
      headerStyle?: any;
      bodyStyle?: any;
      layout?: string;
    }
  ): any {
    // Extrae headers y widths de columnsConfig
    const headers = columnsConfig.map((col) => col.header);
    // Usa el width definido o '*' por defecto
    const widths = columnsConfig.map((col) => col.width || '*');

    // Configuración de la tabla
    const tableBody = [
      // Cabeceras (Nota: Tu estilo 'tableHeader' probablemente ya define 'alignment: center' para los títulos)
      headers.map((header) => ({
        text: header,
        style: 'tableHeader',
        ...(options?.headerStyle || {}),
      })),

      // 🚨 2. CAMBIO CRUCIAL: Aplicar la alineación a las celdas de datos
      ...data.map((row) =>
        columnsConfig.map((col) => ({
          text: row[col.key] || '', // Usa la key para acceder al valor
          style: 'tableBody',
          ...(options?.bodyStyle || {}),

          // 🚨 APLICAR ALINEACIÓN: Usamos el 'alignment' de la configuración de la columna.
          // Si 'alignment' no está definido en col, pdfmake usará la alineación por defecto del estilo 'tableBody'.
          ...(col.alignment && { alignment: col.alignment }),
        }))
      ),
    ];

    // Retorna la tabla con los widths personalizados
    return {
      table: {
        headerRows: 1,
        widths: widths, // Anchos de columnsConfig
        body: tableBody,
      },
      layout: options?.layout || null,
      margin: [0, 5, 0, 15],
    };
  }

  // ? PDF LIBRO DE VENTA
  async generateLibroVentaPDF(_data: any, mesSeleccionado: string) {
    console.log('_dATA =>', _data);
    const logoBase64 = await this.getBase64Image('assets/img/logo7.png');
    const columnsConfig = [
      { header: `Fecha Factura`, width: 'auto', key: 'FechaFactura' },
      { header: `RIF`, width: '*', key: 'RIFComprador' },
      { header: `Razón social`, width: '*', key: 'RazonSocial' },
      { header: `RIF Tercero`, width: 'auto', key: 'RifTercero' },
      {
        header: `Razon social del Tercero`,
        width: 'auto',
        key: 'RazonSocialTercero',
      },
      {
        header: `N.º de documento interno`,
        width: 'auto',
        key: 'NDocumentoInterno',
      },
      { header: `N.º de Control`, width: 'auto', key: 'NControl' },
      { header: `N.º de Factura`, width: '*', key: 'NFactura' },
      { header: `N.º de Nota Debito`, width: '*', key: 'NNotaDedito' },
      { header: `N.º de Nota Credito`, width: 'auto', key: 'NNotaCredito' },
      {
        header: `N.º Documento Afectado`,
        width: 'auto',
        key: 'NDocumentoAfectado',
      },
      {
        header: `Fecha Comprobante Retencion`,
        width: 'auto',
        key: 'FComprobanteRet',
      },
      {
        header: `Numero Comprobante Retencion`,
        width: 'auto',
        key: 'NComprobanteRet',
      },
      { header: `Total Ventas con IVA`, width: '*', key: 'TotalVentasIVA' },
      {
        header: `Ventas Internas No Gravadas`,
        width: 'auto',
        key: 'VentasInternasNoGravadas',
      },
      { header: `Base Imponible G`, width: 'auto', key: 'BaseImponibleG' },
      { header: `% Alicuota G`, width: 'auto', key: 'PorcenAlicuotaG' },
      { header: `IVA G`, width: 'auto', key: 'IvaG' },
      { header: `Base Imponible R`, width: 'auto', key: 'BaseImponibleR' },
      { header: `% Alicuota R`, width: 'auto', key: 'PorcenAlicuotaR' },
      { header: `Impuesto IVA R`, width: 'auto', key: 'ImpuestoIvaR' },
      { header: `Base Imponible A`, width: 'auto', key: 'BaseImponibleA' },
      { header: `% Alicuota A`, width: 'auto', key: 'PorcenAlicuotaA' },
      { header: `Impuesto IVA A`, width: 'auto', key: 'ImpuestoIvaA' },
      { header: `IVA RETENIDO`, width: 'auto', key: 'IvaRetenido' },
    ];
    if (!mesSeleccionado) {
      console.error('Mes no proporcionado para generar el PDF.');
      return;
    }

    const [reportYear, reportMonth] = mesSeleccionado.split('-').map(Number);
    // ? PROCESAR DATA
    const processDocument = (document: any) => {
      const parseDateFromString = (dateString: string): Date | null => {
        const parts = dateString?.split('/');
        if (parts && parts.length === 3) {
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1; // Meses en JS son 0-11
          const year = parseInt(parts[2], 10);
          const date = new Date(year, month, day);
          if (
            date.getFullYear() === year &&
            date.getMonth() === month &&
            date.getDate() === day
          ) {
            return date;
          }
        }
        return null;
      };
      const dateObject = parseDateFromString(document.fecha_asignacion_digital);
      const formattedDate = dateObject
        ? dateObject.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })
        : 'FECHA INVÁLIDA';
      let documentNumber = {
        numero_factura:
          document.tipo_documento == '01' ? document.numero_documento_dig : '',
        numero_credito:
          document.tipo_documento == '02' ? document.numero_documento_dig : '',
        numero_debito:
          document.tipo_documento == '03' ? document.numero_documento_dig : '',
      };

      let auxImpuestos = {
        ivaA: { alicuota: '', base_imponible: '', valor_total_imp: '' },
        ivaG: { alicuota: '', base_imponible: '', valor_total_imp: '' },
        ivaR: { alicuota: '', base_imponible: '', valor_total_imp: '' },
      };

      if (document.totales != null && document.totales.impuestos_subtotal) {
        for (let impuesto of document.totales.impuestos_subtotal) {
          switch (impuesto.codigo_total_imp) {
            case 'E':
              auxImpuestos.ivaA = {
                alicuota: impuesto.alicuota_imp,
                base_imponible: impuesto.base_imponible_imp,
                valor_total_imp: impuesto.valor_total_imp,
              };
              break;
            case 'G':
              auxImpuestos.ivaG = {
                alicuota: impuesto.alicuota_imp,
                base_imponible: impuesto.base_imponible_imp,
                valor_total_imp: impuesto.valor_total_imp,
              };
              break;
            case 'A':
              auxImpuestos.ivaR = {
                alicuota: impuesto.alicuota_imp,
                base_imponible: impuesto.base_imponible_imp,
                valor_total_imp: impuesto.valor_total_imp,
              };
              break;
            default:
              break;
          }
        }
      }

      let auxComprador = {
        tipo_identificacion: document.comprador?.tipo_identificacion || '',
        numero_identificacion: document.comprador?.numero_identificacion || '',
        razon_social: document.comprador?.razon_social || '',
      };

      let auxTercero = {
        tipo_identificacion: document.tercero?.tipo_identificacion || '',
        numero_identificacion: document.tercero?.numero_identificacion || '',
        razon_social: document.tercero?.razon_social || '',
      };

      let auxTotalRetention = {
        fecha_emision_cr: document.totales_retencion?.fecha_emision_cr || '',
        numero_comp_retencion:
          document.totales_retencion?.numero_comp_retencion || '',
      };

      return {
        FechaFactura: formattedDate,
        RIFComprador: auxComprador.tipo_identificacion
          ? `${auxComprador.tipo_identificacion}-${auxComprador.numero_identificacion}`
          : '',
        RazonSocial: auxComprador.razon_social,
        RifTercero: auxTercero.tipo_identificacion
          ? `${auxTercero.tipo_identificacion}-${auxTercero.numero_identificacion}`
          : '',
        RazonSocialTercero: auxTercero.razon_social,
        NDocumentoInterno: document.numero_documento,
        NControl: document.numero_control_dig,
        NFactura: documentNumber.numero_factura,
        NNotaDedito: documentNumber.numero_debito,
        NNotaCredito: documentNumber.numero_credito,
        NDocumentoAfectado: document.numero_factura_afectada,
        FComprobanteRet: auxTotalRetention.fecha_emision_cr,
        NComprobanteRet: auxTotalRetention.numero_comp_retencion,
        TotalVentasIVA: document.totales?.monto_total_con_iva,
        VentasInternasNoGravadas: document.totales?.monto_gravado_total,
        BaseImponibleG: auxImpuestos.ivaG.base_imponible,
        PorcenAlicuotaG: auxImpuestos.ivaG.alicuota,
        IvaG: auxImpuestos.ivaG.valor_total_imp,
        BaseImponibleR: auxImpuestos.ivaR.base_imponible,
        PorcenAlicuotaR: auxImpuestos.ivaR.alicuota,
        ImpuestoIvaR: auxImpuestos.ivaR.valor_total_imp,
        BaseImponibleA: auxImpuestos.ivaA.base_imponible,
        PorcenAlicuotaA: auxImpuestos.ivaA.alicuota,
        ImpuestoIvaA: auxImpuestos.ivaA.valor_total_imp,
        IvaRetenido: document.totales_retencion?.total_retenido,
      };
    };

    const processedData = _data.documentos.map((doc: any) =>
      processDocument(doc)
    );
    const totals = processedData.reduce(
      (acc: any, row: any) => {
        acc.TotalVentasIVA += parseFloat(row.TotalVentasIVA) || 0;
        acc.VentasInternasNoGravadas +=
          parseFloat(row.VentasInternasNoGravadas) || 0;
        acc.BaseImponibleG += parseFloat(row.BaseImponibleG) || 0;
        acc.IvaG += parseFloat(row.IvaG) || 0;
        acc.BaseImponibleR += parseFloat(row.BaseImponibleR) || 0;
        acc.ImpuestoIvaR += parseFloat(row.ImpuestoIvaR) || 0;
        acc.BaseImponibleA += parseFloat(row.BaseImponibleA) || 0;
        acc.ImpuestoIvaA += parseFloat(row.ImpuestoIvaA) || 0;
        acc.IvaRetenido += parseFloat(row.IvaRetenido) || 0;
        return acc;
      },
      {
        TotalVentasIVA: 0,
        VentasInternasNoGravadas: 0,
        BaseImponibleG: 0,
        IvaG: 0,
        BaseImponibleR: 0,
        ImpuestoIvaR: 0,
        BaseImponibleA: 0,
        ImpuestoIvaA: 0,
        IvaRetenido: 0,
      }
    );

    const totalsRow = columnsConfig.map((col, index) => {
      if (index === 0) {
        return { text: 'TOTALES', style: 'totalLabel', alignment: 'left' };
      }
      if (totals.hasOwnProperty(col.key)) {
        return {
          text: this.formatNumber(totals[col.key]),
          style: 'totalValue',
          alignment: 'right',
        };
      }
      return { text: '', style: 'tableBody', alignment: 'left' };
    });

    const generateFullMonthData = (
      salesData: any[],
      year: number,
      month: number
    ): any[] => {
      const salesDays = new Set(salesData.map((d) => d.FechaFactura));
      const fullMonthData = [];
      const daysInMonth = new Date(year, month, 0).getDate();

      for (let day = 1; day <= daysInMonth; day++) {
        const currentDateStr = `${String(day).padStart(2, '0')}/${String(
          month
        ).padStart(2, '0')}/${year}`;
        if (!salesDays.has(currentDateStr)) {
          fullMonthData.push({
            FechaFactura: currentDateStr,
            isNoSalesDay: true,
          });
        }
      }

      const combinedData = [...salesData, ...fullMonthData];

      combinedData.sort((a, b) => {
        const partsA = a.FechaFactura.split('/');
        const dateA = new Date(+partsA[2], +partsA[1] - 1, +partsA[0]);
        const partsB = b.FechaFactura.split('/');
        const dateB = new Date(+partsB[2], +partsB[1] - 1, +partsB[0]);
        return dateA.getTime() - dateB.getTime();
      });

      return combinedData;
    };

    const finalReportData = generateFullMonthData(
      processedData,
      reportYear,
      reportMonth
    );

    const tableBody = [
      columnsConfig.map((col) => ({
        text: col.header,
        style: 'tableHeader',
        alignment: 'left',
      })),

      ...finalReportData.map((row: any) => {
        if (row.isNoSalesDay) {
          const noSalesRow: any[] = [
            {
              text: row.FechaFactura,
              style: 'noSalesRowStyle',
              alignment: 'left',
            },
            {
              text: 'NO HUBO VENTA',
              style: 'noSalesRowStyle',
              alignment: 'center',
              colSpan: columnsConfig.length - 1,
            },
          ];
          for (let i = 0; i < columnsConfig.length - 2; i++) {
            noSalesRow.push({
              text: '',
              style: 'tableBody',
              alignment: 'left',
            });
          }
          return noSalesRow;
        } else {
          return columnsConfig.map((col) => {
            const value = row[col.key];

            return {
              text:
                typeof value === 'number'
                  ? this.formatNumber(value)
                  : value || '',
              style: 'tableBody',
              alignment: typeof value === 'number' ? 'right' : 'left',
            };
          });
        }
      }),

      totalsRow,
    ];

    const docDefinition = {
      pageOrientation: 'landscape',
      pageSize: 'A1',
      content: [
        this.generatePDFHeader('LIBRO DE VENTA', logoBase64, ''),
        {
          table: {
            headerRows: 1,
            widths: columnsConfig.map((col) => col.width),
            body: tableBody,
          },
          layout: {
            hLineWidth: function (i: any, node: any) {
              return 0.5;
            }, // Grosor líneas horizontales
            vLineWidth: function (i: any, node: any) {
              return 0.5;
            }, // Grosor líneas verticales
            hLineColor: function (i: any, node: any) {
              return '#cccccc';
            }, // Color gris
            vLineColor: function (i: any, node: any) {
              return '#cccccc';
            },
            paddingLeft: function (i: any, node: any) {
              return 4;
            }, // Espaciado interno
            paddingRight: function (i: any, node: any) {
              return 4;
            },
          },
        },
      ],
      styles: {
        header: { fontSize: 18, bold: true },
        tableHeader: {
          fillColor: '#34495e',
          color: '#ffffff',
          bold: true,
        },
        tableBody: {
          fontSize: 10,
          margin: [0, 5],
        },
      },
    };

    // 3. Generar PDF
    this.generatePDF(docDefinition, 'LIBRO DE VENTA');
  }
  generarLibroVentasExcel(_data: any, _date: any) {
    let rowDocument: any = [];
    let date = new Date();
    let trasformDate = format(new Date(date), "yyyy-MM-dd  hh:mm aaaaa'm'");

    const start = new Date(_date.desde);
    const end = new Date(_date.hasta);

    // Primero, normalizamos las fechas (quitamos la hora)
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    // 1. Agrupamos los documentos por fecha (formato DD/MM/YYYY)
    const documentosPorFecha: { [fecha: string]: any[] } = {};

    if (_data.documentos && _data.documentos.length > 0) {
      _data.documentos.forEach((document: any) => {
        // Extraemos solo la parte de la fecha (DD/MM/YYYY)
        const fechaDoc = document.fecha_asignacion_digital.split(' ')[0];
        if (!documentosPorFecha[fechaDoc]) {
          documentosPorFecha[fechaDoc] = [];
        }
        documentosPorFecha[fechaDoc].push(document);
      });
    }
    rowDocument.push([
      {
        text: 'ABC PRINTING DIGITAL',
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
    ]);
    rowDocument.push([
      {
        text: 'J-50604016-6',
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {
        text: 'Fecha:' + trasformDate,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
    ]);
    rowDocument.push([]);
    rowDocument.push([
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {
        text: 'LIBRO DE VENTAS',
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
    ]);
    rowDocument.push([]);
    rowDocument.push([
      {
        text: `Fecha Factura`,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: `RIF`,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: `Razón social`,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: `RIF Tercero`,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: `Razon social del Tercero`,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: `N.º de documento interno`,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: `N.º de Control`,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: `N.º de Factura`,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: `N.º de Nota Debito`,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: `N.º de Nota Credito`,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: `N.º Documento Afectado`,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: `Fecha Comprobante Retencion`,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: `Numero Comprobante Retencion`,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: `Total Ventas con IVA`,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: `Ventas Internas No Gravadas`,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: `Base Imponible G`,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: `% Alicuota G`,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: `IVA G`,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: `Base Imponible R`,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: `% Alicuota R`,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: `Impuesto IVA R`,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: `Base Imponible A`,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: `% Alicuota A`,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: `Impuesto IVA A`,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: `IVA RETENIDO`,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
    ]);
    // 2. Generamos todas las fechas en el rango
    const allDates = this.getDatesInRange(start, end);

    // 3. Procesamos cada fecha en el rango
    for (const currentDate of allDates) {
      // Formateamos la fecha como DD/MM/YYYY para comparar
      const dateStr = format(currentDate, 'dd/MM/yyyy');

      if (
        documentosPorFecha[dateStr] &&
        documentosPorFecha[dateStr].length > 0
      ) {
        // Hay documentos para esta fecha, los procesamos
        for (let document of documentosPorFecha[dateStr]) {
          // Verificamos si el documento está anulado
          if (!document.anulado) {
            this.processDocumentLibroVentaExcel(document, rowDocument);
          }
        }
      } else {
        // No hay documentos para esta fecha, agregamos fila "NO HUBO VENTA"
        rowDocument.push(this.createNoSaleRow(currentDate));
      }
    }
    let totalVentasIva = 0;
    let totalInternasNoGravadas = 0;
    let baseImponibleG = 0;
    let ivaG = 0;
    let baseImponibleR = 0;
    let impuestoIvaR = 0;
    let baseImponibleA = 0;
    let impuestoIvaA = 0;
    let ivaRetenido = 0;
    for (let document of _data.documentos) {
      let auxImpuestos = {
        ivaA: { alicuota: '', base_imponible: 0, valor_total_imp: 0 },
        ivaG: { alicuota: '', base_imponible: 0, valor_total_imp: 0 },
        ivaR: { alicuota: '', base_imponible: 0, valor_total_imp: 0 },
      };

      if (document.totales != null && document.totales.impuestos_subtotal) {
        for (let impuesto of document.totales.impuestos_subtotal) {
          switch (impuesto.codigo_total_imp) {
            case 'E':
              auxImpuestos.ivaA = {
                alicuota: impuesto.alicuota_imp,
                base_imponible: impuesto.base_imponible_imp,
                valor_total_imp: impuesto.valor_total_imp,
              };
              break;
            case 'G':
              auxImpuestos.ivaG = {
                alicuota: impuesto.alicuota_imp,
                base_imponible: impuesto.base_imponible_imp,
                valor_total_imp: impuesto.valor_total_imp,
              };
              break;
            case 'A':
              auxImpuestos.ivaR = {
                alicuota: impuesto.alicuota_imp,
                base_imponible: impuesto.base_imponible_imp,
                valor_total_imp: impuesto.valor_total_imp,
              };
              break;
            default:
              break;
          }
        }
      }
      totalVentasIva += Number(document.totales?.monto_total_con_iva) || 0;
      totalInternasNoGravadas +=
        Number(document.totales?.monto_gravado_total) || 0;
      baseImponibleG += Number(auxImpuestos.ivaG.base_imponible);
      ivaG += Number(auxImpuestos.ivaG.valor_total_imp);
      baseImponibleR += Number(auxImpuestos.ivaR.valor_total_imp);
      impuestoIvaR += Number(auxImpuestos.ivaR.valor_total_imp);
      impuestoIvaA += Number(auxImpuestos.ivaA.valor_total_imp);
      baseImponibleA += Number(auxImpuestos.ivaA.base_imponible);
      ivaRetenido += Number(document.totales_retencion?.total_retenido) || 0;
    }
    rowDocument.push([
      {
        text: `TOTALES`,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {
        text: totalVentasIva,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: totalInternasNoGravadas,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: baseImponibleG,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: '-',
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: ivaG,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: baseImponibleR,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: '-',
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: impuestoIvaR,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: baseImponibleA,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: '-',
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: impuestoIvaA,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: ivaRetenido,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
    ]);
    const excelData = this.convertToExcelData(rowDocument);
    const worksheet = XLSX.utils.aoa_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `${trasformDate}`);
    XLSX.writeFile(workbook, `LIBRO DE VENTAS ${trasformDate}.xlsx`);
  }

  // ? REPORTE MENSUAL PROVICENDIA 000102 ART 32

  // ! ANUAL
  async generateProvidenciaReportBasicAnual(_data: any, _fechaDelAnio: string) {
    // --- PASO 1: Calcular el AÑO del reporte y definir los meses ---
    if (!_data || !_data.data) {
      console.error(
        "Los datos recibidos no tienen la estructura esperada o el array 'data' está vacío."
      );
      return;
    }

    const parseDateFromString = (dateString: string): Date | null => {
      const parts = dateString?.split('/');
      if (parts && parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        const date = new Date(year, month, day);
        if (
          date.getFullYear() === year &&
          date.getMonth() === month &&
          date.getDate() === day
        ) {
          return date;
        }
      }
      return null;
    };

    const referenceDate = parseDateFromString(_fechaDelAnio);
    if (!referenceDate) {
      console.error('La fecha proporcionada es inválida:', _fechaDelAnio);
      return;
    }

    const reportYear = referenceDate.getFullYear();
    const reportTitle = `Control Anual de Emisores Documentos Digitales - Año ${reportYear}`;
    const subTitle = ``;

    const allYearMonths = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];

    // --- PASO 2: Pivotar los Datos por Mes Y CALCULAR TOTALES ---
    const pivotedDataMap = new Map<string, any>();
    const monthlyTotals: { [key: string]: number } = {};
    let superTotalSum = 0; // 🚨 Variable para el Súper Total Anual

    _data.data.forEach((record: any) => {
      const rifKey = record.org_value;
      if (!pivotedDataMap.has(rifKey)) {
        pivotedDataMap.set(rifKey, {
          contribuyente: record.org_name.trim(),
          rif: rifKey,
          serie: 'N/A',
          monthlySummaries: {},
        });
      }
      const pivotedRecord = pivotedDataMap.get(rifKey);
      const monthKey = record.subperiodo;

      pivotedRecord.monthlySummaries[monthKey] = {
        desde: record.primer_numero_valido,
        hasta: record.ultimo_numero_valido,
        total: record.documentos_validos,
      };

      const totalValue = parseInt(record.documentos_validos, 10) || 0;

      // Suma de totales mensuales
      if (!monthlyTotals[monthKey]) {
        monthlyTotals[monthKey] = 0;
      }
      monthlyTotals[monthKey] += totalValue;

      // 🚨 Suma al Súper Total Anual
      superTotalSum += totalValue;
    });

    const finalTableData = Array.from(pivotedDataMap.values());

    // 🚨 Definición de Columnas para cálculos de colSpan
    // 4 Fijas (Nro., Contribuyente, RIF, Serie)
    const NUM_COLUMNAS_FIJAS = 4;
    // 3 columnas por cada mes (Desde, Hasta, Total)
    const COLUMNAS_POR_MES = 3;
    const TOTAL_COLUMNAS =
      NUM_COLUMNAS_FIJAS + allYearMonths.length * COLUMNAS_POR_MES;

    // --- PASO 3: Construir la Estructura de la Tabla Anual ---

    // 1. Fila de Encabezados Principales (Header Rows)
    const mainHeadersRow: any[] = [
      // 🚨 CAMBIO 1: Nueva columna NRO.
      {
        text: 'NRO.',
        style: 'tableHeader',
        rowSpan: 2,
        alignment: 'center',
        margin: [0, 8, 0, 0],
      },
      {
        text: 'EMISOR',
        style: 'tableHeader',
        rowSpan: 2,
        alignment: 'center',
        margin: [0, 8, 0, 0],
      },
      {
        text: 'RIF',
        style: 'tableHeader',
        rowSpan: 2,
        alignment: 'center',
        margin: [0, 8, 0, 0],
      },
      {
        text: 'SERIE',
        style: 'tableHeader',
        rowSpan: 2,
        alignment: 'center',
        margin: [0, 8, 0, 0],
      },
    ];
    allYearMonths.forEach((monthName) => {
      mainHeadersRow.push({
        text: monthName.toUpperCase(),
        style: 'tableHeader',
        colSpan: COLUMNAS_POR_MES,
        alignment: 'center',
      });
      // Relleno para el colSpan
      mainHeadersRow.push({});
      mainHeadersRow.push({});
    });

    // 2. Fila de Sub-encabezados (Sub-Header Rows)
    // 🚨 CAMBIO 2: Se añade una celda vacía más (NRO.)
    const subHeadersRow: any[] = [{}, {}, {}, {}];
    allYearMonths.forEach(() => {
      subHeadersRow.push({
        text: 'Desde',
        style: 'tableHeader',
        alignment: 'center',
      });
      subHeadersRow.push({
        text: 'Hasta',
        style: 'tableHeader',
        alignment: 'center',
      });
      subHeadersRow.push({
        text: 'Total Asignado',
        style: 'tableHeader',
        alignment: 'center',
      });
    });

    // 3. Filas de Datos (Data Rows)
    const tableRows = finalTableData.map((record, index) => {
      const row = [
        // 🚨 CAMBIO 3: Insertar el contador de línea
        {
          text: (index + 1).toString(),
          style: 'tableBody',
          alignment: 'center',
        },
        { text: record.contribuyente, style: 'tableBody' },
        { text: record.rif, style: 'tableBody' },
        { text: record.serie, style: 'tableBody' },
      ];
      allYearMonths.forEach((monthName) => {
        const monthData = record.monthlySummaries[monthName];
        if (monthData) {
          // Se agrega alineación a la derecha para los números
          row.push({
            text: monthData.desde,
            style: 'tableBody',
            alignment: 'right',
          });
          row.push({
            text: monthData.hasta,
            style: 'tableBody',
            alignment: 'right',
          });
          row.push({
            text: this.formatNumber(monthData.total),
            style: 'tableBody',
            alignment: 'right',
          });
        } else {
          row.push({ text: '-', style: 'tableBody', alignment: 'center' });
          row.push({ text: '-', style: 'tableBody', alignment: 'center' });
          row.push({ text: '-', style: 'tableBody', alignment: 'center' });
        }
      });
      return row;
    });

    // 4. Construcción de la fila de totales (Total Mensual)
    const totalRow: any[] = [
      { text: '', style: 'tableTotalLabel', fillColor: '#ecf0f1' }, // NRO.
      {
        text: 'TOTALES',
        style: 'tableTotalLabel',
        colSpan: 3, // Abarca Contribuyente, RIF, Serie
        alignment: 'right',
      },
      {},
      {},
    ];
    allYearMonths.forEach((monthName) => {
      const monthTotal = monthlyTotals[monthName] || 0;
      // Dos celdas vacías (Desde, Hasta)
      totalRow.push({
        text: '',
        style: 'tableTotalValue',
        fillColor: '#ecf0f1',
      });
      totalRow.push({
        text: '',
        style: 'tableTotalValue',
        fillColor: '#ecf0f1',
      });
      // Celda de Total Asignado
      totalRow.push({
        text: monthTotal > 0 ? this.formatNumber(monthTotal) : '0',
        style: 'tableTotalValue',
        alignment: 'right',
      });
    });

    // 5. 🚨 Construcción de la fila del Súper Total Anual
    // La etiqueta debe abarcar todas las columnas excepto la última celda de totales (la última de Diciembre).
    const superTotalLabelColSpan = TOTAL_COLUMNAS - 1;
    const superTotalRow: any[] = [];

    // Primera celda: La etiqueta con el colSpan
    superTotalRow.push({
      text: 'GRAN TOTAL',
      style: 'tableTotalLabel',
      colSpan: superTotalLabelColSpan,
      alignment: 'right',
      fillColor: '#d6eaf8',
    });

    // Rellenamos con celdas vacías para el colSpan (total de celdas a rellenar: colSpanValue - 1)
    for (let i = 0; i < superTotalLabelColSpan - 1; i++) {
      superTotalRow.push({ text: '', fillColor: '#d6eaf8' });
    }

    // La última celda contiene el valor del Súper Total
    superTotalRow.push({
      text: this.formatNumber(superTotalSum),
      style: 'tableTotalValue',
      alignment: 'right',
      fontSize: 12,
      fillColor: '#d6eaf8',
    });

    // 6. Ensamblar el cuerpo de la tabla
    const tableBody = [
      mainHeadersRow,
      subHeadersRow,
      ...tableRows,
      totalRow,
      superTotalRow,
    ];

    // --- PASO 7: Ensamblar el PDF Final ---
    const logoBase64 = await this.getBase64Image('assets/img/logo7.png');

    // 🚨 CAMBIO 4: Ajustar los widths para incluir la columna NRO.
    // Fijas: Nro (auto), Contribuyente (*), RIF (auto), Serie (auto)
    const fixedWidths = ['auto', '*', 'auto', 'auto'];

    // Semanales: Tres 'auto' por cada mes (Desde, Hasta, Total)
    const monthlyWidths = allYearMonths.flatMap(() => ['auto', 'auto', 'auto']);

    const docDefinition = {
      pageOrientation: 'landscape',
      pageSize: 'A1',
      content: [
        this.generatePDFHeader(reportTitle, logoBase64, subTitle),
        {
          table: {
            headerRows: 2,
            widths: [
              ...fixedWidths, // 4 columnas fijas
              ...monthlyWidths, // 12 * 3 = 36 columnas mensuales
            ],
            body: tableBody,
          },
        },
      ],
      styles: {
        header: { fontSize: 15, bold: true, margin: [0, 0, 0, 10] },
        tableHeader: {
          bold: true,
          fillColor: '#34495e',
          color: '#ffffff',
          fontSize: 8,
          alignment: 'center',
        },
        tableBody: { fontSize: 8, alignment: 'left', margin: [0, 2, 0, 2] },
        tableTotalLabel: {
          bold: true,
          fontSize: 10,
          fillColor: '#ecf0f1',
        },
        tableTotalValue: {
          bold: true,
          fontSize: 8,
          fillColor: '#ecf0f1',
        },
      },
    };

    this.generatePDF(docDefinition, `Reporte Anual ${reportYear}`);
  }
  async generateProvidenciaReportBasicAnualExcel(
    _data: any,
    _fechaDelAnio: string
  ) {
    // --- PASO 1: Calcular el AÑO del reporte y definir los meses ---
    const parseDateFromString = (dateString: string): Date | null => {
      const parts = dateString?.split('/');
      if (parts && parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        const date = new Date(year, month, day);
        if (
          date.getFullYear() === year &&
          date.getMonth() === month &&
          date.getDate() === day
        ) {
          return date;
        }
      }
      return null;
    };

    const referenceDate = parseDateFromString(_fechaDelAnio);
    if (!referenceDate) {
      console.error('La fecha proporcionada es inválida:', _fechaDelAnio);
      return;
    }

    const reportYear = referenceDate.getFullYear();
    const reportTitle = `Reporte Anual Oficial Providencia 000102 Art 32 - Año ${reportYear}`;

    const allYearMonths = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];

    // --- PASO 2: Pivotar los Datos por Mes Y CALCULAR TOTALES ---
    const pivotedDataMap = new Map<string, any>();
    const monthlyTotals: { [key: string]: number } = {};

    _data.data.forEach((record: any) => {
      const rifKey = record.org_value;
      if (!pivotedDataMap.has(rifKey)) {
        pivotedDataMap.set(rifKey, {
          contribuyente: record.org_name.trim(),
          rif: rifKey,
          serie: 'N/A', // O el campo correcto si existe
          monthlySummaries: {},
        });
      }
      const pivotedRecord = pivotedDataMap.get(rifKey);

      const monthKey = record.subperiodo;
      pivotedRecord.monthlySummaries[monthKey] = {
        desde: record.primer_numero_valido,
        hasta: record.ultimo_numero_valido,
        total: record.documentos_validos,
      };

      const totalValue = parseInt(record.documentos_validos, 10) || 0;
      if (!monthlyTotals[monthKey]) {
        monthlyTotals[monthKey] = 0;
      }
      monthlyTotals[monthKey] += totalValue;
    });

    const finalTableData = Array.from(pivotedDataMap.values());

    // --- PASO 3: Construir la Hoja de Cálculo como un "Array de Arrays" ---
    const currentDateTime = formatDate(new Date(), 'dd/MM/yyyy  hh:mm aa');

    // 3.1: Filas del encabezado general del reporte
    const reportHeaderRows = [
      [], // Fila 1 vacía (espacio superior)
      ['ABC DIGITAL PRINTING', '', '', 'Fecha:', currentDateTime], // Fila 2
      ['J-50604016-6'], // Fila 3
      [], // Fila 4 vacía
      ['', '', reportTitle], // Fila 5 para el título (centrado)
      [], // Fila 6 y 7 vacías para separar del contenido
      [],
    ];

    // 3.2: Filas de las cabeceras de la tabla
    const mainHeadersRow: (string | null)[] = ['CONTRIBUYENTE', 'RIF', 'SERIE'];
    allYearMonths.forEach((monthName) => {
      mainHeadersRow.push(monthName.toUpperCase());
      mainHeadersRow.push(null); // Placeholder para la celda combinada
      mainHeadersRow.push(null); // Placeholder para la celda combinada
    });

    const subHeadersRow: (string | null)[] = [null, null, null]; // Placeholders para las celdas combinadas verticalmente
    allYearMonths.forEach(() => {
      subHeadersRow.push('Desde');
      subHeadersRow.push('Hasta');
      subHeadersRow.push('Total Asignado');
    });

    // 3.3: Filas de los datos de la tabla
    const dataRows = finalTableData.map((record) => {
      const row = [record.contribuyente, record.rif, record.serie];
      allYearMonths.forEach((monthName) => {
        const monthData = record.monthlySummaries[monthName];
        if (monthData) {
          row.push(monthData.desde, monthData.hasta, monthData.total);
        } else {
          row.push('-', '-', '-');
        }
      });
      return row;
    });

    // 3.4: Fila de los totales de la tabla
    const totalRow: (string | number | null)[] = ['TOTALES', null, null];
    allYearMonths.forEach((monthName) => {
      const monthTotal = monthlyTotals[monthName] || 0;
      totalRow.push(null, null, monthTotal > 0 ? monthTotal : 0);
    });

    // 3.5: Unir todo en la hoja de cálculo final
    const finalSheetData = [
      ...reportHeaderRows,
      mainHeadersRow,
      subHeadersRow,
      ...dataRows,
      totalRow,
    ];

    // --- PASO 4: Crear la Hoja, Aplicar Formatos y Descargar ---
    const worksheet = XLSX.utils.aoa_to_sheet(finalSheetData);

    // 4.1: Definir todas las celdas combinadas
    const merges = [
      // Cabeceras de la tabla que ocupan 2 filas de alto
      { s: { r: 7, c: 0 }, e: { r: 8, c: 0 } }, // Contribuyente
      { s: { r: 7, c: 1 }, e: { r: 8, c: 1 } }, // RIF
      { s: { r: 7, c: 2 }, e: { r: 8, c: 2 } }, // Serie
    ];
    // Cabeceras de meses que ocupan 3 columnas de ancho
    allYearMonths.forEach((month, index) => {
      const startCol = 3 + index * 3;
      merges.push({ s: { r: 7, c: startCol }, e: { r: 7, c: startCol + 2 } });
    });
    // Fila de totales que ocupa 3 columnas de ancho
    const totalRowIndex = finalSheetData.length - 1;
    merges.push({
      s: { r: totalRowIndex, c: 0 },
      e: { r: totalRowIndex, c: 2 },
    });
    worksheet['!merges'] = merges;

    // 4.2: Definir anchos de columna
    worksheet['!cols'] = [
      { wch: 40 }, // Contribuyente
      { wch: 15 }, // RIF
      { wch: 10 }, // Serie
      ...allYearMonths.flatMap(() => [{ wch: 18 }, { wch: 18 }, { wch: 15 }]), // Anchos para Desde, Hasta, Total
    ];

    // 4.3: Crear y descargar el libro
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte Anual');
    XLSX.writeFile(workbook, `ReporteAnual - ${reportYear}.xlsx`);
  }
  // ! MENSUAL
  async generateProvidenciaReportBasicMensual(
    _data: any,
    _fechaDelMes: string
  ) {
    if (!_data || !_data.data) {
      console.error(
        "Los datos recibidos no tienen la estructura esperada o el array 'data' está vacío."
      );
      return;
    }

    // --- PASO 1: Lógica de Fechas y Semanas (SIN CAMBIOS) ---
    const parseDateFromString = (dateString: string): Date | null => {
      const parts = dateString?.split('/');
      if (parts && parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        const date = new Date(year, month, day);
        if (
          date.getFullYear() === year &&
          date.getMonth() === month &&
          date.getDate() === day
        ) {
          return date;
        }
      }
      return null;
    };

    const referenceDate = parseDateFromString(_fechaDelMes);
    if (!referenceDate) {
      console.error('La fecha proporcionada es inválida:', _fechaDelMes);
      return;
    }

    const reportYear = referenceDate.getFullYear();
    const reportMonth = referenceDate.getMonth() + 1;
    const monthName = referenceDate.toLocaleString('es-ES', { month: 'long' });

    const reportTitle = `Control Mensual de Emisores Documentos Digitales - ${
      monthName.charAt(0).toUpperCase() + monthName.slice(1)
    } ${reportYear}`;

    const getWeeksOfMonth = (year: number, month: number) => {
      const weeks = [];
      const firstDayOfMonth = new Date(year, month - 1, 1);
      const lastDayOfMonth = new Date(year, month, 0);
      let currentDay = new Date(firstDayOfMonth);

      while (currentDay <= lastDayOfMonth) {
        const weekStart = new Date(currentDay);
        let weekEnd = new Date(currentDay);
        const dayOfWeek = weekEnd.getDay();
        const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
        weekEnd.setDate(weekEnd.getDate() + daysUntilSunday);
        if (weekEnd > lastDayOfMonth) {
          weekEnd = lastDayOfMonth;
        }

        const headerName = `SEMANA ${weekStart.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
        })} - ${weekEnd.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
        })}`;
        weeks.push({ headerName, start: weekStart, end: weekEnd });

        currentDay = new Date(weekEnd);
        currentDay.setDate(currentDay.getDate() + 1);
      }
      return weeks;
    };

    const allMonthWeeks = getWeeksOfMonth(reportYear, reportMonth);

    // --- PASO 2: Cálculo de Totales (SIN CAMBIOS) ---
    const pivotedDataMap = new Map<string, any>();
    const weeklyTotals: { [key: string]: number } = {};
    let superTotalSum = 0;

    _data.data.forEach((record: any) => {
      const rifKey = record.org_value;
      if (!pivotedDataMap.has(rifKey)) {
        pivotedDataMap.set(rifKey, {
          contribuyente: record.org_name.trim(),
          rif: rifKey,
          serie: 'N/A',
          weeklySummaries: {},
        });
      }
      const pivotedRecord = pivotedDataMap.get(rifKey);
      pivotedRecord.weeklySummaries[record.subperiodo] = {
        desde: record.primer_numero_valido,
        hasta: record.ultimo_numero_valido,
        total: record.documentos_validos,
      };

      const weekKey = record.subperiodo;
      const totalValue = parseInt(record.documentos_validos, 10) || 0;

      if (!weeklyTotals[weekKey]) {
        weeklyTotals[weekKey] = 0;
      }
      weeklyTotals[weekKey] += totalValue;

      superTotalSum += totalValue;
    });

    const finalTableData = Array.from(pivotedDataMap.values());

    // 🚨 DEFINICIÓN DE COLUMNAS
    const NUM_COLUMNAS_FIJAS = 4; // Nro., Emisor, RIF, Serie
    const COLUMNAS_POR_SEMANA = 3; // Desde, Hasta, Total Asignado
    const TOTAL_COLUMNAS =
      NUM_COLUMNAS_FIJAS + allMonthWeeks.length * COLUMNAS_POR_SEMANA;

    // --- PASO 3: Construir la Estructura de la Tabla ---

    // 1. Fila de Encabezados Principales (Header Rows)
    const mainHeadersRow: any[] = [
      // Columnas Fijas (rowSpan: 2)
      {
        text: 'NRO.',
        style: 'tableHeader',
        rowSpan: 2,
        alignment: 'center',
        margin: [0, 8, 0, 0],
      },
      {
        text: 'EMISOR',
        style: 'tableHeader',
        rowSpan: 2,
        alignment: 'center',
        margin: [0, 8, 0, 0],
      },
      {
        text: 'RIF',
        style: 'tableHeader',
        rowSpan: 2,
        alignment: 'center',
        margin: [0, 8, 0, 0],
      },
      {
        text: 'SERIE',
        style: 'tableHeader',
        rowSpan: 2,
        alignment: 'center',
        margin: [0, 8, 0, 0],
      },
    ];
    allMonthWeeks.forEach((week) => {
      // 🚨 CAMBIO CLAVE: colSpan: 3 para abarcar Desde, Hasta y Total
      mainHeadersRow.push({
        text: week.headerName,
        style: 'tableHeader',
        colSpan: COLUMNAS_POR_SEMANA,
        alignment: 'center',
      });
      // Agregar dos celdas vacías cubiertas por el colSpan
      mainHeadersRow.push({});
      mainHeadersRow.push({});
    });

    // 2. Fila de Sub-encabezados (Sub-Header Rows)
    const subHeadersRow: any[] = [
      {}, // NRO.
      {}, // EMISOR
      {}, // RIF
      {}, // SERIE
    ];
    allMonthWeeks.forEach(() => {
      // 🚨 CAMBIO CLAVE: Definir las 3 sub-columnas
      subHeadersRow.push({
        text: 'Desde',
        style: 'tableHeader',
        alignment: 'center',
      });
      subHeadersRow.push({
        text: 'Hasta',
        style: 'tableHeader',
        alignment: 'center',
      });
      subHeadersRow.push({
        text: 'Total',
        style: 'tableHeader',
        alignment: 'center',
      });
    });

    // 3. Filas de Datos (Data Rows)
    const tableRows = finalTableData.map((record, index) => {
      const row = [
        {
          text: (index + 1).toString(),
          style: 'tableBody',
          alignment: 'center',
        },
        { text: record.contribuyente, style: 'tableBody' },
        { text: record.rif, style: 'tableBody' },
        { text: record.serie, style: 'tableBody' },
      ];
      allMonthWeeks.forEach((week) => {
        let weekData = null;
        for (const subperiodoKey in record.weeklySummaries) {
          const weekNumberStr = subperiodoKey.replace('Semana ', '');
          if (!isNaN(parseInt(weekNumberStr, 10))) {
            const weekNumber = parseInt(weekNumberStr, 10);
            const firstDayOfWeek = new Date(
              reportYear,
              0,
              1 + (weekNumber - 1) * 7
            );
            if (firstDayOfWeek >= week.start && firstDayOfWeek <= week.end) {
              weekData = record.weeklySummaries[subperiodoKey];
              break;
            }
          }
        }
        if (weekData) {
          // 🚨 CAMBIO CLAVE: Agregar Desde, Hasta y Total
          row.push({
            text: weekData.desde,
            style: 'tableBody',
            alignment: 'right',
          });
          row.push({
            text: weekData.hasta,
            style: 'tableBody',
            alignment: 'right',
          });
          row.push({
            text: this.formatNumber(weekData.total),
            style: 'tableBody',
            alignment: 'right',
          });
        } else {
          row.push({ text: '-', style: 'tableBody', alignment: 'right' });
          row.push({ text: '-', style: 'tableBody', alignment: 'right' });
          row.push({ text: '-', style: 'tableBody', alignment: 'right' });
        }
      });
      return row;
    });

    // 4. Fila de Totales Semanales (TotalRow)
    const totalRow: any[] = [
      { text: '', style: 'tableTotalLabel', fillColor: '#ecf0f1' }, // NRO.
      {
        text: 'TOTALES',
        style: 'tableTotalLabel',
        colSpan: 3, // Abarca Emisor, RIF, Serie
        alignment: 'right',
      },
      {}, // Celda vacía para colSpan
      {}, // Celda vacía para colSpan
    ];
    allMonthWeeks.forEach((week) => {
      let weekTotal = 0;
      for (const subperiodoKey in weeklyTotals) {
        const weekNumberStr = subperiodoKey.replace('Semana ', '');
        if (!isNaN(parseInt(weekNumberStr, 10))) {
          const weekNumber = parseInt(weekNumberStr, 10);
          const firstDayOfWeek = new Date(
            reportYear,
            0,
            1 + (weekNumber - 1) * 7
          );
          if (firstDayOfWeek >= week.start && firstDayOfWeek <= week.end) {
            weekTotal = weeklyTotals[subperiodoKey];
            break;
          }
        }
      }
      // 🚨 CAMBIO CLAVE: Agregar dos celdas vacías y luego el Total
      totalRow.push({
        text: '',
        style: 'tableTotalValue',
        fillColor: '#ecf0f1',
      }); // Desde (Vacío)
      totalRow.push({
        text: '',
        style: 'tableTotalValue',
        fillColor: '#ecf0f1',
      }); // Hasta (Vacío)
      totalRow.push({
        text: weekTotal > 0 ? this.formatNumber(weekTotal) : '0',
        style: 'tableTotalValue',
        alignment: 'right',
      });
    });

    // 5. Fila del Súper Total
    // El texto "SÚPER TOTAL" debe abarcar TODAS las columnas excepto la última (el último "Total Asignado").
    const colSpanValue = TOTAL_COLUMNAS - 1;

    const superTotalRow: any[] = [];
    const superTotalLabelColSpan = TOTAL_COLUMNAS - 1;

    // 🚨 CAMBIO CLAVE: La etiqueta debe abarcar todas las columnas hasta la última columna de totales.
    superTotalRow.push({
      text: 'GRAN TOTAL',
      style: 'tableTotalLabel',
      colSpan: superTotalLabelColSpan,
      alignment: 'right',
      fillColor: '#d6eaf8',
    });

    // Rellenamos con celdas vacías (con fillColor) para el colSpan.
    // Esto asegura que la fila tenga la longitud correcta.
    for (let i = 0; i < superTotalLabelColSpan - 1; i++) {
      superTotalRow.push({ text: '', fillColor: '#d6eaf8' });
    }

    // La última celda contiene el valor del Súper Total
    superTotalRow.push({
      text: this.formatNumber(superTotalSum),
      style: 'tableTotalValue',
      alignment: 'right',
      fontSize: 12,
      fillColor: '#d6eaf8',
    });

    // 6. Ensamblar el Cuerpo de la Tabla
    const tableBody = [
      mainHeadersRow,
      subHeadersRow,
      ...tableRows,
      totalRow,
      superTotalRow,
    ];

    // --- PASO 7: Ensamblar el PDF Final ---
    const logoBase64 = await this.getBase64Image('assets/img/logo7.png');

    // 🚨 CAMBIO CLAVE: Ajustar los widths
    // Fijas: Nro (auto), Emisor (*), RIF (auto), Serie (auto)
    const fixedWidths = ['auto', '*', '*', 'auto'];
    // Semanales: Tres 'auto' por cada semana (Desde, Hasta, Total)
    const weeklyWidths = allMonthWeeks.flatMap(() => ['auto', 'auto', 'auto']);

    const docDefinition = {
      pageOrientation: 'landscape',
      pageSize: 'A2',
      content: [
        this.generatePDFHeader(reportTitle, logoBase64),
        {
          table: {
            headerRows: 2,
            widths: [...fixedWidths, ...weeklyWidths],
            body: tableBody,
          },
        },
      ],
      styles: {
        header: { fontSize: 15, bold: true, margin: [0, 0, 0, 10] },
        tableHeader: {
          bold: true,
          fillColor: '#34495e',
          color: '#ffffff',
          fontSize: 10,
          alignment: 'center',
        },
        // Aseguramos que los números en el cuerpo de la tabla se alineen a la derecha
        tableBody: { fontSize: 9, alignment: 'left', margin: [0, 2, 0, 2] },
        tableTotalLabel: {
          bold: true,
          fontSize: 10,
          fillColor: '#ecf0f1',
        },
        tableTotalValue: {
          bold: true,
          fontSize: 9,
          fillColor: '#ecf0f1',
        },
      },
    };

    this.generatePDF(docDefinition, 'Reporte Semanal');
  }

  async generateProvidenciaReportBasicSemanal(
    _data: any,
    _fechaDelMes: string
  ) {
    if (!_data || !_data.data) {
      console.error(
        "Los datos recibidos no tienen la estructura esperada o el array 'data' está vacío."
      );
      return;
    }

    // --- PASO 1: Lógica de Fechas y Semanas (SIN CAMBIOS) ---
    const parseDateFromString = (dateString: string): Date | null => {
      const parts = dateString?.split('/');
      if (parts && parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        const date = new Date(year, month, day);
        if (
          date.getFullYear() === year &&
          date.getMonth() === month &&
          date.getDate() === day
        ) {
          return date;
        }
      }
      return null;
    };

    const referenceDate = parseDateFromString(_fechaDelMes);
    if (!referenceDate) {
      console.error('La fecha proporcionada es inválida:', _fechaDelMes);
      return;
    }

    const reportYear = referenceDate.getFullYear();
    const reportMonth = referenceDate.getMonth() + 1;
    const monthName = referenceDate.toLocaleString('es-ES', { month: 'long' });

    const reportTitle = `Control Semanal de Emisores Documentos Digitales - ${
      monthName.charAt(0).toUpperCase() + monthName.slice(1)
    } ${reportYear}`;

    const getWeeksOfMonth = (year: number, month: number) => {
      const weeks = [];
      const firstDayOfMonth = new Date(year, month - 1, 1);
      const lastDayOfMonth = new Date(year, month, 0);
      let currentDay = new Date(firstDayOfMonth);

      while (currentDay <= lastDayOfMonth) {
        const weekStart = new Date(currentDay);
        let weekEnd = new Date(currentDay);
        const dayOfWeek = weekEnd.getDay();
        const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
        weekEnd.setDate(weekEnd.getDate() + daysUntilSunday);
        if (weekEnd > lastDayOfMonth) {
          weekEnd = lastDayOfMonth;
        }

        const headerName = `SEMANA ${weekStart.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
        })} - ${weekEnd.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
        })}`;
        weeks.push({ headerName, start: weekStart, end: weekEnd });

        currentDay = new Date(weekEnd);
        currentDay.setDate(currentDay.getDate() + 1);
      }
      return weeks;
    };

    const allMonthWeeks = getWeeksOfMonth(reportYear, reportMonth);

    // --- PASO 2: Cálculo de Totales (SIN CAMBIOS) ---
    const pivotedDataMap = new Map<string, any>();
    const weeklyTotals: { [key: string]: number } = {};
    let superTotalSum = 0;

    _data.data.forEach((record: any) => {
      const rifKey = record.org_value;
      if (!pivotedDataMap.has(rifKey)) {
        pivotedDataMap.set(rifKey, {
          contribuyente: record.org_name.trim(),
          rif: rifKey,
          serie: 'N/A',
          weeklySummaries: {},
        });
      }
      const pivotedRecord = pivotedDataMap.get(rifKey);
      pivotedRecord.weeklySummaries[record.subperiodo] = {
        desde: record.primer_numero_valido,
        hasta: record.ultimo_numero_valido,
        total: record.documentos_validos,
      };

      const weekKey = record.subperiodo;
      const totalValue = parseInt(record.documentos_validos, 10) || 0;

      if (!weeklyTotals[weekKey]) {
        weeklyTotals[weekKey] = 0;
      }
      weeklyTotals[weekKey] += totalValue;

      superTotalSum += totalValue;
    });

    const finalTableData = Array.from(pivotedDataMap.values());

    // 🚨 DEFINICIÓN DE COLUMNAS
    const NUM_COLUMNAS_FIJAS = 4; // Nro., Emisor, RIF, Serie
    const COLUMNAS_POR_SEMANA = 3; // Desde, Hasta, Total Asignado
    const TOTAL_COLUMNAS =
      NUM_COLUMNAS_FIJAS + allMonthWeeks.length * COLUMNAS_POR_SEMANA;

    // --- PASO 3: Construir la Estructura de la Tabla ---

    // 1. Fila de Encabezados Principales (Header Rows)
    const mainHeadersRow: any[] = [
      // Columnas Fijas (rowSpan: 2)
      {
        text: 'NRO.',
        style: 'tableHeader',
        rowSpan: 2,
        alignment: 'center',
        margin: [0, 8, 0, 0],
      },
      {
        text: 'EMISOR',
        style: 'tableHeader',
        rowSpan: 2,
        alignment: 'center',
        margin: [0, 8, 0, 0],
      },
      {
        text: 'RIF',
        style: 'tableHeader',
        rowSpan: 2,
        alignment: 'center',
        margin: [0, 8, 0, 0],
      },
      {
        text: 'SERIE',
        style: 'tableHeader',
        rowSpan: 2,
        alignment: 'center',
        margin: [0, 8, 0, 0],
      },
    ];
    allMonthWeeks.forEach((week) => {
      // 🚨 CAMBIO CLAVE: colSpan: 3 para abarcar Desde, Hasta y Total
      mainHeadersRow.push({
        text: week.headerName,
        style: 'tableHeader',
        colSpan: COLUMNAS_POR_SEMANA,
        alignment: 'center',
      });
      // Agregar dos celdas vacías cubiertas por el colSpan
      mainHeadersRow.push({});
      mainHeadersRow.push({});
    });

    // 2. Fila de Sub-encabezados (Sub-Header Rows)
    const subHeadersRow: any[] = [
      {}, // NRO.
      {}, // EMISOR
      {}, // RIF
      {}, // SERIE
    ];
    allMonthWeeks.forEach(() => {
      // 🚨 CAMBIO CLAVE: Definir las 3 sub-columnas
      subHeadersRow.push({
        text: 'Desde',
        style: 'tableHeader',
        alignment: 'center',
      });
      subHeadersRow.push({
        text: 'Hasta',
        style: 'tableHeader',
        alignment: 'center',
      });
      subHeadersRow.push({
        text: 'Total Asignado',
        style: 'tableHeader',
        alignment: 'center',
      });
    });

    // 3. Filas de Datos (Data Rows)
    const tableRows = finalTableData.map((record, index) => {
      const row = [
        {
          text: (index + 1).toString(),
          style: 'tableBody',
          alignment: 'center',
        },
        { text: record.contribuyente, style: 'tableBody' },
        { text: record.rif, style: 'tableBody' },
        { text: record.serie, style: 'tableBody' },
      ];
      allMonthWeeks.forEach((week) => {
        let weekData = null;
        for (const subperiodoKey in record.weeklySummaries) {
          const weekNumberStr = subperiodoKey.replace('Semana ', '');
          if (!isNaN(parseInt(weekNumberStr, 10))) {
            const weekNumber = parseInt(weekNumberStr, 10);
            const firstDayOfWeek = new Date(
              reportYear,
              0,
              1 + (weekNumber - 1) * 7
            );
            if (firstDayOfWeek >= week.start && firstDayOfWeek <= week.end) {
              weekData = record.weeklySummaries[subperiodoKey];
              break;
            }
          }
        }
        if (weekData) {
          // 🚨 CAMBIO CLAVE: Agregar Desde, Hasta y Total
          row.push({
            text: weekData.desde,
            style: 'tableBody',
            alignment: 'right',
          });
          row.push({
            text: weekData.hasta,
            style: 'tableBody',
            alignment: 'right',
          });
          row.push({
            text: this.formatNumber(weekData.total),
            style: 'tableBody',
            alignment: 'right',
          });
        } else {
          row.push({ text: '-', style: 'tableBody', alignment: 'right' });
          row.push({ text: '-', style: 'tableBody', alignment: 'right' });
          row.push({ text: '-', style: 'tableBody', alignment: 'right' });
        }
      });
      return row;
    });

    // 4. Fila de Totales Semanales (TotalRow)
    const totalRow: any[] = [
      { text: '', style: 'tableTotalLabel', fillColor: '#ecf0f1' }, // NRO.
      {
        text: 'TOTALES',
        style: 'tableTotalLabel',
        colSpan: 3, // Abarca Emisor, RIF, Serie
        alignment: 'right',
      },
      {}, // Celda vacía para colSpan
      {}, // Celda vacía para colSpan
    ];
    allMonthWeeks.forEach((week) => {
      let weekTotal = 0;
      for (const subperiodoKey in weeklyTotals) {
        const weekNumberStr = subperiodoKey.replace('Semana ', '');
        if (!isNaN(parseInt(weekNumberStr, 10))) {
          const weekNumber = parseInt(weekNumberStr, 10);
          const firstDayOfWeek = new Date(
            reportYear,
            0,
            1 + (weekNumber - 1) * 7
          );
          if (firstDayOfWeek >= week.start && firstDayOfWeek <= week.end) {
            weekTotal = weeklyTotals[subperiodoKey];
            break;
          }
        }
      }
      // 🚨 CAMBIO CLAVE: Agregar dos celdas vacías y luego el Total
      totalRow.push({
        text: '',
        style: 'tableTotalValue',
        fillColor: '#ecf0f1',
      }); // Desde (Vacío)
      totalRow.push({
        text: '',
        style: 'tableTotalValue',
        fillColor: '#ecf0f1',
      }); // Hasta (Vacío)
      totalRow.push({
        text: weekTotal > 0 ? this.formatNumber(weekTotal) : '0',
        style: 'tableTotalValue',
        alignment: 'right',
      });
    });

    // 5. Fila del Súper Total
    // El texto "SÚPER TOTAL" debe abarcar TODAS las columnas excepto la última (el último "Total Asignado").
    const colSpanValue = TOTAL_COLUMNAS - 1;

    const superTotalRow: any[] = [];
    const superTotalLabelColSpan = TOTAL_COLUMNAS - 1;

    // 🚨 CAMBIO CLAVE: La etiqueta debe abarcar todas las columnas hasta la última columna de totales.
    superTotalRow.push({
      text: 'GRAN TOTAL',
      style: 'tableTotalLabel',
      colSpan: superTotalLabelColSpan,
      alignment: 'right',
      fillColor: '#d6eaf8',
    });

    // Rellenamos con celdas vacías (con fillColor) para el colSpan.
    // Esto asegura que la fila tenga la longitud correcta.
    for (let i = 0; i < superTotalLabelColSpan - 1; i++) {
      superTotalRow.push({ text: '', fillColor: '#d6eaf8' });
    }

    // La última celda contiene el valor del Súper Total
    superTotalRow.push({
      text: this.formatNumber(superTotalSum),
      style: 'tableTotalValue',
      alignment: 'right',
      fontSize: 12,
      fillColor: '#d6eaf8',
    });

    // 6. Ensamblar el Cuerpo de la Tabla
    const tableBody = [
      mainHeadersRow,
      subHeadersRow,
      ...tableRows,
      totalRow,
      superTotalRow,
    ];

    // --- PASO 7: Ensamblar el PDF Final ---
    const logoBase64 = await this.getBase64Image('assets/img/logo7.png');

    // 🚨 CAMBIO CLAVE: Ajustar los widths
    // Fijas: Nro (auto), Emisor (*), RIF (auto), Serie (auto)
    const fixedWidths = ['auto', '*', '*', 'auto'];
    // Semanales: Tres 'auto' por cada semana (Desde, Hasta, Total)
    const weeklyWidths = allMonthWeeks.flatMap(() => ['auto', 'auto', 'auto']);

    const docDefinition = {
      pageOrientation: 'landscape',
      pageSize: 'A2',
      content: [
        this.generatePDFHeader(reportTitle, logoBase64),
        {
          table: {
            headerRows: 2,
            widths: [...fixedWidths, ...weeklyWidths],
            body: tableBody,
          },
        },
      ],
      styles: {
        header: { fontSize: 15, bold: true, margin: [0, 0, 0, 10] },
        tableHeader: {
          bold: true,
          fillColor: '#34495e',
          color: '#ffffff',
          fontSize: 10,
          alignment: 'center',
        },
        // Aseguramos que los números en el cuerpo de la tabla se alineen a la derecha
        tableBody: { fontSize: 9, alignment: 'left', margin: [0, 2, 0, 2] },
        tableTotalLabel: {
          bold: true,
          fontSize: 10,
          fillColor: '#ecf0f1',
        },
        tableTotalValue: {
          bold: true,
          fontSize: 9,
          fillColor: '#ecf0f1',
        },
      },
    };

    this.generatePDF(docDefinition, 'Reporte Semanal');
  }

  async generateProvidenciaReportBasicMensualExcel(
    _data: any,
    _fechaDelMes: string
  ) {
    // --- PASO 1: Calcular el Mes y las Semanas (SIN CAMBIOS) ---
    const parseDateFromString = (dateString: string): Date | null => {
      const parts = dateString?.split('/');
      if (parts && parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        const date = new Date(year, month, day);
        if (
          date.getFullYear() === year &&
          date.getMonth() === month &&
          date.getDate() === day
        ) {
          return date;
        }
      }
      return null;
    };

    const referenceDate = parseDateFromString(_fechaDelMes);
    if (!referenceDate) {
      console.error('La fecha proporcionada es inválida:', _fechaDelMes);
      return;
    }

    const reportYear = referenceDate.getFullYear();
    const reportMonth = referenceDate.getMonth() + 1;
    const monthName = referenceDate.toLocaleString('es-ES', { month: 'long' });
    const reportTitle = `Reporte Oficial Providencia 000102 Art 32 - ${
      monthName.charAt(0).toUpperCase() + monthName.slice(1)
    } ${reportYear}`;

    const getWeeksOfMonth = (year: number, month: number) => {
      const weeks = [];
      const firstDayOfMonth = new Date(year, month - 1, 1);
      const lastDayOfMonth = new Date(year, month, 0);
      let currentDay = new Date(firstDayOfMonth);
      while (currentDay <= lastDayOfMonth) {
        const weekStart = new Date(currentDay);
        let weekEnd = new Date(currentDay);
        const dayOfWeek = weekEnd.getDay();
        const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
        weekEnd.setDate(weekEnd.getDate() + daysUntilSunday);
        if (weekEnd > lastDayOfMonth) {
          weekEnd = lastDayOfMonth;
        }
        const headerName = `SEMANA ${weekStart.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
        })} - ${weekEnd.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
        })}`;
        weeks.push({ headerName, start: weekStart, end: weekEnd });
        currentDay = new Date(weekEnd);
        currentDay.setDate(currentDay.getDate() + 1);
      }
      return weeks;
    };
    const allMonthWeeks = getWeeksOfMonth(reportYear, reportMonth);

    // --- PASO 2: Pivotar los Datos Y CALCULAR TOTALES (SIN CAMBIOS) ---
    const pivotedDataMap = new Map<string, any>();
    const weeklyTotals: { [key: string]: number } = {};

    _data.data.forEach((record: any) => {
      const rifKey = record.org_value;
      if (!pivotedDataMap.has(rifKey)) {
        pivotedDataMap.set(rifKey, {
          contribuyente: record.org_name.trim(),
          rif: rifKey,
          serie: 'N/A',
          weeklySummaries: {},
        });
      }
      const pivotedRecord = pivotedDataMap.get(rifKey);
      pivotedRecord.weeklySummaries[record.subperiodo] = {
        desde: record.primer_numero_valido,
        hasta: record.ultimo_numero_valido,
        total: record.documentos_validos,
      };
      const weekKey = record.subperiodo;
      const totalValue = parseInt(record.documentos_validos, 10) || 0;
      if (!weeklyTotals[weekKey]) {
        weeklyTotals[weekKey] = 0;
      }
      weeklyTotals[weekKey] += totalValue;
    });
    const finalTableData = Array.from(pivotedDataMap.values());

    // --- PASO 3: Construir la Hoja de Cálculo como un "Array de Arrays" (SIN CAMBIOS) ---
    const currentDateTime = formatDate(new Date(), 'dd/MM/yyyy  hh:mm aa');
    const organizacionData =
      _data.data.length > 0
        ? { name: _data.data[0].org_name.trim(), rif: _data.data[0].org_value }
        : { name: 'N/A', rif: 'N/A' };

    const reportHeaderRows = [
      [],
      ['ABC DIGITAL PRINTING', '', '', 'Fecha:', currentDateTime],
      ['J-50604016-6'],
      [],
      [reportTitle],
      [],
    ];

    const mainHeadersRow: (string | null)[] = ['CONTRIBUYENTE', 'RIF', 'SERIE'];
    allMonthWeeks.forEach((week) => {
      mainHeadersRow.push(week.headerName);
      mainHeadersRow.push(null);
      mainHeadersRow.push(null);
    });

    const subHeadersRow: (string | null)[] = [null, null, null];
    allMonthWeeks.forEach(() => {
      subHeadersRow.push('Desde');
      subHeadersRow.push('Hasta');
      subHeadersRow.push('Total Asignado');
    });

    const dataRows = finalTableData.map((record) => {
      const row = [record.contribuyente, record.rif, record.serie];
      allMonthWeeks.forEach((week) => {
        let weekData = null;
        for (const subperiodoKey in record.weeklySummaries) {
          const weekNumberStr = subperiodoKey.replace('Semana ', '');
          if (!isNaN(parseInt(weekNumberStr, 10))) {
            const weekNumber = parseInt(weekNumberStr, 10);
            const firstDayOfWeek = new Date(
              reportYear,
              0,
              1 + (weekNumber - 1) * 7
            );
            if (firstDayOfWeek >= week.start && firstDayOfWeek <= week.end) {
              weekData = record.weeklySummaries[subperiodoKey];
              break;
            }
          }
        }
        if (weekData) {
          row.push(weekData.desde, weekData.hasta, weekData.total);
        } else {
          row.push('-', '-', '-');
        }
      });
      return row;
    });

    // --- CORRECCIÓN EN LA FILA DE TOTALES ---
    const totalRow: (string | number | null)[] = ['TOTALES', null, null];
    allMonthWeeks.forEach((week) => {
      let weekTotal = 0;
      // La lógica para encontrar el total de la semana es la misma que usas para los datos
      for (const subperiodoKey in weeklyTotals) {
        const weekNumberStr = subperiodoKey.replace('Semana ', '');
        if (!isNaN(parseInt(weekNumberStr, 10))) {
          const weekNumber = parseInt(weekNumberStr, 10);
          const firstDayOfWeek = new Date(
            reportYear,
            0,
            1 + (weekNumber - 1) * 7
          );
          if (firstDayOfWeek >= week.start && firstDayOfWeek <= week.end) {
            weekTotal = weeklyTotals[subperiodoKey];
            break; // Una vez que encontramos la semana, salimos del bucle
          }
        }
      }
      totalRow.push(null, null, weekTotal > 0 ? weekTotal : 0);
    });

    const finalSheetData = [
      ...reportHeaderRows,
      mainHeadersRow,
      subHeadersRow,
      ...dataRows,
      totalRow,
    ];

    // --- PASO 4: Crear la Hoja, Aplicar Formatos y Descargar (SIN CAMBIOS) ---
    const worksheet = XLSX.utils.aoa_to_sheet(finalSheetData);

    // Ajustamos los merges para que empiecen después del encabezado
    const tableStartRow = reportHeaderRows.length; // La tabla empieza en esta fila
    const merges = [
      { s: { r: tableStartRow, c: 0 }, e: { r: tableStartRow + 1, c: 0 } }, // Contribuyente
      { s: { r: tableStartRow, c: 1 }, e: { r: tableStartRow + 1, c: 1 } }, // RIF
      { s: { r: tableStartRow, c: 2 }, e: { r: tableStartRow + 1, c: 2 } }, // Serie
    ];
    allMonthWeeks.forEach((week, index) => {
      const startCol = 3 + index * 3;
      merges.push({
        s: { r: tableStartRow, c: startCol },
        e: { r: tableStartRow, c: startCol + 2 },
      });
    });
    const totalRowIndex = finalSheetData.length - 1;
    merges.push({
      s: { r: totalRowIndex, c: 0 },
      e: { r: totalRowIndex, c: 2 },
    });
    worksheet['!merges'] = merges;

    worksheet['!cols'] = [
      { wch: 40 },
      { wch: 15 },
      { wch: 10 },
      ...allMonthWeeks.flatMap(() => [{ wch: 18 }, { wch: 18 }, { wch: 15 }]),
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte Semanal');
    XLSX.writeFile(
      workbook,
      `ReporteSemanal - ${monthName} ${reportYear}.xlsx`
    );
  }
  async generateProvidenciaReportBasicDiario(_data: any) {
    // Es buena práctica verificar si los datos existen antes de continuar
    if (!_data || !_data.data) {
      // Asegúrate de que el path a tus datos sea correcto, según tu último error era '_data.data'
      console.error(
        "Los datos recibidos no tienen la estructura esperada o el array 'data' está vacío."
      );
      return;
    }

    const logoBase64 = await this.getBase64Image('assets/img/logo7.png');

    const providenciaColumns: Array<{
      header: string;
      key: string;
      width?: string | number;
    }> = [
      { header: 'Contribuyente', key: 'org_name', width: '*' },
      { header: 'RIF Contribuyente', key: 'org_value', width: 'auto' },
      { header: 'Serie', key: '', width: 'auto' }, // Mantenido en blanco/vacío si no existe en la data
      { header: 'Nro. Control Inicial', key: 'primer_numero', width: 'auto' },
      { header: 'Nro. Control Final', key: 'ultimo_numero', width: 'auto' },
      { header: 'Cantidad', key: 'total_documentos', width: 'auto' },
      { header: 'Nro. Factura de Vmta', key: '', width: '*' }, // Mantenido en blanco/vacío si no existe en la data
    ];

    // Apuntamos directamente al array que contiene los datos del reporte.
    const tableData = _data.data;

    // --- INICIO DE LA LÓGICA DE TOTALES ---

    // 1. Calcular el total de documentos
    let totalDocumentosSum = 0;
    if (tableData && Array.isArray(tableData)) {
      totalDocumentosSum = tableData.reduce(
        (sum, row) => sum + (parseInt(row.total_documentos, 10) || 0),
        0
      );
    }

    // 2. Crear la fila de totales
    const totalRowCells: any[] = Array(providenciaColumns.length).fill(null); // Inicializar con nulls

    // Celda "TOTALES" en la primera columna
    totalRowCells[0] = {
      text: 'TOTALES',
      style: 'tableTotalLabel',
      alignment: 'left',
    };

    // Encontrar el índice de la columna 'Cantidad' para colocar el total
    const cantidadColumnIndex = providenciaColumns.findIndex(
      (col) => col.key === 'total_documentos'
    );
    if (cantidadColumnIndex !== -1) {
      totalRowCells[cantidadColumnIndex] = {
        text: this.formatNumber(totalDocumentosSum), // Usamos tu función formatNumber
        style: 'tableTotalValue', // Nuevo estilo para el valor total
        alignment: 'right', // Alinear a la derecha para números
      };
    }

    // Rellenar las celdas restantes con objetos vacíos que cumplan el tipado
    for (let i = 0; i < providenciaColumns.length; i++) {
      if (totalRowCells[i] === null) {
        totalRowCells[i] = {
          text: '',
          style: 'tableTotalValue',
          alignment: 'left',
        };
      }
    }

    // --- FIN DE LA LÓGICA DE TOTALES ---

    // Generamos la tabla con los datos existentes (sin la fila de totales aún)
    const reportTable = this.generateDynamicSimpleTable(
      providenciaColumns,
      tableData
    );

    // --- AÑADIR LA FILA DE TOTALES AL FINAL DE LA TABLA GENERADA ---
    // Verificamos que la estructura exista antes de modificarla
    if (
      reportTable &&
      reportTable.table &&
      Array.isArray(reportTable.table.body)
    ) {
      reportTable.table.body.push(totalRowCells);
    } else {
      console.warn(
        'No se pudo añadir la fila de totales: la estructura de la tabla no es la esperada.'
      );
    }

    // Usamos los datos del primer registro para el encabezado.
    const organizacionData =
      tableData.length > 0
        ? {
            razon_social: tableData[0].org_name,
            numero_identificacion: tableData[0].org_value,
          }
        : { razon_social: 'N/A', numero_identificacion: 'N/A' };

    const docDefinition = {
      pageOrientation: 'landscape',
      content: [
        this.generatePDFHeader(
          'Reporte Mensual Providencia 000102 Art. 32',
          logoBase64
        ),
        reportTable,
      ],
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
        tableHeader: {
          bold: true,
          fillColor: '#34495e',
          color: '#ffffff',
          alignment: 'center',
        },
        tableBody: { fontSize: 9 },
        // --- NUEVOS ESTILOS PARA LA FILA DE TOTALES ---
        tableTotalLabel: {
          bold: true,
          fontSize: 10,
          alignment: 'left',
          fillColor: '#ecf0f1', // Un fondo suave para la fila de totales
        },
        tableTotalValue: {
          bold: true,
          fontSize: 10,
          alignment: 'right',
          fillColor: '#ecf0f1',
        },
      },
    };

    this.generatePDF(
      docDefinition,
      'Reporte Mensual Providencia 000102 Art. 28'
    );
  }
  async generateProvidenciaReportTotal(_data: any) {
    // Es buena práctica verificar si los datos existen antes de continuar
    if (!_data || !_data.data) {
      // Asegúrate de que el path a tus datos sea correcto, según tu último error era '_data.data'
      console.error(
        "Los datos recibidos no tienen la estructura esperada o el array 'data' está vacío."
      );
      return;
    }

    const logoBase64 = await this.getBase64Image('assets/img/logo7.png');
    // rif de contribuyentes en el medio
    // tipo de rif
    const providenciaColumns: Array<{
      header: string;
      key: string;
      width?: string | number;
      alignment?: 'left' | 'right' | 'center' | 'justify';
    }> = [
      { header: 'Nro.', key: 'periodo_superior', width: 'auto' },
      { header: 'Emisor', key: 'org_name', width: '*' },
      { header: 'RIF', key: 'org_value', width: 'auto' },
      {
        header: 'Total de documentos emitidos y control asignados',
        key: 'total_documentos',
        width: 150,
        alignment: 'right',
      },
      // { header: 'Total', key: 'total_documentos', width: 'auto' },
    ];

    // Apuntamos directamente al array que contiene los datos del reporte.
    const tableData = _data.data;

    // --- INICIO DE LA LÓGICA DE TOTALES ---

    // 1. Calcular el total de documentos
    let totalDocumentosSum = 0;
    if (tableData && Array.isArray(tableData)) {
      totalDocumentosSum = tableData.reduce(
        (sum, row) => sum + (parseInt(row.total_documentos, 10) || 0),
        0
      );
    }

    // 2. Crear la fila de totales
    const totalRowCells: any[] = Array(providenciaColumns.length).fill(null); // Inicializar con nulls

    // Celda "TOTALES" en la primera columna
    totalRowCells[0] = {
      text: _data.data.length,
      style: 'tableTotalLabel',
      alignment: 'left',
    };
    totalRowCells[1] = {
      text: 'TOTALES',
      style: 'tableTotalLabel',
      alignment: 'left',
    };

    // Encontrar el índice de la columna 'Cantidad' para colocar el total
    const cantidadColumnIndex = providenciaColumns.findIndex(
      (col) => col.key === 'total_documentos'
    );
    if (cantidadColumnIndex !== -1) {
      totalRowCells[cantidadColumnIndex] = {
        text: this.formatNumber(totalDocumentosSum), // Usamos tu función formatNumber
        style: 'tableTotalValue', // Nuevo estilo para el valor total
        alignment: 'right', // Alinear a la derecha para números
      };
    }

    // Rellenar las celdas restantes con objetos vacíos que cumplan el tipado
    for (let i = 0; i < providenciaColumns.length; i++) {
      if (totalRowCells[i] === null) {
        totalRowCells[i] = {
          text: '',
          style: 'tableTotalValue',
          alignment: 'left',
        };
      }
    }

    // --- FIN DE LA LÓGICA DE TOTALES ---

    // Generamos la tabla con los datos existentes (sin la fila de totales aún)
    const reportTable = this.generateDynamicSimpleTable(
      providenciaColumns,
      tableData
    );

    // --- AÑADIR LA FILA DE TOTALES AL FINAL DE LA TABLA GENERADA ---
    // Verificamos que la estructura exista antes de modificarla
    if (
      reportTable &&
      reportTable.table &&
      Array.isArray(reportTable.table.body)
    ) {
      reportTable.table.body.push(totalRowCells);
    } else {
      console.warn(
        'No se pudo añadir la fila de totales: la estructura de la tabla no es la esperada.'
      );
    }

    // Usamos los datos del primer registro para el encabezado.
    const organizacionData =
      tableData.length > 0
        ? {
            razon_social: tableData[0].org_name,
            numero_identificacion: tableData[0].org_value,
          }
        : { razon_social: 'N/A', numero_identificacion: 'N/A' };

    const docDefinition = {
      pageOrientation: 'landscape',
      content: [
        this.generatePDFHeader('Total de Emisores en Producción', logoBase64),
        reportTable,
      ],
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
        tableHeader: {
          bold: true,
          fillColor: '#34495e',
          color: '#ffffff',
          alignment: 'center',
        },
        tableBody: { fontSize: 9 },
        // --- NUEVOS ESTILOS PARA LA FILA DE TOTALES ---
        tableTotalLabel: {
          bold: true,
          fontSize: 10,
          alignment: 'left',
          fillColor: '#ecf0f1', // Un fondo suave para la fila de totales
        },
        tableTotalValue: {
          bold: true,
          fontSize: 10,
          alignment: 'right',
          fillColor: '#ecf0f1',
        },
      },
    };

    this.generatePDF(docDefinition, 'Control de Emisores en Producción');
  }
  // ? REPORTE NUMERO DE CONTROL VENDIDOS
  async generateNmrControlVendidosPDF(_data: any) {
    if (!Array.isArray(_data)) {
      console.error(
        'Los datos recibidos no son un array. No se puede generar el reporte.',
        _data
      );
      return;
    }

    const tableData = _data.map((record: any) => {
      const razonSocial = record.org_id_src?.social_name || 'N/A';
      const rif = `${record.org_id_src?.tipo_identificacion || ''}-${
        record.org_id_src?.value || ''
      }`;

      return {
        razonSocial: razonSocial.trim(),
        rif: rif,
        serie: record.serie,
        cantidad: record.quantity,
        nroControlInicio: record.startno,
        nroControlFinal: record.endno,
      };
    });
    const reportColumns: Array<{
      header: string;
      key: string;
      width?: string | number;
    }> = [
      { header: 'EMISOR', key: 'razonSocial', width: '*' },
      { header: 'RIF', key: 'rif', width: 'auto' },
      { header: 'SERIE', key: 'serie', width: 'auto' },
      { header: 'CANTIDAD', key: 'cantidad', width: 'auto' },
      { header: 'Nro Control Inicial', key: 'nroControlInicio', width: 'auto' },
      { header: 'Nro Control Final', key: 'nroControlFinal', width: 'auto' },
      { header: 'Factura de Venta', key: 'nro_control', width: 'auto' },
      { header: 'Factura de Emision', key: '', width: 'auto' },
    ];

    const reportTable = this.generateDynamicSimpleTable(
      reportColumns,
      tableData
    );

    const logoBase64 = await this.getBase64Image('assets/img/logo7.png');
    const reportTitle = 'Reporte Oficial Numeros Vendidos Providencia 0032';

    const docDefinition = {
      pageOrientation: 'landscape',
      content: [this.generatePDFHeader(reportTitle, logoBase64), reportTable],
      styles: {
        header: { fontSize: 13, bold: true, margin: [0, 0, 0, 10] },
        tableHeader: {
          bold: true,
          fillColor: '#34495e',
          color: '#ffffff',
          alignment: 'center',
        },
        tableBody: { fontSize: 9, alignment: 'left' },
      },
    };

    this.generatePDF(docDefinition, 'ReporteAsignacionControl.pdf');
  }
  // ! reporte oficial de numeros asignados providencia 0032
  async generateProvidenciaMensual(_data: any) {
    if (!_data || !_data.data) {
      console.error(
        "Los datos recibidos no tienen la estructura esperada o el array 'data' está vacío."
      );
      return;
    }

    const logoBase64 = await this.getBase64Image('assets/img/logo7.png');

    // 1. 🚨 CAMBIO CLAVE: Insertar la columna 'Nro.' al inicio
    const providenciaColumns: Array<{
      header: string;
      key: string;
      width?: string | number;
      alignment?: 'left' | 'right' | 'center' | 'justify';
    }> = [
      { header: 'Nro.', key: 'index', width: 40, alignment: 'center' }, // Nueva Columna
      { header: 'Emisor', key: 'org_name', width: '*' },
      { header: 'RIF', key: 'org_value', width: 'auto' },
      { header: 'SERIE', key: '', width: 'auto' },
      { header: 'Nro. Control Desde', key: 'primer_numero', width: 'auto' },
      { header: 'Nro. Control Hasta', key: 'ultimo_numero', width: 'auto' },
      {
        header: 'Cantidad',
        key: 'total_documentos',
        width: 100, // Ajustado ligeramente para mejor visualización
        alignment: 'right',
      },
      { header: 'Factura de venta', key: '', width: 'auto' },
      { header: 'Fecha de Emisión', key: '', width: 'auto' },
    ];

    const tableData = _data.data;
    const NUM_COLUMNS = providenciaColumns.length;

    // --- LÓGICA DE DATOS Y FILAS ---

    // 1. Crear la Fila de Encabezados (Header Row)
    const headerRow = providenciaColumns.map((col) => ({
      text: col.header,
      style: 'tableHeader',
      alignment: col.alignment || 'center',
      width: col.width,
    }));

    // 2. Crear las Filas de Datos (Data Rows)
    const tableBodyRows = tableData.map((rowData: any, index: number) => {
      const row: any[] = [];

      providenciaColumns.forEach((col, colIndex) => {
        let cellContent;

        if (col.key === 'index') {
          // 🚨 Insertar el contador de fila (index + 1)
          cellContent = (index + 1).toString();
        } else if (col.key === 'total_documentos') {
          // Formatear y alinear el número de cantidad
          cellContent = this.formatNumber(rowData[col.key]);
        } else if (col.key === '') {
          // Manejar claves vacías (SERIE, Factura de venta, Fecha de Emisión)
          cellContent = '-';
        } else {
          cellContent = rowData[col.key];
        }

        row.push({
          text: cellContent,
          style: 'tableBody',
          alignment: col.alignment || 'left',
        });
      });
      return row;
    });

    // --- LÓGICA DE TOTALES ---

    // 1. Calcular el total de documentos
    let totalDocumentosSum = 0;
    if (tableData && Array.isArray(tableData)) {
      totalDocumentosSum = tableData.reduce(
        (sum, row) => sum + (parseInt(row.total_documentos, 10) || 0),
        0
      );
    }

    // 2. Crear la fila de totales (usando colSpan para centrar "TOTALES")

    // Índice de la columna 'Cantidad'
    const cantidadColumnIndex = providenciaColumns.findIndex(
      (col) => col.key === 'total_documentos'
    );

    // colSpan para la etiqueta "TOTALES"
    // Debe abarcar todas las columnas hasta la columna anterior a 'Cantidad'
    const totalLabelColSpan = cantidadColumnIndex;

    const totalRowCells: any[] = [];

    // Celda de la etiqueta "TOTALES" con colSpan
    totalRowCells.push({
      text: `TOTALES`, // Texto TOTALES
      style: 'tableTotalLabel',
      colSpan: totalLabelColSpan,
      alignment: 'right', // Se alinea a la derecha para que se pegue al valor
    });

    // Rellenamos con celdas vacías (con fillColor) para el colSpan.
    // totalLabelColSpan - 1 es el número de celdas "ocultas" por el colSpan.
    for (let i = 0; i < totalLabelColSpan - 1; i++) {
      totalRowCells.push({ text: '', fillColor: '#ecf0f1' });
    }

    // Insertar el valor del total en la columna 'Cantidad'
    totalRowCells.push({
      text: this.formatNumber(totalDocumentosSum),
      style: 'tableTotalValue',
      alignment: 'right',
    });

    // Rellenar las celdas restantes después de 'Cantidad'
    for (let i = cantidadColumnIndex + 1; i < NUM_COLUMNS; i++) {
      totalRowCells.push({
        text: '',
        style: 'tableTotalValue',
        alignment: 'left',
      });
    }

    // --- ENSAMBLAR EL CUERPO FINAL DE LA TABLA ---
    const tableBody = [
      headerRow, // Fila de encabezados
      ...tableBodyRows, // Filas de datos
      totalRowCells, // Fila de totales
    ];

    // Obtener los anchos de las columnas para el docDefinition
    const tableWidths = providenciaColumns.map((col) => col.width || 'auto');

    const docDefinition = {
      pageOrientation: 'landscape',
      content: [
        this.generatePDFHeader(
          'Reporte de la Providencia 000102 - Art. 32',
          logoBase64
        ),
        {
          table: {
            headerRows: 1,
            widths: tableWidths,
            body: tableBody,
          },
        },
      ],
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
        tableHeader: {
          bold: true,
          fillColor: '#34495e',
          color: '#ffffff',
          alignment: 'center',
        },
        tableBody: { fontSize: 9 },
        tableTotalLabel: {
          bold: true,
          fontSize: 10,
          alignment: 'left',
          fillColor: '#ecf0f1',
        },
        tableTotalValue: {
          bold: true,
          fontSize: 10,
          alignment: 'right',
          fillColor: '#ecf0f1',
        },
      },
    };

    this.generatePDF(docDefinition, 'Control de Emisores en Producción');
  }
  async generateNmrControlVendidosExcel(_data: any) {
    // --- PASO 1: Preparar los Datos (Tu lógica, sin cambios) ---
    if (!Array.isArray(_data)) {
      console.error('Los datos recibidos no son un array.', _data);
      return;
    }

    const tableData = _data.map((record: any) => {
      const razonSocial = record.org_id_src?.social_name || 'N/A';
      const rif = `${record.org_id_src?.tipo_identificacion || ''}-${
        record.org_id_src?.value || ''
      }`;
      return {
        razonSocial: razonSocial.trim(),
        rif: rif,
        serie: record.serie,
        cantidad: record.quantity,
        nroControlInicio: record.startno,
        nroControlFinal: record.endno,
      };
    });

    // --- PASO 2: Construir la Hoja de Cálculo como un "Array de Arrays" ---
    const reportTitle = 'REPORTE DE NÚMEROS DE CONTROL VENDIDOS';
    const currentDateTime = formatDate(new Date(), 'dd/MM/yyyy  hh:mm aa');

    // 2.1: Crear las filas del encabezado personalizado
    const headerRows = [
      [], // Fila 2 vacía
      ['ABC DIGITAL PRINTING', '', 'Fecha:', currentDateTime], // Fila 3
      ['J-50604016-6'], // Fila 4
      [],
      ['', '', reportTitle], // Fila 1 para el título
      [], // Fila 5 vacía, para separar del contenido
      [],
    ];

    // 2.2: Crear la fila de cabeceras de la tabla de datos
    const dataHeaderRow = [
      'RAZON SOCIAL',
      'RIF',
      'SERIE',
      'CANTIDAD',
      'NRO CONTROL INICIO',
      'NUM CONTROL FINAL',
    ];

    // Usamos una configuración para mapear los objetos a arrays en el orden correcto
    const reportColumns = [
      { key: 'razonSocial' },
      { key: 'rif' },
      { key: 'serie' },
      { key: 'cantidad' },
      { key: 'nroControlInicio' },
      { key: 'nroControlFinal' },
    ];

    // 2.3: Convertir tu array de objetos de datos en un array de arrays
    const dataRows = tableData.map((row: any) =>
      reportColumns.map((col) => row[col.key])
    );

    // 2.4: Unir todo en un solo gran array
    const finalSheetData = [...headerRows, dataHeaderRow, ...dataRows];

    // --- PASO 3: Crear la Hoja de Cálculo y Aplicar Formatos ---

    // 3.1: Crear la hoja a partir del array de arrays. ¡Este es el método correcto!
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(finalSheetData);

    // 3.2: Combinar las celdas para el título principal
    // La celda A1 (fila 0, col 0) se expandirá hasta la última columna de la tabla.
    const merge = {
      s: { r: 0, c: 0 }, // Celda de inicio: Fila 0, Columna 0 (A1)
      e: { r: 0, c: dataHeaderRow.length - 1 }, // Celda de fin: Fila 0, Última columna
    };
    worksheet['!merges'] = [merge];

    // 3.3: Ajustar el ancho de las columnas
    const columnWidths = [
      { wch: 45 },
      { wch: 20 },
      { wch: 10 },
      { wch: 15 },
      { wch: 20 },
      { wch: 20 },
    ];
    worksheet['!cols'] = columnWidths;

    // --- PASO 4: Crear el Libro y Descargar ---
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Números de Control');
    XLSX.writeFile(workbook, 'ReporteDeControlVendidos.xlsx');
  }
  // Método auxiliar para obtener todas las fechas en un rango
  private getDatesInRange(startDate: Date, endDate: Date): Date[] {
    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }

  // Método auxiliar para procesar un documento normal
  private processDocumentLibroVentaExcel(document: any, rowDocument: any[]) {
    let documentNumber = {
      numero_factura:
        document.tipo_documento == '01' ? document.numero_documento_dig : '',
      numero_credito:
        document.tipo_documento == '02' ? document.numero_documento_dig : '',
      numero_debito:
        document.tipo_documento == '03' ? document.numero_documento_dig : '',
    };

    let auxImpuestos = {
      ivaA: { alicuota: '', base_imponible: '', valor_total_imp: '' },
      ivaG: { alicuota: '', base_imponible: '', valor_total_imp: '' },
      ivaR: { alicuota: '', base_imponible: '', valor_total_imp: '' },
    };

    if (document.totales != null && document.totales.impuestos_subtotal) {
      for (let impuesto of document.totales.impuestos_subtotal) {
        switch (impuesto.codigo_total_imp) {
          case 'E':
            auxImpuestos.ivaA = {
              alicuota: impuesto.alicuota_imp,
              base_imponible: impuesto.base_imponible_imp,
              valor_total_imp: impuesto.valor_total_imp,
            };
            break;
          case 'G':
            auxImpuestos.ivaG = {
              alicuota: impuesto.alicuota_imp,
              base_imponible: impuesto.base_imponible_imp,
              valor_total_imp: impuesto.valor_total_imp,
            };
            break;
          case 'A':
            auxImpuestos.ivaR = {
              alicuota: impuesto.alicuota_imp,
              base_imponible: impuesto.base_imponible_imp,
              valor_total_imp: impuesto.valor_total_imp,
            };
            break;
          default:
            break;
        }
      }
    }

    let auxComprador = {
      tipo_identificacion: document.comprador?.tipo_identificacion || '',
      numero_identificacion: document.comprador?.numero_identificacion || '',
      razon_social: document.comprador?.razon_social || '',
    };

    let auxTercero = {
      tipo_identificacion: document.tercero?.tipo_identificacion || '',
      numero_identificacion: document.tercero?.numero_identificacion || '',
      razon_social: document.tercero?.razon_social || '',
    };

    let auxTotalRetention = {
      fecha_emision_cr: document.totales_retencion?.fecha_emision_cr || '',
      numero_comp_retencion:
        document.totales_retencion?.numero_comp_retencion || '',
    };

    rowDocument.push([
      {
        text: document.fecha_asignacion_digital,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: auxComprador.tipo_identificacion
          ? `${auxComprador.tipo_identificacion}-${auxComprador.numero_identificacion}`
          : '',
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: auxComprador.razon_social,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: auxTercero.tipo_identificacion
          ? `${auxTercero.tipo_identificacion}-${auxTercero.numero_identificacion}`
          : '',
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: auxTercero.razon_social,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: document.numero_documento,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: document.numero_control_dig,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: documentNumber.numero_factura,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: documentNumber.numero_debito,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: documentNumber.numero_credito,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: document.numero_factura_afectada || '',
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: auxTotalRetention.fecha_emision_cr,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: auxTotalRetention.numero_comp_retencion,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: document.totales?.monto_total_con_iva || '',
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: document.totales?.monto_gravado_total || '',
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: auxImpuestos.ivaG.base_imponible,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: auxImpuestos.ivaG.alicuota,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: auxImpuestos.ivaG.valor_total_imp,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },

      {
        text: auxImpuestos.ivaR.base_imponible,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: auxImpuestos.ivaR.alicuota,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: auxImpuestos.ivaR.valor_total_imp,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: auxImpuestos.ivaA.base_imponible,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: auxImpuestos.ivaA.alicuota,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: auxImpuestos.ivaA.valor_total_imp,
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
      {
        text: document.totales_retencion?.total_retenido || '',
        style: 'tableHeader',
        fillColor: '#2F4653',
        color: '#fff',
        alignment: 'center',
      },
    ]);
  }

  // Método auxiliar para crear una fila de "NO HUBO VENTA"
  private createNoSaleRow(date: Date): any[] {
    const dateStr = format(date, 'dd/MM/yyyy');
    return [
      {
        text: dateStr,
        style: 'tableHeader',
        fillColor: '#FFCCCB',
        color: '#000',
        alignment: 'center',
      },
      {
        text: 'NO HUBO VENTA',
        style: 'tableHeader',
        fillColor: '#FFCCCB',
        color: '#000',
        alignment: 'center',
        colSpan: 24,
      },
      {
        text: 'NO HUBO VENTA',
        style: 'tableHeader',
        fillColor: '#FFCCCB',
        color: '#000',
        alignment: 'center',
        colSpan: 24,
      },
      {
        text: 'NO HUBO VENTA',
        style: 'tableHeader',
        fillColor: '#FFCCCB',
        color: '#000',
        alignment: 'center',
        colSpan: 24,
      },
      {
        text: 'NO HUBO VENTA',
        style: 'tableHeader',
        fillColor: '#FFCCCB',
        color: '#000',
        alignment: 'center',
        colSpan: 24,
      },
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
    ];
  }
  // ? GENERAL FUNCTIONS
  visulizarexcel() {
    let rowDocument: any;
    const excelData = this.convertToExcelData(rowDocument);
    const worksheet = XLSX.utils.aoa_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Hoja1`);

    // Generar archivo en formato base64
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'base64' });

    // Crear una nueva ventana y mostrar los datos
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      const tableHtml = XLSX.utils.sheet_to_html(worksheet, {
        id: 'tabla-excel',
      });
      newWindow.document.write(`
        <html>
          <head><title>Vista Previa de Excel</title></head>
          <body>
            ${tableHtml}
          </body>
        </html>
      `);
    }
  }

  private convertToExcelData(rows: any[]): any[] {
    const excelData = [];

    for (const row of rows) {
      const excelRow = [];

      for (const cell of row) {
        if (cell.text) {
          excelRow.push(cell.text);
        } else {
          excelRow.push('');
        }
      }

      excelData.push(excelRow);
    }

    return excelData;
  }

  openPdfInNewWindow(base64Data: string) {
    try {
      // Decodificar el Base64
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });

      // Crear URL del blob
      const pdfUrl = URL.createObjectURL(blob);

      // Abrir en nueva ventana
      const newWindow = window.open('', '_blank');

      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>Visualizador de PDF</title>
              <style>
                body { margin: 0; }
                embed { width: 100%; height: 100vh; }
              </style>
            </head>
            <body>
              <embed src="${pdfUrl}" type="application/pdf">
            </body>
          </html>
        `);

        // Limpiar la URL cuando se cierre la ventana
        newWindow.onbeforeunload = () => {
          URL.revokeObjectURL(pdfUrl);
        };
      } else {
        alert('Por favor permite ventanas emergentes para ver el PDF');
      }
    } catch (error) {
      console.error('Error al abrir el PDF:', error);
      alert('Error al cargar el documento PDF');
    }
  }
  generatePDF(_pdf: any, _title: any) {
    let date = new Date();
    let trasformDate = format(new Date(date), "yyyy-MM-dd  hh:mm aaaaa'm'");

    pdfMake.createPdf(_pdf).getBase64((data) => {
      const pdfDataUrl = 'data:application/pdf;base64, ' + data;
      const newWindow = window.open('_system');
      if (newWindow) {
        newWindow.document.write(
          '<iframe src="' +
            pdfDataUrl +
            '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>'
        );
      }
    });
  }

  async getBase64Image(imageUrl: string): Promise<string> {
    // CASO 1: La cadena ya es un Base64. No hay nada que hacer.
    if (imageUrl.startsWith('data:image')) {
      return imageUrl;
    }

    // CASO 2: Es una URL remota ('http...') o una ruta local de assets ('assets/...').
    // Para el navegador, ambos se cargan de la misma manera: con una petición HTTP.
    try {
      // fetch funciona tanto para 'https://...' como para '/assets/...'
      const response = await fetch(imageUrl);

      // Verificamos si la imagen se encontró y se cargó correctamente.
      if (!response.ok) {
        throw new Error(
          `No se pudo cargar la imagen. Estado: ${response.status} ${response.statusText}`
        );
      }

      const blob = await response.blob();

      // Usamos FileReader para convertir el Blob a una cadena Base64.
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        // onloadend se ejecuta cuando la lectura se completa (con éxito o error).
        reader.onloadend = () => {
          resolve(reader.result as string); // Ej: "data:image/png;base64,iVBORw0KGg..."
        };
        // Si hay un error durante la lectura del archivo.
        reader.onerror = (error) => {
          reject(error);
        };
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error(
        `Error al procesar la imagen desde la ruta: "${imageUrl}"`,
        error
      );
      return ''; // Devolvemos una cadena vacía como fallback en caso de error.
    }
  }
  private safeString(value: any): string {
    if (value === null || value === undefined) return '';

    // Si es número muy grande, forzar como string entre comillas
    if (typeof value === 'number' && value.toString().length > 15) {
      return `"${value}"`;
    }

    return String(value);
  }

  // 3. Asegura que todos los valores numéricos usen formatNumber:
  private formatNumber(value: any): string {
    const num = Number(value);
    return isNaN(num)
      ? '0.00'
      : num.toLocaleString('es-ES', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
  }
}
