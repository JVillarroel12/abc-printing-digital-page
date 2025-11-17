import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';
import { FilterService } from 'src/app/services/filter.service';

@Component({
  selector: 'app-s-catalog',
  templateUrl: './s-catalog.page.html',
  styleUrls: ['./s-catalog.page.scss'],
})
export class SCatalogPage implements OnInit {
  @ViewChild('catalogo') catalogo!: ElementRef<HTMLInputElement>;
  @Input('') name: any;
  form = {
    name: '',
  };
  allCatalog: any = [];
  filter: any = {
    index: 0,
    itemsByPage: null,
    count: 0,
    orderBy: {
      column: '',
      asc: false,
    },
    columns: {
      catalogo_id: '',
      descripcion: '',
      nombre: '',
      valor: '',
    },
    date_columns: [],
    boolean_columns: [],
    numeric_columns: [],
    auxiliar: [],
  };
  majorListSubjet?: Subscription;
  general = {
    blockKeydown: true,
    selectedIndex: 0,
    previousIndex: 0,
  };

  lineCatalogoSelected = {
    catalogo_id: '',
    descripcion: '',
  };
  constructor(
    public servData: DataService,
    public apiService: ApiService,
    public modalController: ModalController,
    public filterService: FilterService
  ) {}

  ngOnInit() {
    this.filter.columns.nombre = this.name;
    this.general.blockKeydown = true;
    this.majorQuery();
    this.majorListSubscription();
  }
  ngOnDestroy() {}
  ionViewWillEnter() {
    setTimeout(() => {
      window.addEventListener('keydown', this.shortcutsView);
      this.catalogo.nativeElement.focus();
    }, 100);
  }
  ionViewWillLeave() {
    this.majorListUnsubscription();
  }
  majorListSubscription() {
    this.majorListSubjet = this.servData
      .subscribeCatalogs()
      .subscribe((resp: any) => {
        this.allCatalog = resp;
        if (resp.length > 0) {
        }
      });
  }
  majorListUnsubscription() {
    this.majorListSubjet?.unsubscribe();
  }
  majorQuery() {
    this.apiService.getCatalog_byFilter(this.filter);
  }
  private shortcutsView = (_event: KeyboardEvent) => {
    if (this.general.blockKeydown) {
      if (_event.key == 'Escape') {
      }
      if (this.allCatalog.length >= 1) {
        switch (_event.code) {
          case 'ArrowUp':
            this.general.selectedIndex = Math.max(
              0,
              this.general.selectedIndex - 1
            );
            this.lineCatalogoSelected =
              this.allCatalog[this.general.selectedIndex];
            _event.preventDefault();
            this.scrollToSelectedElement();
            break;
          case 'ArrowDown':
            this.general.selectedIndex = Math.min(
              this.allCatalog.length - 1,
              this.general.selectedIndex + 1
            );
            this.lineCatalogoSelected =
              this.allCatalog[this.general.selectedIndex];
            _event.preventDefault();
            this.scrollToSelectedElement();
            break;
          case 'Enter':
            this.general.blockKeydown = false;
            this.modalController.dismiss({
              catalogo: this.lineCatalogoSelected,
            });
            break;
        }
      }
    }
  };

  private scrollToSelectedElement() {
    const selectedElement = document.querySelector('.catalogoSelected');
    if (selectedElement) {
      selectedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  get filteredCatalogo(): any[] {
    if (!this.form.name) {
      return this.allCatalog;
    }
    return this.allCatalog.filter((item: any) =>
      this.filterService.deepSearch(item, this.form.name.toLowerCase())
    );
  }

  selectedCatalogo(_data: any) {
    this.modalController.dismiss({
      catalogo: _data,
    });
  }
}
