import { Component, OnInit } from '@angular/core';
import { format } from 'date-fns';
import { Subscription } from 'rxjs';
import { AlertsService } from 'src/app/services/alerts.service';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { FilterService } from 'src/app/services/filter.service';

@Component({
  selector: 'app-view-rep-document-sent',
  templateUrl: './view-rep-document-sent.component.html',
  styleUrls: ['./view-rep-document-sent.component.scss'],
})
export class ViewRepDocumentSentComponent implements OnInit {
  headerSelected = {
    id: '',
    name: '',
  };

  form = {
    name: '',
    fechaInicio: '',
    fechaFin: '',
  };

  allDocuments: any = [];

  general = {
    blockKeydown: false,
  };

  constructor(
    public filterService: FilterService,
    public apiService: ApiService,
    private servData: DataService,
    public authService: AuthService,
    public alertService: AlertsService
  ) {}

  ngOnInit() {
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

    // this.majorQuery();
    // this.majorListSubscription();
    this.getAllDocument();
  }
  ionViewWillLeave() {
    // this.majorListUnsubscription();
    this.allDocuments = [];
    this.general.blockKeydown = false;
  }
  onInicioDateChange(event: any) {
    const selectedDate = event.target.value;
    this.form.fechaInicio = this.formatDate(selectedDate);
    this.getAllDocument();
  }
  onFinDateChange(event: any) {
    const selectedDate = event.target.value;
    this.form.fechaFin = this.formatDate(selectedDate);
    this.getAllDocument();
  }
  formatDate(dateValue: string) {
    const date = new Date(dateValue);
    return format(date, 'yyyy-MM-dd HH:mm');
  }
  async getAllDocument() {
    await this.alertService.initLoading();
    let desde = new Date(this.form.fechaInicio).getTime();
    let hasta = new Date(this.form.fechaFin).getTime();
    let obj = {
      tipo_documento: '',
      desde: desde,
      hasta: hasta,
    };

    const query = this.apiService.getAllDocumentReceived(obj);

    query.subscribe(
      (data: any) => {
        this.alertService.cancelLoading();

        data.documentos.forEach((element: any) => {
          element.datos = JSON.parse(element.datos);
        });
        if (this.authService.user.user.desc_catalogo == 'NORMAL') {
          this.allDocuments = data.documentos.filter(
            (document: any) =>
              document.org_id == this.authService.user.user.org_id
          );
          return;
        }
        this.allDocuments = data.documentos;
      },
      (error) => {
        this.alertService.cancelLoading();
      }
    );
  }

  get filteredDocuments(): any[] {
    if (!this.form.name) {
      return this.allDocuments;
    }

    return this.allDocuments.filter((item: any) =>
      this.filterService.deepSearch(item, this.form.name.toLowerCase())
    );
  }
  setHeaderSelected(_data: any) {
    this.headerSelected = _data;

    this.getAllDocument();
  }
}
