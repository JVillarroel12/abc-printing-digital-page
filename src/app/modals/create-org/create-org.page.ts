import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-create-org',
  templateUrl: './create-org.page.html',
  styleUrls: ['./create-org.page.scss'],
})
export class CreateOrgPage implements OnInit {
  form = {
    name: '',
    social_name: '',
    typevalue: '',
    value: '',
    contribuyente_especial: false,
    isactive: true,
    numeracion_automatica: false,
    description: '',
    email: '',
    email2: '',
    phone: '',
    phone2: '',
    issummary: false,
  };
  valid = {
    formValid: false,
    isNameValid: true,
    isSocialNameValid: true,
    isValueValid: true,
    isEmailValid: true,
    isPhoneValid: true,
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
      catalogo_id: '',
      descripcion: '',
      nombre: 'TIPO DE IDENTIFICACION',
      valor: '',
    },
    date_columns: [],
    boolean_columns: [],
    numeric_columns: [],
    auxiliar: [],
  };
  majorListSubjet?: Subscription;
  allDocumentType: any = [];
  constructor(
    public modalController: ModalController,
    public authService: AuthService,
    public apiService: ApiService,
    public servData: DataService
  ) {}

  ngOnInit() {
    this.majorQuery();
    this.majorListSubscription();
  }
  ionViewWillLeave() {
    this.majorListUnsubscription();
  }
  majorListSubscription() {
    this.majorListSubjet = this.servData
      .subscribeCatalogs()
      .subscribe((resp: any) => {
        this.allDocumentType = resp;
        if (resp.length > 0) {
        }
      });
  }
  majorListUnsubscription() {
    this.majorListSubjet?.unsubscribe();
  }
  majorQuery() {
    this.apiService.getCatalog_byFilter(this.filter);
  }
  validateField(field: string) {
    switch (field) {
      case 'name':
        this.valid.isNameValid = this.isValid('name');
        break;
      case 'social_name':
        this.valid.isSocialNameValid = this.isValid('social_name');
        break;
      case 'value':
        this.valid.isValueValid = this.isValid('value');
        break;
      case 'email':
        this.valid.isEmailValid = this.isValid('email');
        break;
      case 'phone':
        this.valid.isPhoneValid = this.isValid('phone');
        break;
    }
  }
  validateForm() {
    this.valid.isNameValid = this.isValid('name');
    this.valid.isSocialNameValid = this.isValid('social_name');
    this.valid.isValueValid = this.isValid('value');
    this.valid.isEmailValid = this.isValid('email');
    this.valid.isPhoneValid = this.isValid('phone');

    this.valid.formValid =
      this.valid.isSocialNameValid &&
      this.valid.isValueValid &&
      this.valid.isEmailValid &&
      this.valid.isPhoneValid &&
      this.valid.isNameValid;
  }
  isValid(field: string): boolean {
    switch (field) {
      case 'name':
        return this.form.name.trim() !== '';
      case 'social_name':
        return this.form.social_name.trim() !== '';
      case 'value':
        return this.form.value.trim() !== '';
      case 'email':
        return this.form.email.trim() !== '';
      case 'phone':
        return this.form.phone.trim() !== '';
      default:
        return false;
    }
  }

  setDataOrg() {
    this.validateForm();
    if (this.valid.formValid) {
      let newOrg = {
        name: this.form.name,
        social_name: this.form.social_name,
        tipo_identificacion: this.form.typevalue,
        value: this.form.value,
        contribuyente_especial: this.form.contribuyente_especial,
        isactive: true,
        description: this.form.description,
        email: this.form.email,
        email2: this.form.email2,
        phone: this.form.phone,
        phone2: this.form.phone2,
        createdby: this.authService.user.user.user_id,
        issummary: this.form.issummary,
        numeracion_automatica: this.form.numeracion_automatica,
        updatedby: '',
      };

      this.saveOrg(newOrg);
    }
  }

  saveOrg(_data: any) {
    const query = this.apiService.createorg(_data);

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
