import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { format } from 'date-fns';
import { Subscription } from 'rxjs';
import { AlertsService } from 'src/app/services/alerts.service';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { FilterService } from 'src/app/services/filter.service';
import { PrintService } from 'src/app/services/print.service';

@Component({
  selector: 'app-nmr-control-vendidos',
  templateUrl: './nmr-control-vendidos.component.html',
  styleUrls: ['./nmr-control-vendidos.component.scss'],
})
export class NmrControlVendidosComponent implements OnInit {
  form = {
    name: '',
    fechaInicio: '',
    fechaFin: '',
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
      created: { start: 0, end: 0 },
      updated: '',
      isactive: true,
      procesada: true,
      asignacion_contribuyente_id: '',
      createdby: '',
      description: '', //
      fecha_factura: '',
      monto: '',
      nro_control: '',
      nro_documento: '',
      org_id: '', //
      referencia: '',
      sequence_id: '',
      updatedby: '',
      endno: 0, //
      quantity: 0, //
      startno: 0, //
      numero_serie: '',
    },
    date_columns: [],
    boolean_columns: ['isactive', 'procesada'],
    numeric_columns: [],
    auxiliar: [
      {
        collection: 'org',
        tableIdentifier: 'org_id',
        column: 'name',
        value: null,
      },
      {
        collection: 'sequence',
        tableIdentifier: 'sequence_id',
        column: 'name',
        value: null,
      },
    ],
  };
  majorListSubjet?: Subscription;
  allStartContribuyente: any = [];
  constructor(
    public filterService: FilterService,
    public apiService: ApiService,
    public modalController: ModalController,
    public servData: DataService,
    public authService: AuthService,
    public alertService: AlertsService,
    public printService: PrintService
  ) {}

  ngOnInit() {
    if (this.authService.user.user.user_id == '') {
      this.alertService.modalError('Ha ocurrido un error', 'Error de sesión');
      this.authService.logout();
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

    this.filter.columns.org_id = this.authService.orgSelected.org_id;
    console.log('ORG =>', this.filter.columns);

    this.form.fechaFin = defaultFinal2.toISOString().slice(0, 16);
  }
  ionViewWillLeave() {
    this.majorListUnsubscription();
  }
  majorListSubscription(_type: string) {
    this.majorListSubjet = this.servData
      .subscribeStartContribuyente()
      .subscribe((resp: any) => {
        console.log('RESP =>', resp);

        this.allStartContribuyente = resp;
        if (resp.length > 0) {
          console.log('_TYPE =>', _type);

          if (_type === 'pdf') {
            this.printService.generateNmrControlVendidosPDF(resp);
          }
          if (_type === 'excel') {
            this.printService.generateNmrControlVendidosExcel(resp);
          }
        }
      });
  }
  majorListUnsubscription() {
    this.majorListSubjet?.unsubscribe();
  }
  majorQuery() {
    this.apiService.getStartContribuyente_byFilter(this.filter);
  }

  onStartDateChange(event: any) {
    let date = new Date(event.target.value).getTime();
    this.filter.columns.created.start = date;
  }

  onEndDateChange(event: any) {
    let date = new Date(event.target.value).getTime();
    this.filter.columns.created.end = date;
  }

  formatDate(dateValue: string) {
    return format(new Date(dateValue), 'hh:mm:ss aa yyyy-MM-dd');
  }
  getAllDocument(_type: any) {
    this.majorQuery();
    this.majorListSubscription(_type);
  }
}
