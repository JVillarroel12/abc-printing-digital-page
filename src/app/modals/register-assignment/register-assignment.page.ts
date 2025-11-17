import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { format } from 'date-fns';
import { SOrgPage } from 'src/app/selectors/s-org/s-org.page';
import { SSequencePage } from 'src/app/selectors/s-sequence/s-sequence.page';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register-assignment',
  templateUrl: './register-assignment.page.html',
  styleUrls: ['./register-assignment.page.scss'],
})
export class RegisterAssignmentPage implements OnInit {
  form = {
    isactive: '', //
    procesada: true,
    createdby: '',
    description: '',
    fecha_factura: '',
    monto: '',
    nro_control: '',
    nro_documento: '',
    org_id: '', //
    referencia: '',
    sequence_id: '', //
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
    sequence: {
      sequence_id: '',
      name: '',
      serie_id_src: {
        numero: '',
      },
    },
  };

  valid = {
    formValid: false,
    isOrgValid: true,
    isQuantityValid: true,
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

    this.valid.isQuantityValid = this.isValid('quantity');
    this.valid.isDescriptionValid = this.isValid('description');

    this.valid.formValid =
      this.valid.isOrgValid &&
      this.valid.isQuantityValid &&
      this.valid.isDescriptionValid;
  }

  isValid(field: string): boolean {
    switch (field) {
      case 'org_id':
        return this.selectors.org.org_id.trim() !== '';
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

  setDataSequence() {
    this.validateForm();
    if (this.valid.formValid) {
      let newSequence = {
        isactive: true,
        procesada: false,
        fecha_factura: '',
        monto: '',
        nro_control: '',
        nro_documento: '',
        org_id: this.selectors.org.org_id,
        referencia: '',
        sequence_id: '',
        endno: 0,
        quantity: this.form.quantity,
        description: this.form.description,
        startno: 0,
        serie: '',
        serie_id: '',
        createdby: this.authService.user.user.user_id,
        updatedby: '',
      };
      console.log('form =>', newSequence);

      this.saveAsignacion(newSequence);
    }
  }

  saveAsignacion(_data: any) {
    const query = this.apiService.registrarAsignacionContribuyente(_data);

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
