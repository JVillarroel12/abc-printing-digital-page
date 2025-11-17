import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SCatalogPage } from 'src/app/selectors/s-catalog/s-catalog.page';
import { SOrgPage } from 'src/app/selectors/s-org/s-org.page';
import { SSeriePage } from 'src/app/selectors/s-serie/s-serie.page';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.page.html',
  styleUrls: ['./create-user.page.scss'],
})
export class CreateUserPage implements OnInit {
  @Input('') mode: any;
  @Input('') user: any;

  general = {
    titleButton: 'Crear',
  };
  form = {
    isactive: true,
    isportal: false,
    email: '',
    email2: '',
    createdby: '',
    updateby: '',
  };
  valid = {
    formValid: false,
    isOrgValid: true,
    isCatalogoValid: true,
    isEmailValid: true,
  };
  selectors = {
    org: {
      org_id: '',
      name: '',
    },

    catalogo: {
      descripcion: '',
      catalogo_id: '',
    },
  };
  constructor(
    public modalController: ModalController,
    public authService: AuthService,
    public apiService: ApiService
  ) {}

  ngOnInit() {
    switch (this.mode) {
      case 'create':
        break;
      case 'edit':
        this.general.titleButton = 'Editar';
        this.form.isactive = this.user.isactive;
        this.form.isportal = this.user.isportal;
        this.form.createdby = this.user.createdby;
        this.form.email = this.user.email;
        this.selectors.org = {
          org_id: this.user.org_id_src.org_id,
          name: this.user.org_id_src.name,
        };
        this.selectors.catalogo = {
          descripcion: this.user.desc_catalogo,
          catalogo_id: this.user.catalogo_id,
        };

        // updatedby: ''

        break;
      default:
        break;
    }
  }
  validateField(field: string) {
    switch (field) {
      case 'org_id':
        this.valid.isOrgValid = this.isValid('org_id');
        break;

      case 'catalogo_id':
        this.valid.isCatalogoValid = this.isValid('catalogo_id');
        break;

      case 'email':
        this.valid.isEmailValid = this.isValid('email');
        break;

      // Agregar más casos según sea necesario
    }
  }
  validateForm() {
    this.valid.isOrgValid = this.isValid('org_id');
    this.valid.isCatalogoValid = this.isValid('catalogo_id');
    this.valid.isEmailValid = this.isValid('email');
    this.valid.formValid =
      this.valid.isOrgValid &&
      this.valid.isEmailValid &&
      this.valid.isCatalogoValid;
  }
  isValid(field: string): boolean {
    switch (field) {
      case 'org_id':
        return this.selectors.org.org_id.trim() !== '';

      case 'email':
        return this.form.email.trim() !== '';
      case 'catalogo_id':
        return this.selectors.catalogo.catalogo_id.trim() !== '';
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
  async selectorCatalogo() {
    const modal = await this.modalController.create({
      component: SCatalogPage,
      cssClass: 'modal selector',
      componentProps: {
        name: 'TIPO DE USUARIO',
      },
    });
    await modal.present();

    const response = await modal.onDidDismiss();

    if (response.data) {
      this.selectors.catalogo = response.data.catalogo;
      this.validateField('catalogo_id');
    }
  }

  setDataUser() {
    this.validateForm();
    if (this.valid.formValid) {
      if (this.mode == 'create') {
        let newUser = {
          isactive: true,
          isportal: this.form.isportal,
          createdby: this.authService.user.user.user_id,
          email: this.form.email,
          org_id: this.selectors.org.org_id,

          catalogo_id: this.selectors.catalogo.catalogo_id,
          desc_catalogo: this.selectors.catalogo.descripcion,
          updatedby: '',
        };

        this.saveUser(newUser);
      }
      if (this.mode == 'edit') {
        let newUser = {
          isactive: true,
          isportal: this.form.isportal,
          createdby: this.authService.user.user.user_id,
          email: this.form.email,
          user_id: this.user.user_id,
          org_id: this.selectors.org.org_id,
          catalogo_id: this.selectors.catalogo.catalogo_id,
          desc_catalogo: this.selectors.catalogo.descripcion,
          updatedby: this.authService.user.user.user_id,
        };

        this.updateUser(newUser);
      }
    }
  }
  saveUser(_data: any) {
    const query = this.apiService.createUser(_data);

    query.subscribe(
      (data: any) => {
        this.modalController.dismiss({
          proccess: true,
        });
      },
      (error: any) => {}
    );
  }
  async updateUser(_data: any) {
    (
      await this.apiService.setPutItem({
        users: [_data],
      })
    ).subscribe(
      (res: any) => {
        this.modalController.dismiss({
          register: 'Y',
          users: res.users[0],
        });
      },
      (error) => {}
    );
  }
  closeModal() {
    this.modalController.dismiss();
  }
}
