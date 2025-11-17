import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { ProfileComponent } from 'src/app/components/popovers/profile/profile.component';
import { ContactPage } from 'src/app/modals/contact/contact.page';
import { AlertsService } from 'src/app/services/alerts.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-select-mode',
  templateUrl: './select-mode.page.html',
  styleUrls: ['./select-mode.page.scss'],
})
export class SelectModePage implements OnInit {
  constructor(
    public popoverController: PopoverController,
    public modalController: ModalController,
    public router: Router,
    public authService: AuthService,
    public alertService: AlertsService
  ) {}

  ngOnInit() {
    console.log('USER =>', this.authService.user);
    if (this.authService.user.user.user_id == '') {
      this.alertService.modalError('Ha ocurrido un error', 'Error de sesión');
      this.authService.logout();
    }
    this.authService.menuItems
      .slice(0, -1)
      .forEach((item) => (item.view = false));
    this.authService.menuItems = [...this.authService.menuItems];
  }
  ionViewWillEnter() {
    console.log('äaaaaaaaaa');

    console.log('=>', this.authService.user.user.user_i);
  }

  async openModalContact() {
    const modal = await this.modalController.create({
      component: ContactPage,
      cssClass: 'modal contact',
    });
    modal.present();
  }

  changePage(_mode: string) {
    switch (_mode) {
      case 'contribuyente':
        this.authService.mode = 'contribuyente';

        if (this.authService.user.user.desc_catalogo == 'NORMAL') {
          this.authService.menuItems[0].view = true;
          this.authService.menuItems[1].view = true;
          this.authService.menuItems[3].view = true;
          this.authService.menuItems = [...this.authService.menuItems];
          this.router.navigate(['/view-home']);
        }
        if (this.authService.user.user.desc_catalogo == 'SENIAT') {
          this.authService.menuItems[0].view = true;
          this.authService.menuItems[1].view = true;
          this.authService.menuItems[7].view = true;
          this.authService.menuItems = [...this.authService.menuItems];
          this.router.navigate(['/contribuyentes']);
        }
        if (this.authService.user.user.desc_catalogo == 'SUPER') {
          this.authService.menuItems[0].view = true;
          this.authService.menuItems[1].view = true;
          this.authService.menuItems[2].view = true;
          this.authService.menuItems[3].view = true;
          this.authService.menuItems[4].view = true;
          this.authService.menuItems[5].view = true;
          this.authService.menuItems[6].view = true;
          this.authService.menuItems[7].view = true;
          this.authService.menuItems = [...this.authService.menuItems];
          this.router.navigate(['/view-home']);
        }
        break;

      case 'imprenta':
        this.authService.mode = 'imprenta';

        if (this.authService.user.user.desc_catalogo == 'NORMAL') {
          this.alertService.modalError(
            'Permiso Denegado',
            'El usuario no posee permisos para realizar esta acción'
          );
          return;
        }
        if (this.authService.user.user.desc_catalogo == 'SENIAT') {
          this.authService.menuItems[0].view = true;
          this.authService.menuItems[1].view = true;
          this.authService.menuItems[2].view = true;
          this.authService.menuItems[7].view = true;
          this.authService.menuItems = [...this.authService.menuItems];
          this.router.navigate(['/view-home']);
        }
        break;

      default:
        break;
    }
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
        this.authService.logout();
        break;
    }
  }
  logout() {
    this.authService.logout();
  }
}
