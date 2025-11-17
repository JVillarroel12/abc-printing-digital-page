import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { format } from 'date-fns';
import { Subscription } from 'rxjs';
import { CreateSequencePage } from 'src/app/modals/create-sequence/create-sequence.page';
import { CreateSerieChildPage } from 'src/app/modals/create-sequence-child/create-serie-child.page';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';
import { FilterService } from 'src/app/services/filter.service';
import { AuthService } from 'src/app/services/auth.service';
import { AlertsService } from 'src/app/services/alerts.service';

@Component({
  selector: 'app-view-numbering',
  templateUrl: './view-numbering.component.html',
  styleUrls: ['./view-numbering.component.scss'],
})
export class ViewNumberingComponent implements OnInit {
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
      sequence_id: '',
      org_id: '',
      name: '',
      description: '',
      serie: '',
      prefix: '',
      suffix: '',
      startno: 0,
      incrementno: 0,
      maxquantity: 0,
      createdby: '',
      vformat: '',
    },
    date_columns: [],
    boolean_columns: [],
    numeric_columns: ['startno', 'incrementno', 'maxquantity'],
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

  allSquence: any = [];

  constructor(
    public filterService: FilterService,
    public modalController: ModalController,
    public servData: DataService,
    public apiService: ApiService,
    public authService: AuthService,
    public alertService: AlertsService
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

    this.majorQuery();
    this.majorListSubscription();
  }

  ionViewWillLeave() {
    this.majorListUnsubscription();
  }

  majorListSubscription() {
    this.majorListSubjet = this.servData
      .subscribeSequences()
      .subscribe((resp: any) => {
        if (this.authService.user.user.desc_catalogo == 'NORMAL') {
          this.filter.columns.org_id = this.authService.user.user.org_id;
        }
        this.allSquence = resp;
        this.allSquence.forEach((sequence: any) => {
          sequence.open = false;
          sequence.childs = [];
        });
        if (resp.length > 0) {
        }
      });
  }

  majorListUnsubscription() {
    this.majorListSubjet?.unsubscribe();
  }

  majorQuery() {
    this.apiService.getSequences_byFilter(this.filter);
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

  get filteredSequence(): any[] {
    if (!this.form.name) {
      return this.allSquence;
    }

    return this.allSquence.filter((item: any) =>
      this.filterService.deepSearch(item, this.form.name.toLowerCase())
    );
  }

  async openModalSequence() {
    if (this.authService.user.user.desc_catalogo == 'NORMAL') {
      this.alertService.modalError(
        'Permiso Denegado',
        'El usuario no posee permisos para realizar esta acción'
      );
      return;
    }
    if (this.authService.user.user.desc_catalogo == 'SENIAT') {
      this.alertService.modalError(
        'Permiso Denegado',
        'El usuario no posee permisos para realizar esta acción'
      );
      return;
    }
    const modal = await this.modalController.create({
      component: CreateSequencePage,
      cssClass: 'modal createSequence',
    });
    modal.present();

    const response = await modal.onDidDismiss();

    if (response.data != undefined) {
      this.majorQuery();
      this.majorListSubscription();
    }
  }

  async openModalChild(_sequence: any) {
    if (this.authService.user.user.desc_catalogo == 'NORMAL') {
      this.alertService.modalError(
        'Permiso Denegado',
        'El usuario no posee permisos para realizar esta acción'
      );
      return;
    }
    if (this.authService.user.user.desc_catalogo == 'SENIAT') {
      this.alertService.modalError(
        'Permiso Denegado',
        'El usuario no posee permisos para realizar esta acción'
      );
      return;
    }
    const modal = await this.modalController.create({
      component: CreateSerieChildPage,
      cssClass: 'modal createSequence',
      componentProps: {
        sequence: _sequence,
      },
    });
    modal.present();

    const response = await modal.onDidDismiss();

    if (response.data != undefined) {
    }
  }

  openSequence(_sequence: any) {
    _sequence.open = !_sequence.open;
    if (_sequence.open) {
      let id = _sequence.sequence_id;

      let idObject = {
        id: id,
      };

      const query = this.apiService.getSequencesChildsBySequence(idObject);

      query.subscribe(
        (data: any) => {
          _sequence.childs = data;
        },
        (error: any) => {
          this.alertService.cancelLoading();
        }
      );
    } else {
      _sequence.childs = [];
    }
  }
}
