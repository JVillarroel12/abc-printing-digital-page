import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SOrgPage } from 'src/app/selectors/s-org/s-org.page';
import { SSeriePage } from 'src/app/selectors/s-serie/s-serie.page';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-create-serie-child',
  templateUrl: './create-serie-child.page.html',
  styleUrls: ['./create-serie-child.page.scss'],
})
export class CreateSerieChildPage implements OnInit {
  @Input('') sequence: any;
  form = {
    serie_id: '',
    org_id: '',
    sequence_id: '', // padre
  };
  valid = {
    formValid: false,
    isOrgValid: true,
    isSerieValid: true,
    isSequenceValid: true,
  };

  allDocumentType: any = [];
  selectors = {
    org: {
      org_id: '',
      name: '',
    },
    serie: {
      serie_id: '',
      numero: '',
    },
    sequence: {
      name: '',
      sequence_id: '',
      currentnextsys: 0,
      maxquantity: 0,
    },
  };

  constructor(
    public modalController: ModalController,
    public authService: AuthService,
    public apiService: ApiService,
    public servData: DataService
  ) {}

  ngOnInit() {}
  ionViewWillEnter() {
    this.selectors.org = this.sequence.org_id_src;
    this.selectors.sequence = this.sequence.sequence_id_src;
  }
  ionViewWillLeave() {}

  validateField(field: string) {
    switch (field) {
      case 'serie_id':
        this.valid.isSerieValid = this.isValid('serie_id');
        break;
      case 'org_id':
        this.valid.isOrgValid = this.isValid('org_id');
        break;
    }
  }
  validateForm() {
    this.valid.isSerieValid = this.isValid('serie_id');
    this.valid.isOrgValid = this.isValid('org_id');

    this.valid.formValid = this.valid.isSerieValid && this.valid.isOrgValid;
  }
  isValid(field: string): boolean {
    switch (field) {
      case 'serie_id':
        return this.selectors.serie.serie_id.trim() !== '';
      case 'org_id':
        return this.selectors.org.org_id.trim() !== '';
      default:
        return false;
    }
  }
  async selectorSerie() {
    const modal = await this.modalController.create({
      component: SSeriePage,
      cssClass: 'modal selector',
    });
    await modal.present();

    const response = await modal.onDidDismiss();

    if (response.data) {
      this.selectors.serie = response.data.serie;

      this.validateField('serie_id');
    }
  }
  setDataSerie() {
    this.validateForm();
    if (this.valid.formValid) {
      let newSequence = {
        serie_id: this.selectors.serie.serie_id,
        org_id: this.selectors.org.org_id,
        sequence_id: this.selectors.sequence.sequence_id, // padre
      };
      this.saveSerie(newSequence);
    }
  }

  saveSerie(_data: any) {
    const query = this.apiService.createSequenceChild(_data);

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
