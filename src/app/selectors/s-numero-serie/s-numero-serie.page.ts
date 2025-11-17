import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FilterService } from 'src/app/services/filter.service';

@Component({
  selector: 'app-s-numero-serie',
  templateUrl: './s-numero-serie.page.html',
  styleUrls: ['./s-numero-serie.page.scss'],
})
export class SNumeroSeriePage implements OnInit {
  form = {
    numero: '',
  };
  allNumeroSerie: any = [];
  constructor(
    public modalController: ModalController,
    public filterService: FilterService
  ) {}

  ngOnInit() {
    this.allNumeroSerie.push('SS');
    for (let i = 0; i < 100; i++) {
      // Formatea el número con dos dígitos (00 a 99)
      const numero = i.toString().padStart(2, '0');
      this.allNumeroSerie.push(`${numero}`);
    }
  }
  selectedSerie(_data: any) {
    let numero = {
      name: _data,
    };
    this.modalController.dismiss({
      serie: numero,
    });
  }
  get filteredNumeroSerie(): any[] {
    if (!this.form.numero) {
      return this.allNumeroSerie;
    }
    return this.allNumeroSerie.filter((item: any) =>
      this.filterService.deepSearch(item, this.form.numero.toLowerCase())
    );
  }
}
