import { Component } from '@angular/core';
import { InvoiceComponent } from '../../components/documentation/invoice/invoice.component';
import { AutenticationComponent } from '../../components/documentation/autentication/autentication.component';
import { CreditNoteComponent } from '../../components/documentation/credit-note/credit-note.component';
import { DebitNoteComponent } from '../../components/documentation/debit-note/debit-note.component';
import { RetentionComponent } from '../../components/documentation/retention/retention.component';
import { CancelDocumentComponent } from '../../components/documentation/cancel-document/cancel-document.component';
import { SeoData, SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-docs',
  standalone: true,
  imports: [
    AutenticationComponent,
    InvoiceComponent,
    CreditNoteComponent,
    DebitNoteComponent,
    RetentionComponent,
    CancelDocumentComponent,
  ],
  templateUrl: './docs.component.html',
  styleUrl: './docs.component.scss',
})
export class DocsComponent {
  constructor(private seoService: SeoService) {}
  ngOnInit() {
    const seoData: SeoData = {
      title:
        'ABC Printing Digital | Impresión y Facturación Digital en Venezuela',
      description:
        'Soluciones integrales en impresión digital de alta calidad, facturación electrónica y documentos legales para tu negocio en Venezuela. Calidad, rapidez y tecnología.',
      //image: 'https://www.abcprintingdigital.com/assets/images/social-share.jpg',
      slug: '',
    };

    this.seoService.updateSeoData(seoData);
  }
}
