import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SOrgPage } from 'src/app/selectors/s-org/s-org.page';
import { SPreffixPage } from 'src/app/selectors/s-preffix/s-preffix.page';
import { SSeriePage } from 'src/app/selectors/s-serie/s-serie.page';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-create-sequence',
  templateUrl: './create-sequence.page.html',
  styleUrls: ['./create-sequence.page.scss'],
})
export class CreateSequencePage implements OnInit {
  form = {
    is_default: false,
    org_id: '',
    name: '',
    description: '',
    serie: '',
    prefix: '',
    suffix: '',
    startno: 0,

    maxquantity: 0,
  };

  selectors = {
    org: {
      org_id: '',
      name: '',
    },
    serie: {
      numero: '',
      serie_id: '',
    },
    prefix: {
      name: 'A',
      prefix_id: 'A',
    },
  };
  valid = {
    formValid: false,
    isOrgValid: true,
    isSerieValid: true,
    isNameValid: true,
    isPrefixValid: true,
    isSuffixValid: true,
    isStartnoValid: true,

    isMaxquantityValid: true,
  };

  constructor(
    public modalController: ModalController,
    public apiService: ApiService,
    public authService: AuthService
  ) {}

  ngOnInit() {}

  validateField(field: string) {
    switch (field) {
      case 'org_id':
        this.valid.isOrgValid = this.isValid('org_id');
        break;
      case 'name':
        this.valid.isNameValid = this.isValid('name');
        break;
      case 'prefix_id':
        this.valid.isPrefixValid = this.isValid('prefix_id');
        break;
      case 'serie_id':
        this.valid.isSerieValid = this.isValid('serie_id');
        break;
      case 'suffix':
        this.valid.isSuffixValid = this.isValid('suffix');
        break;
      case 'startno':
        this.valid.isStartnoValid = this.isValid('startno');
        break;
      case 'maxquantity':
        this.valid.isMaxquantityValid = this.isValid('maxquantity');
        break;
    }
  }
  validateForm() {
    this.valid.isOrgValid = this.isValid('org_id');
    this.valid.isNameValid = this.isValid('name');
    this.valid.isPrefixValid = this.isValid('prefix_id');
    this.valid.isSerieValid = this.isValid('serie_id');
    this.valid.isSuffixValid = this.isValid('suffix');
    this.valid.isStartnoValid = this.isValid('startno');

    this.valid.isMaxquantityValid = this.isValid('maxquantity');

    this.valid.formValid =
      this.valid.isNameValid &&
      this.valid.isPrefixValid &&
      this.valid.isSerieValid &&
      this.valid.isSuffixValid &&
      this.valid.isStartnoValid &&
      this.valid.isMaxquantityValid &&
      this.valid.isOrgValid;
  }
  isValid(field: string): boolean {
    switch (field) {
      case 'org_id':
        return this.selectors.org.org_id.trim() !== '';
      case 'name':
        return this.form.name.trim() !== '';
      case 'serie_id':
        return this.selectors.serie.serie_id.trim() !== '';
      case 'prefix_id':
        return this.selectors.prefix.prefix_id.trim() !== '';
      case 'suffix':
        return this.selectors.prefix.prefix_id.trim() !== '';
      case 'startno':
        return this.form.startno !== null;
      case 'maxquantity':
        return this.form.maxquantity !== null;
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
    }
    this.validateField('org_id');
  }
  async selectorPrefix() {
    const modal = await this.modalController.create({
      component: SPreffixPage,
      cssClass: 'modal selector',
    });
    await modal.present();

    const response = await modal.onDidDismiss();

    if (response.data) {
      this.selectors.prefix = response.data.prefix;
    }
    this.validateField('prefix_id');
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
  setDataSequence() {
    this.validateForm();
    if (this.valid.formValid) {
      let newSequence = {
        is_default: this.form.is_default,
        org_id: this.selectors.org.org_id,
        name: this.form.name,
        description: this.form.description,
        prefix: this.selectors.prefix.name,
        suffix: this.form.suffix,
        startno: this.form.startno,
        serie_id: this.selectors.serie.serie_id,
        maxquantity: this.form.maxquantity,
        createdby: this.authService.user.user.user_id,
        updatedby: '',
      };

      this.saveSequence(newSequence);
    }
  }
  saveSequence(_data: any) {
    const query = this.apiService.createSequence(_data);

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
