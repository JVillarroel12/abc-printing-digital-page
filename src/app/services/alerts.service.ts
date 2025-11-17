import { EventEmitter, Injectable } from '@angular/core';
import {
  LoadingController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { ModalAlertsPage } from '../modals/modal-alerts/modal-alerts.page';

@Injectable({
  providedIn: 'root',
})
export class AlertsService {
  loading: any;
  blockKeydown = false;
  constructor(
    private modalController: ModalController,
    public loadingController: LoadingController,
    public toastController: ToastController
  ) {}

  async initLoading() {
    this.loading = await this.loadingController.create({
      message: 'Cargando...',
      spinner: 'bubbles',
      cssClass: 'loading',
    });
    await this.loading.present();
  }
  async cancelLoading() {
    await this.loading.dismiss();
  }

  async modalError(_header: string, _content: string) {
    const modal = await this.modalController.create({
      component: ModalAlertsPage,
      componentProps: {
        header: _header,
        content: _content,
        mode: 'error',
        confirm: 'Y',
        close: 'Y',
      },
      cssClass: 'modal alerts',
    });
    modal.present();
    const modalResponse = await modal.onDidDismiss();

    if (modalResponse['data'] != undefined) {
    } else {
    }
    return modalResponse;
  }
  async modalSuccess(_header: string, _content: string) {
    const modal = await this.modalController.create({
      component: ModalAlertsPage,
      componentProps: {
        header: _header,
        content: _content,
        mode: 'success',
        confirm: 'N',
        close: 'Y',
      },
      cssClass: 'modal alerts',
    });
    modal.present();
    const modalResponse = await modal.onDidDismiss();
    if (modalResponse['data'] != undefined) {
      //this.navController.navigateRoot('/view-sales', {animated: true, animationDirection: 'forward'});
    } else {
    }
  }
  async modalWarning(_header: string, _content: string) {
    const modal = await this.modalController.create({
      component: ModalAlertsPage,
      componentProps: {
        header: _header,
        content: _content,
        mode: 'warning',
        confirm: 'Y',
        close: 'N',
      },
      cssClass: 'modal alerts',
    });
    modal.present();
    const modalResponse = await modal.onDidDismiss();

    if (modalResponse['data'] != undefined) {
    } else {
    }
    return modalResponse;
  }

  async toastTopSuccess(msg: any) {
    const toast = await this.toastController.create({
      message: msg,
      position: 'top',
      color: 'success',
      duration: 2000,
      cssClass: 'toastCss',
    });
    toast.present();
  }

  async toastBottomSuccess(msg: any) {
    const toast = await this.toastController.create({
      message: msg,
      position: 'top',
      color: 'danger',
      duration: 2000,
      cssClass: 'toastCss',
    });
    toast.present();
  }

  async toastTopError(msg: any) {
    const toast = await this.toastController.create({
      message: msg,
      position: 'top',
      color: 'danger',
      duration: 2000,
      cssClass: 'toastCss',
      buttons: [
        {
          side: 'start',
          icon: 'warning',
        },
      ],
    });
    toast.present();
  }
  async toastBottomError(msg: any) {
    const toast = await this.toastController.create({
      message: msg,
      position: 'bottom',
      color: 'danger',
      duration: 2000,
      cssClass: 'toastCss',
      buttons: [
        {
          side: 'start',
          icon: 'warning',
        },
      ],
    });
    toast.present();
  }
}
