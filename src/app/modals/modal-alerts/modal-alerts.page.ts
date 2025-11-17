import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-alerts',
  templateUrl: './modal-alerts.page.html',
  styleUrls: ['./modal-alerts.page.scss'],
})
export class ModalAlertsPage implements OnInit {
  @ViewChild('btnCloseModal') btnCloseModal: ElementRef | any;
  @Input('') header:any;
  @Input('') content:any;
  @Input('') mode:any;
  @Input('') confirm:any;
  @Input('') close:any;
  blockKeydown = true;
  timeoutId: any
  constructor(
    private modalController: ModalController
  ) { }
  ngOnInit() {

    if(this.close == 'Y' && this.confirm == 'Y'){
      this.timeoutId = setTimeout(() => {
        this.closeModal();
      }, 5000);
    }
    if(this.close == 'Y' && this.confirm == 'N'){
      this.timeoutId = setTimeout(() => {
        this.closeModal();
      }, 2000);
    }
    if(this.confirm == 'Y'){

    }

  }
  ngOnDestroy(){
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
  ionViewWillEnter(){
    setTimeout(() => {
      this.btnCloseModal.nativeElement.focus();     
    }, 200);
  }

  closeModal(){
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
      this.modalController.dismiss({
        process: 'success'
      })

  }
}
