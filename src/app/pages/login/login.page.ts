import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AlertsService } from 'src/app/services/alerts.service';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild('userInput') userInput!: ElementRef<HTMLInputElement>;
  spectacularSource: any = [];

  form = {
    user: '',
    password: '',
  };

  constructor(
    public router: Router,
    public modalController: ModalController,
    public authService: AuthService,
    public apiService: ApiService,
    public http: HttpClient,
    public alertService: AlertsService
  ) {}

  ngOnInit() {
    this.generateSpectacularSource();
  }

  ionViewWillEnter() {
    //this.authService.resetSession()
    setTimeout(() => {
      this.userInput.nativeElement.focus();
    }, 50);
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

  pressLogin(_event: any) {
    if (_event.keyCode == 13) {
      this.onLogin();
    }
  }

  async onLogin() {
    await this.alertService.initLoading();
    let login = {
      usuario: this.form.user,
      clave: this.form.password,
    };

    const query = this.apiService.postLogin(login);

    query.subscribe(
      (data: any) => {
        this.authService.user = data;
        this.alertService.cancelLoading();
        this.router.navigate(['/select-mode']);
      },
      (error: any) => {
        //console.log('ERROR =>', error);

        this.alertService.cancelLoading();
      }
    );
  }

  gotoForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
}
