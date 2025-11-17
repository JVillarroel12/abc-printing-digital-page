import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
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

@Component({
  selector: 'app-view-documents-sent',
  templateUrl: './view-documents-sent.component.html',
  styleUrls: ['./view-documents-sent.component.scss'],
})
export class ViewDocumentsSentComponent implements OnInit {
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
    id: '',
    name: '',
  };

  form = {
    name: '',
    fechaInicio: '',
    fechaFin: '',
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
      fecha_asignacion_digital: '',
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
    date_columns: [''],
    boolean_columns: ['anulado'],
    numeric_columns: [''],
    auxiliar: [
      // {
      //   collection: 'documento',
      //   tableIdentifier: 'documento_id',
      //   column: 'comprador',
      //   value: null,
      // },
    ],
  };
  selectors = {
    org: {
      org_id: '',
      name: '',
    },
  };
  majorListSubjet?: Subscription;

  constructor(
    public filterService: FilterService,
    public apiService: ApiService,
    private servData: DataService,
    public authService: AuthService,
    public modalController: ModalController,
    public alertService: AlertsService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.authService.user.user.desc_catalogo == 'NORMAL') {
      this.filter.columns.org_id = this.authService.user.user.org_id;
    }
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
    this.headerSelected = {
      name: 'TODOS',
      id: '%',
    };

    this.allDocuments = [];
    this.general.blockKeydown = false;
    this.getAllDocument();
    console.log('aaa');
  }
  ionViewWillEnter() {
    console.log('aaaaa');

    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      const itemData = navigation.extras.state['itemData'];
      console.log('ITEM =>', itemData);

      // Usar los datos
    }
  }
  ionViewWillLeave() {
    this.majorListUnsubscription();
    // Para queryParams
  }
  onInicioDateChange(event: any) {
    const selectedDate = event.target.value;
    this.form.fechaInicio = this.formatDate(selectedDate);
    this.getAllDocument();
  }
  onFinDateChange(event: any) {
    const selectedDate = event.target.value;
    this.form.fechaFin = this.formatDate(selectedDate);
    this.getAllDocument();
  }
  formatDate(dateValue: string) {
    const date = new Date(dateValue);
    return format(date, 'yyyy-MM-dd HH:mm');
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
      this.getAllDocument();
    }
  }
  async getAllDocument() {
    await this.alertService.initLoading();
    let desde = new Date(this.form.fechaInicio).getTime();
    let hasta = new Date(this.form.fechaFin).getTime();
    let auxOrg =
      this.authService.user.user.desc_catalogo == 'NORMAL'
        ? null
        : this.selectors.org.org_id;
    if (this.authService.orgSelected.org_id != '') {
      auxOrg = this.authService.orgSelected.org_id;
    }
    let obj = {
      org_id: auxOrg,
      tipo_documento: this.headerSelected.id,
      desde: desde,
      hasta: hasta,
    };

    const query = this.apiService.getAllDocument(obj);

    query.subscribe(
      (data: any) => {
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
      (error) => {
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
    this.filter[this.general.currentView].auxiliar.forEach((column: any) => {
      if (column.value == '')
        this.filter[this.general.currentView].columns[column.tableIdentifier] =
          [];
    });

    this.apiService.getDocuments_byAuxiliarFilter(
      this.filter[this.general.currentView]
    );
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
}
