import { Component, OnInit } from '@angular/core';
import { format } from 'date-fns';
import { FilterService } from 'src/app/services/filter.service';

@Component({
  selector: 'app-view-rep-sales',
  templateUrl: './view-rep-sales.component.html',
  styleUrls: ['./view-rep-sales.component.scss'],
})
export class ViewRepSalesComponent  implements OnInit {
 
  form = {
    type: '',
    fechaInicio: '',
    fechaFin: '',
    sucursal: '',
    serie: '',
  }
  allDocuments:any = []
  constructor(
    public filterService: FilterService
  ) { }

  ngOnInit() {
    
    let defaultInicio = new Date();
    defaultInicio.setHours(0, 0, 0, 0);
    let defaultInicio2 = new Date(defaultInicio.getTime() - (defaultInicio.getTimezoneOffset() * 60000)); 
    this.form.fechaInicio = defaultInicio2.toISOString().slice(0, 16); 
    
    let defaultFinal = new Date();
    defaultFinal.setHours(23, 59, 0, 0);
    let defaultFinal2 = new Date(defaultFinal.getTime() - (defaultFinal.getTimezoneOffset() * 60000)); 
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
    return format(date, "yyyy-MM-dd HH:mm");
  }


}