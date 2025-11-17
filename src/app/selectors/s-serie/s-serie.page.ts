import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';
import { FilterService } from 'src/app/services/filter.service';

@Component({
  selector: 'app-s-serie',
  templateUrl: './s-serie.page.html',
  styleUrls: ['./s-serie.page.scss'],
})
export class SSeriePage implements OnInit {
  @ViewChild('serie') serie!: ElementRef<HTMLInputElement>;
  allSeries: any = [];
  form = {
    name: '',
  };
  filter: any = {
    index: 0,
    itemsByPage: null,
    count: 0,
    orderBy: {
      column: '',
      asc: false,
    },
    columns: {
      numero: '',
      org_id: '',
      serie_id: '',
      createdby: '',
    },
    date_columns: [],
    boolean_columns: [],
    numeric_columns: [],
    auxiliar: [
      {
        collection: 'org',
        tableIdentifier: 'org_id',
        column: 'name',
        value: null,
      },
      {
        collection: 'serie',
        tableIdentifier: 'serie_id',
        column: 'name',
        value: null,
      },
    ],
  };
  majorListSubjet?: Subscription;
  general = {
    blockKeydown: true,
    selectedIndex: 0,
    previousIndex: 0,
  };

  lineSerieSelected = {
    serie_id: '',
    cant: 0,
  };
  constructor(
    public modalController: ModalController,
    public filterService: FilterService,
    public servData: DataService,
    public apiService: ApiService
  ) {}

  ngOnInit() {
    this.general.blockKeydown = true;
    this.majorQuery();
    this.majorListSubscription();
  }
  ngOnDestroy() {
    this.general.blockKeydown = false;
  }
  ionViewWillEnter() {
    setTimeout(() => {
      window.addEventListener('keydown', this.shortcutsView);
      this.serie.nativeElement.focus();
    }, 100);
  }
  ionViewWillLeave() {
    this.majorListUnsubscription();
  }
  majorListSubscription() {
    this.majorListSubjet = this.servData
      .subscribeSeries()
      .subscribe((resp: any) => {
        this.allSeries = resp;
        if (resp.length > 0) {
        }
      });
  }
  majorListUnsubscription() {
    this.majorListSubjet?.unsubscribe();
  }
  majorQuery() {
    this.apiService.getSeries_byFilter(this.filter);
  }

  private shortcutsView = (_event: KeyboardEvent) => {
    if (this.general.blockKeydown) {
      if (_event.key == 'Escape') {
      }
      if (this.allSeries.length >= 1) {
        switch (_event.code) {
          case 'ArrowUp':
            this.general.selectedIndex = Math.max(
              0,
              this.general.selectedIndex - 1
            );
            this.lineSerieSelected = this.allSeries[this.general.selectedIndex];
            _event.preventDefault();
            this.scrollToSelectedElement();
            break;
          case 'ArrowDown':
            this.general.selectedIndex = Math.min(
              this.allSeries.length - 1,
              this.general.selectedIndex + 1
            );
            this.lineSerieSelected = this.allSeries[this.general.selectedIndex];
            _event.preventDefault();
            this.scrollToSelectedElement();
            break;
          case 'Enter':
            this.general.blockKeydown = false;
            this.modalController.dismiss({
              serie: this.lineSerieSelected,
            });
            break;
        }
      }
    }
  };

  private scrollToSelectedElement() {
    const selectedElement = document.querySelector('.serieSelected');
    if (selectedElement) {
      selectedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  get filteredSeries(): any[] {
    if (!this.form.name) {
      return this.allSeries;
    }
    return this.allSeries.filter((item: any) =>
      this.filterService.deepSearch(item, this.form.name.toLowerCase())
    );
  }

  selectedSerie(_data: any) {
    this.modalController.dismiss({
      serie: _data,
    });
  }
}
