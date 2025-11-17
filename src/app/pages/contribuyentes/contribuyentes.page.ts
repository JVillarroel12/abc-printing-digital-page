import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { format } from 'date-fns';
import { Subscription } from 'rxjs';
import { ProfileComponent } from 'src/app/components/popovers/profile/profile.component';
import { ContactPage } from 'src/app/modals/contact/contact.page';
import { AlertsService } from 'src/app/services/alerts.service';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-contribuyentes',
  templateUrl: './contribuyentes.page.html',
  styleUrls: ['./contribuyentes.page.scss'],
})
export class ContribuyentesPage implements OnInit {
  form = {
    name: '',
    direccion: '',
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
  allContribuyentes: any = [];

  constructor(
    public popoverController: PopoverController,
    public router: Router,
    public modalController: ModalController,
    public servData: DataService,
    public apiService: ApiService,
    public alertService: AlertsService,
    public authService: AuthService
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

  async majorListSubscription() {
    await this.alertService.initLoading();
    this.majorListSubjet = this.servData
      .subscribeOrgs()
      .subscribe((resp: any) => {
        console.log('RES =>', resp);
        this.alertService.cancelLoading();
        this.allContribuyentes = resp;
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

  applyFilter() {
    this.filter.columns.name = this.filter.columns.name.toUpperCase();
    this.majorQuery();
    this.majorListSubscription();
  }

  async showProfile(_event: any) {
    const popover = await this.popoverController.create({
      component: ProfileComponent,
      cssClass: 'popover profile',
      event: _event,
      translucent: false,
    });

    popover.present();

    const popoverResponse = await popover.onDidDismiss();

    if (popoverResponse['role'] == 'backdrop') return;

    const action = popoverResponse['data']['action'];

    switch (action) {
      case 'settings':
        //this.componentSelected = SettingsPage;
        break;

      case 'exit':
        this.router.navigate(['/login']);
        break;
    }
  }
  selectImprenta() {
    this.authService.orgSelected = {
      org_id: '',
    };
    this.router.navigate(['/view-home']);
  }
  selectContribuyente(_org: any) {
    this.authService.orgSelected = _org;
    this.authService.orgSelected = { ..._org };
    console.log('ORG ANTES =>', this.authService.orgSelected);

    this.router.navigate(['/view-home']);
  }

  async openModalContact() {
    const modal = await this.modalController.create({
      component: ContactPage,
      cssClass: 'modal contact',
    });
    modal.present();
  }

  selectMode() {
    this.router.navigate(['/select-mode']);
  }
  fiscalizar(_data: any) {}
}
