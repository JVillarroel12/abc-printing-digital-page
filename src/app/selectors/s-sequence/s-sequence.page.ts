import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';
import { FilterService } from 'src/app/services/filter.service';

@Component({
  selector: 'app-s-sequence',
  templateUrl: './s-sequence.page.html',
  styleUrls: ['./s-sequence.page.scss'],
})
export class SSequencePage implements OnInit {
  @ViewChild('serie') serie!: ElementRef<HTMLInputElement>;
  @Input('') org_id: any;
  allSequences: any = [];
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
      isactive: true,
      name: '',
      org_id: '',
      serie_id: '',
    },
    date_columns: [],
    boolean_columns: ['isactive'],
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

  lineSequenceSelected = {
    sequence_id: '',
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
    this.filter.columns.org_id = this.org_id;
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
      .subscribeSequences()
      .subscribe((resp: any) => {
        console.log('SEQUENCES =>', resp);

        this.allSequences = resp;
        if (resp.length > 0) {
        }
      });
  }
  majorListUnsubscription() {
    this.majorListSubjet?.unsubscribe();
  }
  majorQuery() {
    this.apiService.getSequences_byFilter(this.filter);
  }

  private shortcutsView = (_event: KeyboardEvent) => {
    if (this.general.blockKeydown) {
      if (_event.key == 'Escape') {
      }
      if (this.allSequences.length >= 1) {
        switch (_event.code) {
          case 'ArrowUp':
            this.general.selectedIndex = Math.max(
              0,
              this.general.selectedIndex - 1
            );
            this.lineSequenceSelected =
              this.allSequences[this.general.selectedIndex];
            _event.preventDefault();
            this.scrollToSelectedElement();
            break;
          case 'ArrowDown':
            this.general.selectedIndex = Math.min(
              this.allSequences.length - 1,
              this.general.selectedIndex + 1
            );
            this.lineSequenceSelected =
              this.allSequences[this.general.selectedIndex];
            _event.preventDefault();
            this.scrollToSelectedElement();
            break;
          case 'Enter':
            this.general.blockKeydown = false;
            this.modalController.dismiss({
              serie: this.lineSequenceSelected,
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

  get filteredSequences(): any[] {
    if (!this.form.name) {
      return this.allSequences;
    }
    return this.allSequences.filter((item: any) =>
      this.filterService.deepSearch(item, this.form.name.toLowerCase())
    );
  }

  selectedSequence(_data: any) {
    this.modalController.dismiss({
      sequence: _data,
    });
  }
}
