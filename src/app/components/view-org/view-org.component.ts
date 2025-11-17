import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { format } from 'date-fns';
import { CreateOrgPage } from 'src/app/modals/create-org/create-org.page';
import { ApiService } from 'src/app/services/api.service';
import { FilterService } from 'src/app/services/filter.service';

@Component({
  selector: 'app-view-org',
  templateUrl: './view-org.component.html',
  styleUrls: ['./view-org.component.scss'],
})
export class ViewOrgComponent implements OnInit {
  form = {
    name: '',
    fechaInicio: '',
    fechaFin: '',
  };

  allOrgs: any = [];

  constructor(
    public filterService: FilterService,
    public apiService: ApiService,
    public modalController: ModalController
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
    this.getAllOrgs();
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

  async getAllOrgs() {
    this.apiService.getAllOrgs().subscribe(
      (res: any) => {
        this.allOrgs = res.items;
      },
      async (error) => {}
    );
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
    const modal = await this.modalController.create({
      component: CreateOrgPage,
      cssClass: 'modal createOrg',
    });
    modal.present();
    const response = await modal.onDidDismiss();

    if (response['data'] != undefined) {
      this.getAllOrgs();
    }
  }
}
