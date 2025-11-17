import { Component, OnInit } from '@angular/core';
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
  selector: 'app-nota-credito',
  templateUrl: './nota-credito.component.html',
  styleUrls: ['./nota-credito.component.scss'],
})
export class NotaCreditoComponent implements OnInit {
  headerSelected = {
    id: '02',
    name: 'NOTA CREDITO',
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
    tipo_documento: '02',
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

  selectors = {
    org: {
      org_id: '%',
      name: 'TODOS',
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

    this.allDocuments = [];
    this.general.blockKeydown = false;
  }

  onStartDateChange(event: any) {
    let date = new Date(event.target.value).getTime();
    this.form.fechaInicio = this.formatDate(event.target.value);
  }

  onEndDateChange(event: any) {
    let date = new Date(event.target.value).getTime();
    this.form.fechaFin = this.formatDate(event.target.value);
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
}
