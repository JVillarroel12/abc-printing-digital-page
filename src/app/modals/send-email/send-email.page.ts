import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { AlertsService } from 'src/app/services/alerts.service';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.page.html',
  styleUrls: ['./send-email.page.scss'],
})
export class SendEmailPage implements OnInit {
  @Input('') document: any;

  form = {
    email1: '',
    email2: '',
    email3: '',
    email4: '',
  };
  valid = {
    formValid: false,

    isEmailValid: true,
  };

  constructor(
    public modalController: ModalController,
    public authService: AuthService,
    public apiService: ApiService,
    public http: HttpClient,
    public alertService: AlertsService
  ) {}

  ngOnInit() {}
  validateField(field: string) {
    switch (field) {
      case 'org_id':

      case 'email':
        this.valid.isEmailValid = this.isValid('email');
        break;
      // Agregar más casos según sea necesario
    }
  }
  validateForm() {
    this.valid.isEmailValid = this.isValid('email');

    this.valid.formValid = this.valid.isEmailValid;
  }
  isValid(field: string): boolean {
    switch (field) {
      case 'email':
        return this.form.email1.trim() !== '';
      default:
        return false;
    }
  }

  setDataUser() {
    this.validateForm();
    if (this.valid.formValid) {
      let correos = {
        correos: Object.values(this.form).filter((email) => email !== ''),
        documento_id: this.document.documento_id,
      };

      this.saveUser(correos);
    }
  }
  async saveUser(_data: any) {
    await this.alertService.initLoading();
    this.http.post(this.apiService.endpoint.sendDocument, _data).subscribe(
      (res: any) => {
        this.alertService.cancelLoading();
        this.closeModal();
        this.alertService.toastTopSuccess('Correo enviado exitosamente');
      },
      (error) => {
        this.alertService.cancelLoading();
      }
    );
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
