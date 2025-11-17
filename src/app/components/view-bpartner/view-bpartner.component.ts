import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { format } from 'date-fns';
import { Subscription } from 'rxjs';
import { CreateOrgPage } from 'src/app/modals/create-org/create-org.page';
import { AlertsService } from 'src/app/services/alerts.service';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { FilterService } from 'src/app/services/filter.service';

@Component({
  selector: 'app-view-bpartner',
  templateUrl: './view-bpartner.component.html',
  styleUrls: ['./view-bpartner.component.scss'],
})
export class ViewBpartnerComponent implements OnInit {
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

      createdby: '',
      description: '',
      email: '',
      email2: '',
      name: '',
      org_id: '',
      phone: '',
      phone2: '',
      social_name: '',
      tipo_identificacion: '',
      updatedby: '',
      value: '',
    },
    date_columns: [],
    boolean_columns: ['contribuyente_especial', 'isactive', 'issummary'],
    numeric_columns: [],
    auxiliar: [],
  };
  majorListSubjet?: Subscription;
  allOrgs: any = [];
  constructor(
    public filterService: FilterService,
    public apiService: ApiService,
    public modalController: ModalController,
    public servData: DataService,
    public router: Router,
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
      .subscribeOrgs()
      .subscribe((resp: any) => {
        console.log('RES =>', resp);

        this.allOrgs = resp;
        if (resp.length > 0) {
        }
      });
  }
  majorListUnsubscription() {
    this.majorListSubjet?.unsubscribe();
  }
  majorQuery() {
    this.apiService.getOrgs_byFilter(this.filter);
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
  get filteredOrgs(): any[] {
    if (!this.form.name) {
      return this.allOrgs;
    }

    return this.allOrgs.filter((item: any) =>
      this.filterService.deepSearch(item, this.form.name.toLowerCase())
    );
  }
  async openModalOrg() {
    if (this.authService.user.user.desc_catalogo == 'SENIAT') {
      this.alertService.modalError(
        'Permiso Denegado',
        'El usuario no posee permisos para realizar esta acción'
      );
      return;
    }
    const modal = await this.modalController.create({
      component: CreateOrgPage,
      cssClass: 'modal createOrg',
    });
    modal.present();
    const response = await modal.onDidDismiss();

    if (response['data'] != undefined) {
      this.majorQuery();
      this.majorListSubscription();
    }
  }
  async selectOrg(_org: any) {
    this.authService.orgSelected = _org;
    this.router.navigate(['/view-documents-sent']);
  }
}
