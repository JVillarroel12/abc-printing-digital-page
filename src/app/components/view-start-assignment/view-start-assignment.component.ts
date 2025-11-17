import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { format } from 'date-fns';
import { Subscription } from 'rxjs';
import { StartAssignmentsPage } from 'src/app/modals/start-assignments/start-assignments.page';
import { AlertsService } from 'src/app/services/alerts.service';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { FilterService } from 'src/app/services/filter.service';

@Component({
  selector: 'app-view-start-assignment',
  templateUrl: './view-start-assignment.component.html',
  styleUrls: ['./view-start-assignment.component.scss'],
})
export class ViewStartAssignmentComponent implements OnInit {
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
      created: '',
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
    public alertService: AlertsService
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

    this.majorQuery();
    this.majorListSubscription();
  }
  ionViewWillLeave() {
    this.majorListUnsubscription();
  }
  majorListSubscription() {
    this.majorListSubjet = this.servData
      .subscribeStartContribuyente()
      .subscribe((resp: any) => {
        console.log('RESP =>', resp);

        this.allStartContribuyente = resp;
        if (resp.length > 0) {
        }
      });
  }
  majorListUnsubscription() {
    this.majorListSubjet?.unsubscribe();
  }
  majorQuery() {
    this.apiService.getStartContribuyente_byFilter(this.filter);
  }
  onInicioDateChange(event: any) {
    const selectedDate = event.target.value;
    this.form.fechaInicio = this.formatDate(selectedDate);
  }
  onFinDateChange(event: any) {
    const selectedDate = event.target.value;
    this.form.fechaFin = this.formatDate(selectedDate);
  }
  formatDate(dateValue: string) {
    const date = new Date(dateValue);
    return format(date, 'yyyy-MM-dd HH:mm');
  }
  get filteredStartContribuyentes(): any[] {
    if (!this.form.name) {
      return this.allStartContribuyente;
    }

    return this.allStartContribuyente.filter((item: any) =>
      this.filterService.deepSearch(item, this.form.name.toLowerCase())
    );
  }
  async openModalCreate() {
    const modal = await this.modalController.create({
      component: StartAssignmentsPage,
      cssClass: 'modal startAssignment',
    });
    modal.present();

    const response = await modal.onDidDismiss();

    if (response.data != undefined) {
      this.majorQuery();
      this.majorListSubscription();
    }
  }
}
