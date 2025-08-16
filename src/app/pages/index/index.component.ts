import { Component } from '@angular/core';
import { Art1Component } from '../../components/home/art-1/art-1.component';
import { Art2Component } from '../../components/home/art-2/art-2.component';
import { Art3Component } from '../../components/home/art-3/art-3.component';
import { Art5Component } from '../../components/home/art-5/art-5.component';
import { Art4Component } from '../../components/home/art-4/art-4.component';
import { CommonModule } from '@angular/common';
import { CardsComponent } from '../../components/home/cards/cards.component';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [
    Art1Component,
    CardsComponent,
    Art2Component,
    Art3Component,
    Art5Component,
    Art4Component,
    CommonModule,
  ],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss',
})
export class IndexComponent {
  constructor(private seoService: SeoService) {}

  ngOnInit() {
    // El título ya lo puso el router.
    // Nosotros nos encargamos de la descripción.
    this.seoService.updateMetaTags(
      'ABC Printing Digital: Soluciones integrales en impresión digital de alta calidad, facturación digital y documentos legales para tu negocio en Venezuela. Calidad, rapidez y tecnología para modernizar tu empresa.'
    );
  }
}
