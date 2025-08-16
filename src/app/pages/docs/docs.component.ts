import { Component } from '@angular/core';
import { InvoiceComponent } from '../../components/documentation/invoice/invoice.component';
import { AutenticationComponent } from '../../components/documentation/autentication/autentication.component';
import { CreditNoteComponent } from '../../components/documentation/credit-note/credit-note.component';
import { DebitNoteComponent } from '../../components/documentation/debit-note/debit-note.component';
import { RetentionComponent } from '../../components/documentation/retention/retention.component';
import { CancelDocumentComponent } from '../../components/documentation/cancel-document/cancel-document.component';
import { SeoService } from '../../services/seo.service';

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
    this.seoService.updateMetaTags(
      'Encuentra toda la documentación técnica sobre nuestros servicios de facturación digital e integración API en ABC Printing Digital.'
    );
  }
}
