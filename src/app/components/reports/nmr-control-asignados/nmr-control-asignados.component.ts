import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { SOrgPage } from 'src/app/selectors/s-org/s-org.page';
import { AlertsService } from 'src/app/services/alerts.service';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { FilterService } from 'src/app/services/filter.service';
import { PrintService } from 'src/app/services/print.service';

@Component({
  selector: 'app-nmr-control-asignados',
  templateUrl: './nmr-control-asignados.component.html',
  styleUrls: ['./nmr-control-asignados.component.scss'],
})
export class NmrControlAsignadosComponent implements OnInit {
  form = {
    firstAnioSeleccionado: null,
    lastAnioSeleccionado: null,
    firstAnio: '',
    lastAnio: '',
    firstMesSeleccionado: null,
    firstMes: '',
    lastMesSeleccionado: null,
    lastMes: '',
    fecha: '',
    anual: false,
    mensual: false,
    semanal: false,
    diario: false,
  };
  isRangeValid: boolean = true;
  maxRange: number = 6;

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
  years = Array.from({ length: 11 }, (_, i) => 2020 + i);
  constructor(
    public filterService: FilterService,
    public apiService: ApiService,
    public printService: PrintService,
    public modalController: ModalController,
    public authService: AuthService,
    public alertService: AlertsService
  ) {}

  ngOnInit() {
    console.log('ÖRG =>', this.authService.orgSelected);
    console.log('AUTH =>', this.authService.user);

    if (this.authService.user.user.user_id == '') {
      this.alertService.modalError('Ha ocurrido un error', 'Error de sesión');
      this.authService.logout();
    }
  }
  formatDate(dateValue: string) {
    const date = new Date(dateValue);
    return format(date, 'yyyy-MM-dd HH:mm');
  }
  onFirstYearChange(event: any) {
    console.log('Año seleccionado:', this.form.firstAnioSeleccionado);
    this.form.firstAnio = `01/01/${this.form.firstAnioSeleccionado}`;
    this.validateYearRange();
  }
  onLastYearChange(event: any) {
    console.log('Año seleccionado:', this.form.lastAnioSeleccionado);
    this.form.lastAnio = `01/01/${this.form.lastAnioSeleccionado}`;
    this.validateYearRange();
  }
  validateYearRange(): void {
    // Solo validamos si ambos años han sido seleccionados
    if (this.form.firstAnioSeleccionado && this.form.lastAnioSeleccionado) {
      // Convertimos los años seleccionados a números para la comparación
      const firstYear = Number(this.form.firstAnioSeleccionado);
      const lastYear = Number(this.form.lastAnioSeleccionado);

      // Validar si el año final es menor que el inicial
      if (lastYear < firstYear) {
        this.isRangeValid = false;
        return; // Detenemos si hay un error de orden
      }

      // Validar el rango máximo de años (diferencia <= 6)
      const yearDifference = lastYear - firstYear;

      if (yearDifference > this.maxRange) {
        this.isRangeValid = false;
        this.form.firstAnioSeleccionado = null;
        this.form.lastAnioSeleccionado = null;
        this.alertService.modalError(
          'Error',
          'Solo se puede seleccionar hasta un rango de 6 años'
        );
      } else {
        this.isRangeValid = true;
      }
    } else {
      // Si falta alguno, asumimos que es válido temporalmente
      this.isRangeValid = true;
    }
  }
  onFirstMonthChange(event: any) {
    const selectedMonth = event.target.value;

    const date = parseISO(selectedMonth + '-01');
    const formattedMonth = format(date, 'dd/MM/yyyy');
    console.log('mes =>', formattedMonth);

    this.form.firstMes = formattedMonth;
  }
  onLastMonthChange(event: any) {
    const selectedMonth = event.target.value;

    const date = parseISO(selectedMonth + '-01');
    const formattedMonth = format(date, 'dd/MM/yyyy');

    this.form.firstMes = formattedMonth;
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
    if (!this.isRangeValid) {
      this.alertService.modalError(
        'Error',
        'Solo se puede seleccionar hasta un rango de 6 años'
      );
    }
    let auxOrg =
      this.authService.user.user.desc_catalogo == 'NORMAL'
        ? null
        : this.selectors.org.org_id;
    console.log('ORG ANTES =>', this.authService.orgSelected);
    let typeReport = '';
    // if (
    //   this.authService.selectedMenuItem.id == '100' ||
    //   this.authService.selectedMenuItem.id == '101' ||
    //   this.authService.selectedMenuItem.id == '102'
    // ) {
    //   this.form.anual = true;
    // }

    if (
      this.authService.selectedMenuItem.id == '103' ||
      this.authService.selectedMenuItem.id == '110'
    ) {
      let obj = {
        org_id: this.authService.orgSelected.org_id,
        fecha: this.form.firstMes,
        anual: this.form.anual == true ? '1' : '0',
        mensual: '1',
        semanal: this.form.semanal == true ? '1' : '0',
        diario: this.form.diario == true ? '1' : '0',
      };
      const query = this.apiService.getReportConsumido(obj);
      query.subscribe(
        (data: any) => {
          console.log('DATA =>', data);

          this.allDocuments = data;
          if (
            this.authService.selectedMenuItem.id == '103' &&
            _type === 'pdf'
          ) {
            this.printService.generateProvidenciaReportBasicMensual(
              data,
              this.form.firstMes
            );
          }
          if (
            this.authService.selectedMenuItem.id == '110' &&
            _type === 'pdf'
          ) {
            this.printService.generateProvidenciaMensual(data);
          }
          this.alertService.cancelLoading();
        },
        (error: any) => {
          this.alertService.cancelLoading();
        }
      );
    }
    if (this.authService.selectedMenuItem.id == '106') {
      let obj = {
        org_id: this.authService.orgSelected.org_id,
        fecha: this.form.firstMes,
        anual: this.form.anual == true ? '1' : '0',
        mensual: '1',
        semanal: this.form.semanal == true ? '1' : '0',
        diario: this.form.diario == true ? '1' : '0',
      };
      const query = this.apiService.getReportConsumido(obj);
      query.subscribe(
        (data: any) => {
          console.log('DATA =>', data);

          this.allDocuments = data;
          if (
            this.authService.selectedMenuItem.id == '106' &&
            _type === 'pdf'
          ) {
            this.printService.generateProvidenciaReportBasicSemanal(
              data,
              this.form.firstMes
            );
          }
          this.alertService.cancelLoading();
        },
        (error: any) => {
          this.alertService.cancelLoading();
        }
      );
    }
    if (
      this.authService.selectedMenuItem.id != '103' &&
      this.authService.selectedMenuItem.id != '110'
    ) {
      let obj = {
        org_id: this.authService.orgSelected.org_id,
        desde: '',
        hasta: '',
        tipo: '',
      };
      if (this.authService.selectedMenuItem.id == '101') {
        this.form.lastAnio = '';
        obj.tipo = '2';
      }
      if (this.authService.selectedMenuItem.id == '102') {
        obj.desde = this.form.firstAnio;
        this.form.lastAnio = '';
        obj.tipo = '3';
      }
      if (this.authService.selectedMenuItem.id == '103') {
        obj.desde = this.form.firstMes;
        obj.tipo = '7';
      }
      if (this.authService.selectedMenuItem.id == '105') {
        obj.desde = this.form.firstMes;
        this.form.lastMes = '';
        obj.tipo = '6';
      }
      if (this.authService.selectedMenuItem.id == '109') {
        this.form.lastMes = '';
        obj.tipo = '10';
      }

      const query = this.apiService.getReportConsumidoProvidencia(obj);
      query.subscribe(
        (data: any) => {
          console.log('DATA =>', data);

          this.allDocuments = data;
          if (
            this.authService.selectedMenuItem.id == '103' &&
            _type === 'pdf'
          ) {
            this.printService.generateProvidenciaReportBasicMensual(
              data,
              this.form.firstMes
            );
          }
          if (
            this.authService.selectedMenuItem.id == '105' &&
            _type === 'pdf'
          ) {
            this.printService.generateProvidenciaReportBasicMensual(
              data,
              this.form.firstMes
            );
          }
          if (
            this.authService.selectedMenuItem.id == '102' &&
            _type === 'excel'
          ) {
            this.printService.generateProvidenciaReportBasicMensualExcel(
              data,
              this.form.fecha
            );
          }
          if (
            this.authService.selectedMenuItem.id == '102' &&
            _type === 'pdf'
          ) {
            data.data.forEach((element: any) => {
              if (element.subperiodo === 'January') {
                element.subperiodo = 'Enero';
              } else if (element.subperiodo === 'February') {
                element.subperiodo = 'Febrero';
              } else if (element.subperiodo === 'March') {
                element.subperiodo = 'Marzo';
              } else if (element.subperiodo === 'April') {
                element.subperiodo = 'Abril';
              } else if (element.subperiodo === 'May') {
                element.subperiodo = 'Mayo';
              } else if (element.subperiodo === 'June') {
                element.subperiodo = 'Junio';
              } else if (element.subperiodo === 'July') {
                element.subperiodo = 'Julio';
              } else if (element.subperiodo === 'August') {
                element.subperiodo = 'Agosto';
              } else if (element.subperiodo === 'September') {
                element.subperiodo = 'Septiembre';
              } else if (element.subperiodo === 'October') {
                element.subperiodo = 'Octubre';
              } else if (element.subperiodo === 'November') {
                element.subperiodo = 'Noviembre';
              } else if (element.subperiodo === 'December') {
                element.subperiodo = 'Diciembre';
              }
            });
            this.printService.generateProvidenciaReportBasicAnual(
              data,
              this.form.firstAnio
            );
          }
          if (
            this.authService.selectedMenuItem.id == '102' &&
            _type === 'excel'
          ) {
            data.data.forEach((element: any) => {
              if (element.subperiodo === 'January') {
                element.subperiodo = 'Enero';
              } else if (element.subperiodo === 'February') {
                element.subperiodo = 'Febrero';
              } else if (element.subperiodo === 'March') {
                element.subperiodo = 'Marzo';
              } else if (element.subperiodo === 'April') {
                element.subperiodo = 'Abril';
              } else if (element.subperiodo === 'May') {
                element.subperiodo = 'Mayo';
              } else if (element.subperiodo === 'June') {
                element.subperiodo = 'Junio';
              } else if (element.subperiodo === 'July') {
                element.subperiodo = 'Julio';
              } else if (element.subperiodo === 'August') {
                element.subperiodo = 'Agosto';
              } else if (element.subperiodo === 'September') {
                element.subperiodo = 'Septiembre';
              } else if (element.subperiodo === 'October') {
                element.subperiodo = 'Octubre';
              } else if (element.subperiodo === 'November') {
                element.subperiodo = 'Noviembre';
              } else if (element.subperiodo === 'December') {
                element.subperiodo = 'Diciembre';
              }
            });
            this.printService.generateProvidenciaReportBasicAnualExcel(
              data,
              this.form.firstAnio
            );
          }
          if (
            this.authService.selectedMenuItem.id == '109' &&
            _type === 'pdf'
          ) {
            this.printService.generateProvidenciaReportTotal(data);
          }
          // if (this.authService.selectedMenuItem.id == '105' && _type === 'pdf') {
          //   this.printService.generateProvidenciaReportBasicDiario(data);
          // }
          // if (_type == 'excel') {
          //   this.printService.generarLibroVentasExcel(this.allDocuments, obj);
          // }
          // if (_type == 'pdf') {
          //   if (this.form.mensual == true) {
          //     this.printService.generateProvidenciaReportBasicMensual(data);
          //   }
          // }
          this.alertService.cancelLoading();
        },
        (error: any) => {
          this.alertService.cancelLoading();
        }
      );
    }
  }

  changeTypeReport(_event: any, _type: string) {
    console.log('aaaaaa');

    switch (_type) {
      case 'anual':
        this.form.mensual = false;
        break;
      case 'mensual':
        this.form.anual = false;
        break;
      default:
        break;
    }
  }
}
