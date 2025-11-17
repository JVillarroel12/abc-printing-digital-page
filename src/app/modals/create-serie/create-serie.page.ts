import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SOrgPage } from 'src/app/selectors/s-org/s-org.page';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-create-serie',
  templateUrl: './create-serie.page.html',
  styleUrls: ['./create-serie.page.scss'],
})
export class CreateSeriePage implements OnInit {
  form = {
    createdby: '',
    isactive: true,
    numero: '',
    org_id: '',
  };
  valid = {
    formValid: false,
    isOrgValid: true,
    isNumeroValid: true,
  };

  allDocumentType: any = [];
  selectors = {
    org: {
      org_id: '',
      name: '',
    },
    serie: {
      name: '',
    },
  };

  constructor(
    public modalController: ModalController,
    public authService: AuthService,
    public apiService: ApiService,
    public servData: DataService
  ) {}

  ngOnInit() {}
  ionViewWillLeave() {}

  validateField(field: string) {
    switch (field) {
      case 'numero':
        this.valid.isNumeroValid = this.isValid('numero');
        break;
      case 'org_id':
        this.valid.isOrgValid = this.isValid('org_id');
        break;
    }
  }
  validateForm() {
    this.valid.isNumeroValid = this.isValid('numero');
    this.valid.isOrgValid = this.isValid('org_id');

    this.valid.formValid = this.valid.isNumeroValid && this.valid.isOrgValid;
  }
  isValid(field: string): boolean {
    switch (field) {
      case 'numero':
        return this.form.numero.trim() !== '';
      case 'org_id':
        return this.selectors.org.org_id.trim() !== '';
      default:
        return false;
    }
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
      this.validateField('org_id');
    }
  }
  setDataSerie() {
    this.validateForm();
    if (this.valid.formValid) {
      let newSerie = {
        isactive: true,
        numero: this.form.numero,
        org_id: this.selectors.org.org_id,
        createdby: this.authService.user.user.user_id,
        updatedby: '',
      };
      this.saveSerie(newSerie);
    }
  }

  saveSerie(_data: any) {
    const query = this.apiService.createSerie(_data);

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
