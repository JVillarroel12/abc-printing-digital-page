import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { format } from 'date-fns';
import { SNumeroSeriePage } from 'src/app/selectors/s-numero-serie/s-numero-serie.page';
import { SOrgPage } from 'src/app/selectors/s-org/s-org.page';
import { SPreffixPage } from 'src/app/selectors/s-preffix/s-preffix.page';
import { SSeriePage } from 'src/app/selectors/s-serie/s-serie.page';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-start-assignments',
  templateUrl: './start-assignments.page.html',
  styleUrls: ['./start-assignments.page.scss'],
})
export class StartAssignmentsPage implements OnInit {
  form = {
    created: '',
    updated: '',
    isactive: '',
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
  };

  selectors = {
    org: {
      org_id: '',
      name: '',
    },
    numeroSerie: {
      name: '',
    },
    prefix: {
      name: 'A',
      prefix_id: 'A',
    },
  };

  valid = {
    formValid: false,
    isOrgValid: true,
    isStartnoValid: true,
    isQuantityValid: true,
    isEndnoValid: true,
    isNumeroValid: true,
    isDescriptionValid: true,
  };

  constructor(
    public modalController: ModalController,
    public apiService: ApiService,
    public authService: AuthService
  ) {}

  ngOnInit() {}

  validateField(field: string) {
    switch (field) {
      case 'org_id':
        this.valid.isOrgValid = this.isValid('org_id');
        break;
      case 'numero':
        this.valid.isNumeroValid = this.isValid('numero');
        break;
      case 'startno':
        this.valid.isStartnoValid = this.isValid('startno');
        break;
      case 'endno':
        this.valid.isEndnoValid = this.isValid('endno');
        break;
      case 'quantity':
        this.valid.isQuantityValid = this.isValid('quantity');
        break;
      case 'description':
        this.valid.isDescriptionValid = this.isValid('description');
        break;
    }
  }

  validateForm() {
    this.valid.isOrgValid = this.isValid('org_id');
    this.valid.isNumeroValid = this.isValid('numero');
    this.valid.isStartnoValid = this.isValid('startno');
    this.valid.isEndnoValid = this.isValid('endno');
    this.valid.isQuantityValid = this.isValid('quantity');
    this.valid.isDescriptionValid = this.isValid('description');
    this.valid.formValid =
      this.valid.isNumeroValid &&
      this.valid.isOrgValid &&
      this.valid.isStartnoValid &&
      this.valid.isEndnoValid &&
      this.valid.isQuantityValid &&
      this.valid.isDescriptionValid;
  }

  isValid(field: string): boolean {
    switch (field) {
      case 'org_id':
        return this.selectors.org.org_id.trim() !== '';
      case 'numero':
        return this.selectors.numeroSerie.name.trim() !== '';
      case 'startno':
        return this.form.startno !== null;
      case 'endno':
        return this.form.endno !== null;
      case 'quantity':
        return this.form.quantity !== null;
      case 'description':
        return this.form.description.trim() !== '';
      default:
        return false;
    }
  }

  onFacturaDateChange(event: any) {
    const selectedDate = event.target.value;
    this.form.fecha_factura = this.formatDate(selectedDate);
  }

  formatDate(dateValue: string) {
    const date = new Date(dateValue);
    return format(date, 'yyyy-MM-dd HH:mm');
  }

  async selectorPrefix() {
    const modal = await this.modalController.create({
      component: SPreffixPage,
      cssClass: 'modal selector',
    });
    await modal.present();

    const response = await modal.onDidDismiss();

    if (response.data) {
      this.selectors.prefix = response.data.prefix;
    }
    this.validateField('prefix_id');
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
    this.validateField('org_id');
  }
  async selectorNumeroSerie() {
    const modal = await this.modalController.create({
      component: SNumeroSeriePage,
      cssClass: 'modal selector',
    });
    await modal.present();

    const response = await modal.onDidDismiss();

    if (response.data) {
      this.selectors.numeroSerie = response.data.serie;
    }
    this.validateField('numero');
  }

  setDataSequence() {
    this.validateForm();
    if (this.valid.formValid) {
      let newSequence = {
        isactive: true,
        procesada: true,
        fecha_factura: '',
        monto: '',
        nro_control: '',
        nro_documento: '',
        org_id: this.selectors.org.org_id,
        referencia: '',
        sequence_id: '',
        endno: this.form.endno,
        quantity: this.form.quantity,
        description: this.form.description,
        startno: this.form.startno,
        serie: this.selectors.numeroSerie.name,
        serie_id: '',
        createdby: this.authService.user.user.user_id,
        updatedby: '',
      };
      console.log('form =>', newSequence);

      this.saveAsignacion(newSequence);
    }
  }

  saveAsignacion(_data: any) {
    const query = this.apiService.asignacionContribuyente(_data);

    query.subscribe(
      (data: any) => {
        this.modalController.dismiss({
          proccess: true,
        });
      },
      (error: any) => {}
    );
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
