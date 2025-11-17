import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { format } from 'date-fns';
import { Subscription } from 'rxjs';
import { SendEmailPage } from 'src/app/modals/send-email/send-email.page';
import { SOrgPage } from 'src/app/selectors/s-org/s-org.page';
import { AlertsService } from 'src/app/services/alerts.service';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { FilterService } from 'src/app/services/filter.service';
import { PrintService } from 'src/app/services/print.service';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.scss'],
})
export class FacturaComponent implements OnInit {
  isFocused: boolean = false;
  headerFilter = [
    {
      id: '%',
      name: '',
      img: 'assets/img/lista.png',
    },
    {
      id: '01',
      name: 'FACTURA',
      img: 'assets/img/factura.png',
    },
    {
      id: '02',
      name: 'NOTA DE CRÉDITO',
      img: 'assets/img/pago.png',
    },
    {
      id: '03',
      name: 'NOTA DE DÉBITO',
      img: 'assets/img/tarjeta.png',
    },
    {
      id: '04',
      name: 'ORDEN DE ENTREGA / GUÍA DE DESPACHO',
      img: 'assets/img/despacho-de-aduana.png',
    },
    {
      id: '05',
      name: 'COMP. RETENCIÓN - IVA',
      img: 'assets/img/impuesto.png',
    },
    {
      id: '06',
      name: 'COMP. RETENCIÓN - ISLR',
      img: 'assets/img/impuesto.png',
    },
  ];

  headerSelected = {
    id: '01',
    name: 'FACTURA',
  };

  form = {
    name: '',
    fechaInicio: '',
    fechaFin: '',
    documento_num_doc: '',
    documento_tipo_trans: '',
    documento_serie_afect: '',
    documento_numero_afect: '',
    documento_fecha_afect: '',
    documento_reg_esp_tri: '',
    documento_fecha_emi: '',
    documento_serie: '',
    documento_sucursal: '',
    documento_moneda: '',
    documento_num_control_dig: '',
    documento_num_doc_dig: '',
    documento_fecha_asig_dig: '',
    comprador_num_iden: '',
    comprador_tipo_iden: '',
    comprador_razon_social: '',
    comprador_direccion: '',
    alicuota: '',
    tipo_documento: '01',
    igtf: false,
  };

  allDocuments: any = [];

  general = {
    isOpenMenu: true,
    blockKeydown: false,
    isUserLoged: true,
    allSelected: false,
    currentView: 'invoiceSalesHeadless',
    currentViewID: 'invoice_id',
    currentSubLine: 'invoiceline',
    currentSubLineID: 'invoiceline_id',
    currentPage: '',
    selectedIndex: 0,
    previousIndex: 0,
    lineSelected: {
      current: 0,
      previus: 0,
    },
    sublineSelected: {
      current: 0,
      previus: 0,
    },
  };

  filter: any = {
    index: 0,
    itemsByPage: null,
    count: 0,
    orderBy: {
      column: '',
      asc: false,
    },
    columns: {
      anulado: false,
      comentario_factura_afectada: '',
      documento_afectado_id: '',
      documento_id: '',
      fecha_asignacion_digital: { start: 0, end: 0 },
      fecha_emision: '',
      fecha_factura_afectada: '',
      fecha_vencimiento: '',
      hora_asignacion_digita: '',
      hora_emision: '',
      moneda: '',
      monto_factura_afectada: '',
      numero_control_dig: '',
      numero_documento: '',
      numero_documento_dig: '',
      numero_expediente_importacion: '',
      numero_factura_afectada: '',
      numero_planilla_importacion: '',
      org_id: '',
      regimen_esp_tributacion: '',
      serie: '',
      serie_factura_afectada: '',
      sucursal: '',
      tipo_de_pago: '',
      tipo_de_venta: '',
      tipo_documento: '01',
      tipo_proveedor: '',
      tipo_transaccion: '',
      transaccion_id: '',
    },
    date_columns: ['fecha_asignacion_digital'],
    boolean_columns: ['anulado'],
    numeric_columns: [''],
    auxiliar: [
      {
        collection: 'org',
        tableIdentifier: 'org_id',
        column: 'name',
        value: null,
      },
      {
        collection: 'comprador',
        tableIdentifier: 'comprador_id',
        column: 'razon_social',
        value: null,
      },

      {
        collection: 'tercero',
        tableIdentifier: 'tercero_id',
        column: 'razon_social',
        value: null,
      },
    ],
  };
  selectors = {
    org: {
      org_id: '%',
      name: 'TODOS',
    },
  };
  majorListSubjet?: Subscription;
  defaultFrom: any;
  defaultEnd: any;
  constructor(
    public filterService: FilterService,
    public apiService: ApiService,
    private servData: DataService,
    public authService: AuthService,
    public modalController: ModalController,
    public alertService: AlertsService,
    public printService: PrintService
  ) {}

  ngOnInit() {
    let defaultInicio = new Date();
    defaultInicio.setHours(0, 0, 0, 0);
    let defaultInicio2 = new Date(
      defaultInicio.getTime() - defaultInicio.getTimezoneOffset() * 60000
    );
    this.form.fechaInicio = defaultInicio2.toISOString().slice(0, 16);

    let defaultFinal = new Date();
    defaultFinal.setHours(23, 59, 0, 0);
    let defaultFinal2 = new Date(
      defaultFinal.getTime() - defaultFinal.getTimezoneOffset() * 60000
    );
    this.form.fechaFin = defaultFinal2.toISOString().slice(0, 16);
  }
  ionViewWillEnter() {
    this.majorListSubscription();
  }
  ionViewWillLeave() {
    this.majorListUnsubscription();
  }
  onFocus() {
    this.isFocused = true;
  }

  onBlur() {
    this.isFocused = false;
  }
  onStartDateChange(event: any) {
    let date = new Date(event.target.value).getTime();
    this.filter.columns.fecha_asignacion_digital.start = date;
    this.form.fechaInicio = this.formatDate(event.target.value);
    console.log('FILTER =>', this.filter);
  }

  onEndDateChange(event: any) {
    let date = new Date(event.target.value).getTime();
    this.filter.columns.fecha_asignacion_digital.end = date;
    this.form.fechaFin = this.formatDate(event.target.value);
  }
  formatDate(dateValue: string) {
    const date = new Date(dateValue);
    return format(date, 'yyyy-MM-dd HH:mm');
  }

  async getAllDocument() {
    await this.alertService.initLoading();
    let desde = new Date(this.form.fechaInicio).getTime();
    let hasta = new Date(this.form.fechaFin).getTime();

    let auxOrg =
      this.authService.user.user.desc_catalogo == 'NORMAL'
        ? this.authService.user.user.org_id
        : this.selectors.org.org_id;

    if (this.authService.orgSelected.org_id != '') {
      auxOrg = this.authService.orgSelected.org_id;
    }

    let obj = {
      org_id: auxOrg,
      tipo_documento: this.headerSelected.id,

      // ? fecha
      desde: desde,
      hasta: hasta,
      // ?

      // ? documento
      documento_num_doc: this.form.documento_num_doc,
      documento_tipo_trans: this.form.documento_tipo_trans,
      documento_serie_afect: this.form.documento_serie_afect,
      documento_numero_afect: this.form.documento_numero_afect,
      documento_fecha_afect: this.form.documento_fecha_afect,
      documento_reg_esp_tri: this.form.documento_reg_esp_tri,
      documento_fecha_emi: this.form.documento_fecha_emi,
      documento_serie: this.form.documento_serie,
      documento_sucursal: this.form.documento_sucursal,
      documento_moneda: this.form.documento_moneda,
      documento_num_control_dig: this.form.documento_num_control_dig,
      documento_num_doc_dig: this.form.documento_num_doc_dig,
      documento_fecha_asig_dig: this.form.documento_fecha_asig_dig,
      // ?

      // ? comprador
      comprador_num_iden: this.form.comprador_num_iden,
      comprador_tipo_iden: this.form.comprador_tipo_iden,
      comprador_razon_social: this.form.comprador_razon_social.toUpperCase(),
      comprador_direccion: this.form.comprador_direccion,
      alicuota: this.form.alicuota,

      //?  boolean
      igtf: this.form.igtf == true ? '1' : '0',
    };
    console.log('ENVIAR =>', obj);

    const query = this.apiService.getAllDocument(obj);

    query.subscribe(
      (data: any) => {
        console.log('DATA =>', data);

        this.allDocuments = data.documentos;

        this.allDocuments.forEach((document: any) => {
          document.open = false;
          document.lines = [];
          if (document.tipo_documento == '05') {
            document.tercero = document.sujeto_retenido;
          }
          if (document.tercero == null) {
            document.tercero = {
              razon_social: 'SIN TERCERO',
            };
          }
        });
        this.alertService.cancelLoading();
      },
      (error: any) => {
        this.alertService.cancelLoading();
      }
    );
  }
  get filteredDocuments(): any[] {
    if (!this.form.name) {
      return this.allDocuments;
    }

    return this.allDocuments.filter((item: any) =>
      this.filterService.deepSearch(item, this.form.name.toLowerCase())
    );
  }
  setHeaderSelected(_data: any) {
    this.headerSelected = _data;

    this.getAllDocument();
  }
  majorListSubscription() {
    this.majorListSubjet = this.servData
      .subscribeDocuments()
      .subscribe((resp: any) => {
        this.allDocuments = resp;

        this.allDocuments.forEach((document: any) => {
          document.open = false;
          document.lines = [];
          if (document.tipo_documento == '05') {
            document.tercero_id_src = document.sujeto_retenido;
          }
          if (document.tercero_id == null) {
            document.tercero_id_src = {
              razon_social: 'SIN TERCERO',
            };
          }
        });
        if (resp.length > 0) {
          this.general.blockKeydown = true;
        } else;
      });
  }
  majorListUnsubscription() {
    this.majorListSubjet?.unsubscribe();
  }
  majorQuery() {
    this.apiService.getAllDocuments_byFilter(this.filter);
  }
  majorQueryWithAuxiliarColumns() {
    console.log('111111');
    console.log('FILTER MAJOR QUERY =>', this.filter);
    this.filter.auxiliar.forEach((column: any) => {
      if (column.value == '') this.filter.columns[column.tableIdentifier] = [];
    });

    this.apiService.getDocuments_byAuxiliarFilter(this.filter);
  }
  async selectorOrg() {
    const modal = await this.modalController.create({
      component: SOrgPage,
      cssClass: 'modal selector',
    });
    await modal.present();

    const response = await modal.onDidDismiss();

    if (response.data) {
      this.selectors.org = response.data.org;
    }
  }

  openDocument(_document: any) {
    _document.open = !_document.open;
    if (_document.open) {
      let id = _document.documento_id;
      let idObject = {
        id: id,
      };

      const query = this.apiService.getAllLinesByDocument(idObject);

      query.subscribe(
        (data: any) => {
          _document.lines = data.detItems;
          if (data.detItems.length == 0) {
            _document.lines = data.detReten;
          }
        },
        (error: any) => {}
      );
    } else {
      _document.lines = [];
    }
  }

  async modalSendEmail(_document: any) {
    if (this.authService.user.user.desc_catalogo == 'SENIAT') {
      this.alertService.modalError(
        'Permiso Denegado',
        'El usuario no posee permisos para realizar esta acción'
      );
      return;
    }

    const modal = await this.modalController.create({
      component: SendEmailPage,
      componentProps: {
        document: _document,
      },
      cssClass: 'modal sendEmail',
    });
    modal.present();
  }
  searchDocuments() {
    // this.majorListSubscription();
    // this.majorQueryWithAuxiliarColumns();
    this.getAllDocument();
  }
  async viewDocument(_document: any) {
    await this.alertService.initLoading();
    let idObject = {
      id: _document.documento_id,
    };

    const query = this.apiService.getDocumentPdf(idObject);

    query.subscribe(
      (data: any) => {
        this.printService.openPdfInNewWindow(data.pdfbase64);
        this.alertService.cancelLoading();
      },
      (error: any) => {
        this.alertService.cancelLoading();
      }
    );
  }
  openFilterModal() {}
}
