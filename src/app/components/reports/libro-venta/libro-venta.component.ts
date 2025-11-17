import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { format } from 'date-fns';
import { SOrgPage } from 'src/app/selectors/s-org/s-org.page';
import { AlertsService } from 'src/app/services/alerts.service';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { FilterService } from 'src/app/services/filter.service';
import { PrintService } from 'src/app/services/print.service';

@Component({
  selector: 'app-libro-venta',
  templateUrl: './libro-venta.component.html',
  styleUrls: ['./libro-venta.component.scss'],
})
export class LibroVentaComponent implements OnInit {
  form = {
    type: '',
    fechaInicio: '',
    fechaFin: '',
    sucursal: '',
    serie: '',
    rif_type: '',
    mesSeleccionado: '',
  };
  selectors = {
    org: {
      org_id: '',
      name: '',
    },
  };
  valid = {
    formValid: false,
    isOrgValid: true,
  };
  allDocuments: any = [];
  constructor(
    public filterService: FilterService,
    public apiService: ApiService,
    public printService: PrintService,
    public modalController: ModalController,
    public authService: AuthService,
    public alertService: AlertsService
  ) {}

  ngOnInit() {
    if (this.authService.user.user.user_id == '') {
      this.alertService.modalError('Ha ocurrido un error', 'Error de sesión');
      this.authService.logout();
    }
    let defaultInicio = new Date();
    defaultInicio.setHours(0, 0, 0, 0);
    let defaultInicio2 = new Date(
      defaultInicio.getTime() - defaultInicio.getTimezoneOffset() * 60000
    );
    this.form.fechaInicio = defaultInicio2.toISOString().slice(0, 16);

    let defaultFinal = new Date();
    defaultFinal.setHours(23, 59, 0, 0);
    let defaultFinal2 = new Date(
      defaultFinal.getTime() - defaultFinal.getTimezoneOffset() * 60000
    );
    this.form.fechaFin = defaultFinal2.toISOString().slice(0, 16);
  }
  onInicioDateChange(event: any) {
    const selectedDate = event.target.value;
    this.form.fechaInicio = this.formatDate(selectedDate);
  }
  onFinDateChange(event: any) {
    const selectedDate = event.target.value;
    this.form.fechaFin = this.formatDate(selectedDate);
  }
  formatDate(dateValue: string) {
    const date = new Date(dateValue);
    return format(date, 'yyyy-MM-dd HH:mm');
  }
  onMonthChange(event: any) {
    const selectedMonth = event.target.value; // Formato YYYY-MM

    if (selectedMonth) {
      // Primer día del mes seleccionado (a las 00:00 horas)
      const startDate = new Date(selectedMonth + '-01T00:00:00');
      this.form.fechaInicio = format(startDate, 'yyyy-MM-dd HH:mm');

      // Último día del mes seleccionado (a las 23:59 horas)
      const endDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth() + 1, // Avanzamos al siguiente mes
        0, // Día 0 del siguiente mes = último día del mes actual
        23,
        59,
        59 // Hora 23:59:59
      );
      this.form.fechaFin = format(endDate, 'yyyy-MM-dd HH:mm');

      // Llamar a tu función de filtrado
      this.filtrarPorMes();
    }
  }

  // Método opcional para ejecutar el filtrado
  filtrarPorMes() {
    // Aquí puedes llamar a tu servicio o función que necesita las fechas
    // Ejemplo:
    // this.obtenerVentas(this.form.fechaInicio, this.form.fechaFin);
  }
  validateField(field: string) {
    switch (field) {
      case 'org_id':
        this.valid.isOrgValid = this.isValid('org_id');
        break;
    }
  }
  validateForm() {
    this.valid.isOrgValid = this.isValid('org_id');

    this.valid.formValid = this.valid.isOrgValid;
  }
  isValid(field: string): boolean {
    switch (field) {
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

  async getAllDocument(_type: string) {
    await this.alertService.initLoading();
    if (this.authService.user.user.desc_catalogo == 'NORMAL') {
      this.selectors.org.org_id = '1';
    }
    this.validateForm();
    if (this.valid.formValid) {
      let desde = new Date(this.form.fechaInicio).getTime();
      let hasta = new Date(this.form.fechaFin).getTime();
      let auxOrg =
        this.authService.user.user.desc_catalogo == 'NORMAL'
          ? null
          : this.selectors.org.org_id;
      let obj = {
        tipo_documento: '%',
        org_id: auxOrg,
        desde: desde,
        hasta: hasta,
      };

      const query = this.apiService.getAllDocumentLibroVenta(obj);

      query.subscribe(
        (data: any) => {
          this.allDocuments = data;
          if (_type == 'excel') {
            this.printService.generarLibroVentasExcel(this.allDocuments, obj);
          }
          if (_type == 'pdf') {
            this.printService.generateLibroVentaPDF(
              data,
              this.form.mesSeleccionado
            );
          }
          this.alertService.cancelLoading();
        },
        (error) => {
          this.alertService.cancelLoading();
        }
      );
    }
  }
}
