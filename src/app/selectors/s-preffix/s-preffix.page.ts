import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { FilterService } from 'src/app/services/filter.service';

@Component({
  selector: 'app-s-preffix',
  templateUrl: './s-preffix.page.html',
  styleUrls: ['./s-preffix.page.scss'],
})
export class SPreffixPage implements OnInit {

  @ViewChild('prefix') prefix!: ElementRef<HTMLInputElement>;
  
  allPrefix: any = [];

  form = {
    name: ''
  }

  general = {
    blockKeydown: true,
    selectedIndex: 0,
    previousIndex: 0,
  }
  linePrefixSelected = {
    prefix_id: '',
    name: ''
  };
  constructor(
    public apiService: ApiService,
    public modalController: ModalController,
    public filterService: FilterService
  ) { }

  ngOnInit() {
    this.returnAllPrefix()
  }
  ngOnDestroy(){
    this.general.blockKeydown = false;
  }
  ionViewWillEnter(){
    setTimeout(() => {
      this.prefix.nativeElement.focus();
      window.addEventListener('keydown', this.shortcutsView);
      this.general.blockKeydown = true;    
    }, 100);
  }
  private shortcutsView = (_event: KeyboardEvent)=>{
    if(this.general.blockKeydown){
      if(_event.key == 'Escape'){

      }
      if(this.allPrefix.length >= 1){
        switch (_event.code) {  
          case 'ArrowUp':
            this.general.selectedIndex = Math.max(0, this.general.selectedIndex - 1);
            this.linePrefixSelected = this.allPrefix[this.general.selectedIndex];
            _event.preventDefault();
            this.scrollToSelectedElement();
            break;           
          case 'ArrowDown':
            this.general.selectedIndex = Math.min(this.allPrefix.length - 1, this.general.selectedIndex + 1);
            this.linePrefixSelected = this.allPrefix[this.general.selectedIndex];
            _event.preventDefault();
            this.scrollToSelectedElement();
            break;
          case 'Enter':
          this.general.blockKeydown = false;
          this.selectedPrefix(this.linePrefixSelected)
          break;
        }
      }   
    }
  }

  private scrollToSelectedElement() {
    const selectedElement = document.querySelector('.prefixSelected');
    if (selectedElement) {
      selectedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
  returnAllPrefix(){
    const arreglo: any = [];
    for (let i = 65; i <= 90; i++) {
      const letra = String.fromCharCode(i);
      arreglo.push({
        name: letra,
        prefix_id: letra
      });
    }
    this.allPrefix = arreglo;
  }

  get filteredPrefix(): any[] {
    if (!this.form.name) {
      return this.allPrefix;
    }
    return this.allPrefix.filter((item: any) => this.filterService.deepSearch(item, this.form.name.toLowerCase()));
  }



  selectedPrefix(_prefix:any){
    this.modalController.dismiss({
      prefix: _prefix
    })
  }
}
