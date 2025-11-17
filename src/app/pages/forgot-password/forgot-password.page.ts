import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertsService } from 'src/app/services/alerts.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  spectacularSource: any = [];
  form = {
    user: '',
    email: '',
  };
  valid = {
    formValid: false,
    isEmailValid: true,
    isUserValid: true,
  };
  constructor(
    public http: HttpClient,
    public alertService: AlertsService,
    public apiService: ApiService,
    public router: Router
  ) {}

  ngOnInit() {
    this.generateSpectacularSource();
  }
  generateSpectacularSource() {
    const COUNT_ICONS = 25;
    const OPTIONS_ICONS = [
      'caret-back-circle',
      'documents',
      'person',
      'bookmark',
      'cube',
      'file-tray-stacked',
      'scale',
      'pricetags',
      'build',
      'card',
      'cash',
      'layers',
      'document-attach',
      'wallet',
      'chevron-forward',
      'invert-mode',
      'globe',
      'people',
      'bookmarks',
      'ticket',
      'file-tray-full',
      'prism',
      'settings',
    ];

    for (let i = 0; i < COUNT_ICONS; i++) {
      this.spectacularSource.push(
        OPTIONS_ICONS[Math.floor(Math.random() * OPTIONS_ICONS.length)]
      );
    }
  }

  validateField(field: string) {
    switch (field) {
      case 'email':
        this.valid.isEmailValid = this.isValid('email');
        break;
      case 'user':
        this.valid.isUserValid = this.isValid('user');
        break;
      // Agregar más casos según sea necesario
    }
  }
  validateForm() {
    this.valid.isEmailValid = this.isValid('email');
    this.valid.isUserValid = this.isValid('user');
    this.valid.formValid = this.valid.isUserValid && this.valid.isEmailValid;
  }
  isValid(field: string): boolean {
    switch (field) {
      case 'email':
        return this.form.email.trim() !== '';
      case 'user':
        return this.form.email.trim() !== '';
      default:
        return false;
    }
  }

  setEmail() {
    this.validateForm();
    if (this.valid.formValid) {
      let form = {
        usuario: this.form.user,
        email2: this.form.email,
      };
      console.log('FORM =>', form);

      this.sendEmail(form);
    }
  }

  async sendEmail(_data: any) {
    await this.alertService.initLoading();
    this.http.post(this.apiService.endpoint.recuperar, _data).subscribe(
      (res: any) => {
        this.alertService.cancelLoading();
        this.alertService.toastTopSuccess('Correo enviado exitosamente');
        this.router.navigate(['/login']);
      },
      (error) => {
        //console.log('ERROR =>', error);

        this.alertService.cancelLoading();
      }
    );
  }
}
