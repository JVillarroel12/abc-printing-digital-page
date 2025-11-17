import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { AppRoutingModule } from '../app-routing.module';
import { FormsModule } from '@angular/forms';
import { PipesModule } from '../pipes/pipes.module';
import { ViewDocumentsSentComponent } from './view-documents-sent/view-documents-sent.component';
import { ViewRepDocumentSentComponent } from './view-rep-document-sent/view-rep-document-sent.component';
import { ViewRepFailedAttemptsComponent } from './view-rep-failed-attempts/view-rep-failed-attempts.component';
import { ViewRepSalesBookComponent } from './view-rep-sales-book/view-rep-sales-book.component';
import { ViewRepSalesComponent } from './view-rep-sales/view-rep-sales.component';
import { ViewNumberingComponent } from './view-sequences/view-numbering.component';
import { ProfileComponent } from './popovers/profile/profile.component';
import { HttpClientModule } from '@angular/common/http';
import { ViewOrgComponent } from './view-org/view-org.component';
import { ViewUserComponent } from './view-user/view-user.component';
import { ViewSeriesComponent } from './view-series/view-series.component';
import { ViewBpartnerComponent } from './view-bpartner/view-bpartner.component';
import { NotaDebitoComponent } from './documents/nota-debito/nota-debito.component';
import { NotaCreditoComponent } from './documents/nota-credito/nota-credito.component';
import { OrdenEntregaComponent } from './documents/orden-entrega/orden-entrega.component';
import { GuiaDespachoComponent } from './documents/guia-despacho/guia-despacho.component';
import { CompIslrComponent } from './documents/comp-islr/comp-islr.component';
import { CompIvaComponent } from './documents/comp-iva/comp-iva.component';
import { LibroVentaComponent } from './reports/libro-venta/libro-venta.component';
import { ViewAssignSpComponent } from './view-assign-sp/view-assign-sp.component';
import { ViewStartAssignmentComponent } from './view-start-assignment/view-start-assignment.component';
import { ViewIncreaseAssignmentComponent } from './view-increase-assignment/view-increase-assignment.component';
import { ViewRegisterAssignmentComponent } from './view-register-assignment/view-register-assignment.component';
import { ViewAuditComponent } from './view-audit/view-audit.component';
import { NmrControlAsignadosComponent } from './reports/nmr-control-asignados/nmr-control-asignados.component';
import { NmrControlVendidosComponent } from './reports/nmr-control-vendidos/nmr-control-vendidos.component';
import { FacturaComponent } from './documents/factura/factura.component';

@NgModule({
  declarations: [
    ViewDocumentsSentComponent,
    ViewRepDocumentSentComponent,
    ViewRepFailedAttemptsComponent,
    ViewRepSalesBookComponent,
    ViewRepSalesComponent,
    ViewNumberingComponent,
    ProfileComponent,
    ViewOrgComponent,
    ViewUserComponent,
    ViewSeriesComponent,
    ViewBpartnerComponent,
    FacturaComponent,
    NotaDebitoComponent,
    NotaCreditoComponent,
    OrdenEntregaComponent,
    GuiaDespachoComponent,
    CompIslrComponent,
    CompIvaComponent,
    LibroVentaComponent,
    ViewStartAssignmentComponent,
    ViewIncreaseAssignmentComponent,
    ViewRegisterAssignmentComponent,
    ViewAssignSpComponent,
    ViewAuditComponent,
    NmrControlAsignadosComponent,
    NmrControlVendidosComponent,
  ],
  exports: [
    ViewRepDocumentSentComponent,
    ViewDocumentsSentComponent,
    ViewRepFailedAttemptsComponent,
    ViewRepSalesBookComponent,
    ViewRepSalesComponent,
    ViewNumberingComponent,
    ProfileComponent,
    ViewOrgComponent,
    ViewUserComponent,
    ViewSeriesComponent,
    ViewBpartnerComponent,
    FacturaComponent,
    NotaDebitoComponent,
    NotaCreditoComponent,
    OrdenEntregaComponent,
    GuiaDespachoComponent,
    CompIslrComponent,
    CompIvaComponent,
    LibroVentaComponent,
    ViewStartAssignmentComponent,
    ViewIncreaseAssignmentComponent,
    ViewRegisterAssignmentComponent,
    ViewAssignSpComponent,
    ViewAuditComponent,
    NmrControlAsignadosComponent,
    NmrControlVendidosComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    PipesModule,
    HttpClientModule,
  ],
})
export class ComponentsModule {}
