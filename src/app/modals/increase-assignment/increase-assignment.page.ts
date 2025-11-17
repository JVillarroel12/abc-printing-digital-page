import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { format } from 'date-fns';
import { SOrgPage } from 'src/app/selectors/s-org/s-org.page';
import { SSequencePage } from 'src/app/selectors/s-sequence/s-sequence.page';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-increase-assignment',
  templateUrl: './increase-assignment.page.html',
  styleUrls: ['./increase-assignment.page.scss'],
})
export class IncreaseAssignmentPage implements OnInit {
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
    isSequenceValid: true,
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
      case 'sequence_id':
        this.valid.isSequenceValid = this.isValid('sequence_id');
        break;
      case 'numero':
        this.valid.isNumeroValid = this.isValid('numero');
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
    this.valid.isSequenceValid = this.isValid('sequence_id');
    this.valid.isNumeroValid = this.isValid('numero');

    this.valid.isQuantityValid = this.isValid('quantity');
    this.valid.isDescriptionValid = this.isValid('description');

    this.valid.formValid =
      this.valid.isOrgValid &&
      this.valid.isSequenceValid &&
      this.valid.isNumeroValid &&
      this.valid.isQuantityValid &&
      this.valid.isDescriptionValid;
  }

  isValid(field: string): boolean {
    switch (field) {
      case 'org_id':
        return this.selectors.org.org_id.trim() !== '';
      case 'sequence_id':
        return this.selectors.sequence.sequence_id.trim() !== '';
      case 'numero':
        return this.selectors.sequence.serie_id_src.numero.trim() !== '';
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
  async selectorSecuencia() {
    const modal = await this.modalController.create({
      component: SSequencePage,
      cssClass: 'modal selector',
      componentProps: {
        org_id: this.selectors.org.org_id,
      },
    });
    await modal.present();

    const response = await modal.onDidDismiss();

    if (response.data) {
      this.selectors.sequence = response.data.sequence;

      console.log('SELECTORS =>', this.selectors);
    }
    this.validateField('org_id');
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
        sequence_id: this.selectors.sequence.sequence_id,
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
    const query = this.apiService.incrementarAsignacionContribuyente(_data);

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
