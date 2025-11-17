import { Component, OnInit } from '@angular/core';
import { format } from 'date-fns';
import { FilterService } from 'src/app/services/filter.service';

@Component({
  selector: 'app-view-rep-failed-attempts',
  templateUrl: './view-rep-failed-attempts.component.html',
  styleUrls: ['./view-rep-failed-attempts.component.scss'],
})
export class ViewRepFailedAttemptsComponent  implements OnInit {
 
  form = {
    fechaInicio: '',
    document_type: '',
    cod_status: '',
    serie: '',
    rif: '',
    doc_number: ''
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
    


  }
  onInicioDateChange(event: any) {
    const selectedDate = event.target.value;  
    this.form.fechaInicio = this.formatDate(selectedDate);
  }

  formatDate(dateValue: string) {
    const date = new Date(dateValue);
    return format(date, "yyyy-MM-dd HH:mm");
  }

}