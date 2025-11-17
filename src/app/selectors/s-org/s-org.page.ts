import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { FilterService } from 'src/app/services/filter.service';

@Component({
  selector: 'app-s-org',
  templateUrl: './s-org.page.html',
  styleUrls: ['./s-org.page.scss'],
})
export class SOrgPage implements OnInit {
  @ViewChild('org') org!: ElementRef<HTMLInputElement>;

  allOrgs: any = [];

  form = {
    name: '',
  };

  general = {
    blockKeydown: true,
    selectedIndex: 0,
    previousIndex: 0,
  };

  lineOrgSelected = {
    org_id: '',
    cant: 0,
  };

  constructor(
    public apiService: ApiService,
    public modalController: ModalController,
    public filterService: FilterService
  ) {}

  ngOnInit() {
    this.getAllOrgs();
  }
  ngOnDestroy() {
    this.general.blockKeydown = false;
  }
  ionViewWillEnter() {
    setTimeout(() => {
      window.addEventListener('keydown', this.shortcutsView);
      this.org.nativeElement.focus();
    }, 100);
  }
  private shortcutsView = (_event: KeyboardEvent) => {
    if (this.general.blockKeydown) {
      if (_event.key == 'Escape') {
      }
      if (this.allOrgs.length >= 1) {
        switch (_event.code) {
          case 'ArrowUp':
            this.general.selectedIndex = Math.max(
              0,
              this.general.selectedIndex - 1
            );
            this.lineOrgSelected = this.allOrgs[this.general.selectedIndex];
            _event.preventDefault();
            this.scrollToSelectedElement();
            break;
          case 'ArrowDown':
            this.general.selectedIndex = Math.min(
              this.allOrgs.length - 1,
              this.general.selectedIndex + 1
            );
            this.lineOrgSelected = this.allOrgs[this.general.selectedIndex];
            _event.preventDefault();
            this.scrollToSelectedElement();
            break;
          case 'Enter':
            this.general.blockKeydown = false;
            this.modalController.dismiss({
              org: this.lineOrgSelected,
            });
            break;
        }
      }
    }
  };

  private scrollToSelectedElement() {
    const selectedElement = document.querySelector('.orgSelected');
    if (selectedElement) {
      selectedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  async getAllOrgs() {
    this.apiService.getAllOrgs().subscribe(
      (res: any) => {
        let auOxrg = {
          name: 'TODOS',
          value: 'TODOS',
          social_name: 'TODOS',
          org_id: '%',
        };
        this.allOrgs = res.items;
        this.allOrgs.unshift(auOxrg);
      },
      async (error: any) => {}
    );
  }

  get filteredOrgs(): any[] {
    if (!this.form.name) {
      return this.allOrgs;
    }
    return this.allOrgs.filter((item: any) =>
      this.filterService.deepSearch(item, this.form.name.toLowerCase())
    );
  }

  selectedOrg(_org: any) {
    this.modalController.dismiss({
      org: _org,
    });
  }
}
