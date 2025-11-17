import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { format } from 'date-fns';
import { Subscription } from 'rxjs';
import { CreateUserPage } from 'src/app/modals/create-user/create-user.page';
import { AlertsService } from 'src/app/services/alerts.service';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { FilterService } from 'src/app/services/filter.service';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss'],
})
export class ViewUserComponent implements OnInit {
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
      isactive: null,
      isportal: null,
      catalogo_id: '',
      desc_catalogo: '',
      email: '',
      org_id: '',
      serie_id: '',
      token: '',
      user_id: '',
      usuario: '',
    },
    date_columns: [],
    boolean_columns: ['isactive', 'isportal'],
    numeric_columns: [],
    auxiliar: [
      {
        collection: 'org',
        tableIdentifier: 'org_id',
        column: 'name',
        value: null,
      },
      {
        collection: 'serie',
        tableIdentifier: 'serie_id',
        column: 'name',
        value: null,
      },
    ],
  };
  majorListSubjet?: Subscription;
  allUsers: any = [];
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
      .subscribeUsers()
      .subscribe((resp: any) => {
        console.log('user =>', resp);

        this.allUsers = resp;
        if (resp.length > 0) {
        }
      });
  }
  majorListUnsubscription() {
    this.majorListSubjet?.unsubscribe();
  }
  majorQuery() {
    this.apiService.getUsers_byFilter(this.filter);
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
  get filteredUsers(): any[] {
    if (!this.form.name) {
      return this.allUsers;
    }

    return this.allUsers.filter((item: any) =>
      this.filterService.deepSearch(item, this.form.name.toLowerCase())
    );
  }
  async openModalUser() {
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
      component: CreateUserPage,
      cssClass: 'modal createUser',
      componentProps: {
        mode: 'create',
      },
    });
    modal.present();

    const response = await modal.onDidDismiss();

    if (response.data != undefined) {
      this.majorQuery();
      this.majorListSubscription();
    }
  }
  async editModalUser(_user: any) {
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
      component: CreateUserPage,
      cssClass: 'modal createUser',
      componentProps: {
        mode: 'edit',
        user: _user,
      },
    });
    modal.present();

    const response = await modal.onDidDismiss();

    if (response.data != undefined) {
      this.majorQuery();
      this.majorListSubscription();
    }
  }
}
