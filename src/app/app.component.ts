import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
  MenuController,
  ModalController,
  PopoverController,
} from '@ionic/angular';
import { filter } from 'rxjs/operators';
import { ProfileComponent } from './components/popovers/profile/profile.component';
import { ContactPage } from './modals/contact/contact.page';
import { AuthService } from './services/auth.service';
import { AlertsService } from './services/alerts.service';
import { ConfigService } from './services/config.service';
interface MenuItem {
  label: string;
  icon: string;
  view: boolean;
  isOpen?: boolean; // Asegúrate de que esté definida
  subItems: any[];
  id?: string;
  routerLink?: string;
  // otras propiedades...
}
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  isMenuOpen = true;
  isDocumentsOpen = false;
  isLoginPage = true;
  routeChecked = false;
  selectedMenuItem: string = '';
  public menuItems: any = [];

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public popoverController: PopoverController,
    public modalController: ModalController,
    public authService: AuthService,
    public alertService: AlertsService,
    private configService: ConfigService,
    private menuController: MenuController
  ) {
    this.isMenuOpen = true;
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        this.isLoginPage =
          event.urlAfterRedirects.includes('/login') ||
          event.urlAfterRedirects.includes('/select-mode') ||
          event.urlAfterRedirects.includes('/contribuyentes') ||
          event.urlAfterRedirects.includes('/forgot-password');
        this.routeChecked = true;
      });
  }
  ngOnInit() {
    //this.loadAppConfig();
  }
  openMobileMenu() {
    this.menuController.open('mobile-menu');
  }
  toggleSubMenu(item: any) {
    item.isOpen = !item.isOpen;
  }
  navigationComponent(item: any) {
    // this.authService.orgSelected = {
    //   org_id: '',
    // };
    switch (item.label) {
      case 'Usuarios':
        if (this.authService.user.user.desc_catalogo == 'NORMAL') {
          this.alertService.modalError(
            'Permiso Denegado',
            'El usuario no posee permisos para realizar esta acción'
          );
          return;
        }
        break;
      case 'Organizaciones':
        if (this.authService.user.user.desc_catalogo == 'NORMAL') {
          this.alertService.modalError(
            'Permiso Denegado',
            'El usuario no posee permisos para realizar esta acción'
          );
          return;
        }
        break;
      case 'Terceros':
        if (this.authService.user.user.desc_catalogo == 'NORMAL') {
          this.alertService.modalError(
            'Permiso Denegado',
            'El usuario no posee permisos para realizar esta acción'
          );
          return;
        }
        break;
      case 'Doc. Recibidos':
        if (this.authService.user.user.desc_catalogo == 'SENIAT') {
          this.alertService.modalError(
            'Permiso Denegado',
            'El usuario no posee permisos para realizar esta acción'
          );
          return;
        }
        break;
      default:
        break;
    }
    if (item.link != '') {
      // O usando state (no aparece en la URL)
      this.router.navigate([item.link], {
        replaceUrl: true, // Reemplaza la URL actual
      });

      this.selectMenuItem(item.id);
    }
  }
  selectMenuItem(item: string) {
    // this.authService.orgSelected = {
    //   org_id: '',
    // };
    this.selectedMenuItem = item;
  }

  handleMenuItemClick(item: any) {
    if (item.subItems && item.subItems.length > 0) {
      this.toggleSubMenu(item);
    } else {
      this.menuController.close('mobile-menu');
      this.authService.selectedMenuItem = item;
      this.navigationComponent(item);
      this.selectMenuItem(item.label || item.id);
    }
  }
  handleSubItemClick(subItem: any) {
    if (subItem.subItems && subItem.subItems.length > 0) {
      // Si tiene subItems, abre/cierra (Nivel 2 -> Nivel 3)
      this.toggleSubMenu(subItem);
    } else {
      // Es un enlace navegable
      this.menuController.close('mobile-menu');
      this.authService.selectedMenuItem = subItem;
      this.navigationComponent(subItem);
      this.selectMenuItem(subItem.label || subItem.id);
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
  async openModalContact() {
    const modal = await this.modalController.create({
      component: ContactPage,
      cssClass: 'modal contact',
    });
    modal.present();
  }
  async toggleMenu() {}
  back() {
    this.router.navigate(['/select-mode']);
  }
}
