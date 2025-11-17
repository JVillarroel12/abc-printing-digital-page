import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ViewInvoicesComponent } from './components/view-invoices/view-invoices.component';
import { ViewDocumentsSentComponent } from './components/view-documents-sent/view-documents-sent.component';
import { ViewRepDocumentSentComponent } from './components/view-rep-document-sent/view-rep-document-sent.component';
import { ViewRepFailedAttemptsComponent } from './components/view-rep-failed-attempts/view-rep-failed-attempts.component';
import { ViewRepSalesBookComponent } from './components/view-rep-sales-book/view-rep-sales-book.component';
import { ViewRepSalesComponent } from './components/view-rep-sales/view-rep-sales.component';
import { ViewNumberingComponent } from './components/view-sequences/view-numbering.component';
import { ViewHomeComponent } from './components/view-home/view-home.component';
import { ViewOrgComponent } from './components/view-org/view-org.component';
import { ViewUserComponent } from './components/view-user/view-user.component';
import { ViewSeriesComponent } from './components/view-series/view-series.component';
import { ViewBpartnerComponent } from './components/view-bpartner/view-bpartner.component';
import { NotaCreditoComponent } from './components/documents/nota-credito/nota-credito.component';
import { NotaDebitoComponent } from './components/documents/nota-debito/nota-debito.component';
import { GuiaDespachoComponent } from './components/documents/guia-despacho/guia-despacho.component';
import { OrdenEntregaComponent } from './components/documents/orden-entrega/orden-entrega.component';
import { CompIslrComponent } from './components/documents/comp-islr/comp-islr.component';
import { CompIvaComponent } from './components/documents/comp-iva/comp-iva.component';
import { LibroVentaComponent } from './components/reports/libro-venta/libro-venta.component';
import { ViewAssignSpComponent } from './components/view-assign-sp/view-assign-sp.component';
import { ViewStartAssignmentComponent } from './components/view-start-assignment/view-start-assignment.component';
import { ViewIncreaseAssignmentComponent } from './components/view-increase-assignment/view-increase-assignment.component';
import { ViewRegisterAssignmentComponent } from './components/view-register-assignment/view-register-assignment.component';
import { ViewAuditComponent } from './components/view-audit/view-audit.component';
import { NmrControlAsignadosComponent } from './components/reports/nmr-control-asignados/nmr-control-asignados.component';
import { NmrControlVendidosComponent } from './components/reports/nmr-control-vendidos/nmr-control-vendidos.component';
import { FacturaComponent } from './components/documents/factura/factura.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'view-documents-sent',
    component: ViewDocumentsSentComponent,
    runGuardsAndResolvers: 'always',
  },
  { path: 'view-rep-document-sent', component: ViewRepDocumentSentComponent },
  {
    path: 'view-rep-failet-attempts',
    component: ViewRepFailedAttemptsComponent,
  },
  { path: 'view-rep-sales-book', component: ViewRepSalesBookComponent },
  { path: 'view-rep-sales', component: ViewRepSalesComponent },
  { path: 'view-sequences', component: ViewNumberingComponent },
  { path: 'view-series', component: ViewSeriesComponent },
  { path: 'view-bpartner', component: ViewBpartnerComponent },

  { path: 'view-org', component: ViewOrgComponent },
  { path: 'view-user', component: ViewUserComponent },
  { path: 'view-home', component: ViewHomeComponent },
  { path: 'facturas', component: FacturaComponent },
  { path: 'nota-credito', component: NotaCreditoComponent },
  { path: 'nota-debito', component: NotaDebitoComponent },
  { path: 'guia-despacho', component: GuiaDespachoComponent },
  { path: 'orden-entrega', component: OrdenEntregaComponent },
  { path: 'comp-islr', component: CompIslrComponent },
  { path: 'comp-iva', component: CompIvaComponent },
  { path: 'libro-venta', component: LibroVentaComponent },
  { path: 'view-audit', component: ViewAuditComponent },
  { path: 'view-start-assignment', component: ViewStartAssignmentComponent },
  { path: 'nmr-control-asignados', component: NmrControlAsignadosComponent },
  { path: 'nmr-control-vendidos', component: NmrControlVendidosComponent },
  {
    path: 'view-increase-assignment',
    component: ViewIncreaseAssignmentComponent,
  },
  {
    path: 'view-register-assigment',
    component: ViewRegisterAssignmentComponent,
  },

  { path: 'view-assign-sp', component: ViewAssignSpComponent },

  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'contact',
    loadChildren: () =>
      import('./modals/contact/contact.module').then(
        (m) => m.ContactPageModule
      ),
  },
  {
    path: 'modal-alerts',
    loadChildren: () =>
      import('./modals/modal-alerts/modal-alerts.module').then(
        (m) => m.ModalAlertsPageModule
      ),
  },
  {
    path: 'create-org',
    loadChildren: () =>
      import('./modals/create-org/create-org.module').then(
        (m) => m.CreateOrgPageModule
      ),
  },
  {
    path: 'create-user',
    loadChildren: () =>
      import('./modals/create-user/create-user.module').then(
        (m) => m.CreateUserPageModule
      ),
  },
  {
    path: 'create-sequence',
    loadChildren: () =>
      import('./modals/create-sequence/create-sequence.module').then(
        (m) => m.CreateSequencePageModule
      ),
  },
  {
    path: 's-org',
    loadChildren: () =>
      import('./selectors/s-org/s-org.module').then((m) => m.SOrgPageModule),
  },
  {
    path: 's-serie',
    loadChildren: () =>
      import('./selectors/s-serie/s-serie.module').then(
        (m) => m.SSeriePageModule
      ),
  },
  {
    path: 'create-serie',
    loadChildren: () =>
      import('./modals/create-serie/create-serie.module').then(
        (m) => m.CreateSeriePageModule
      ),
  },
  {
    path: 's-preffix',
    loadChildren: () =>
      import('./selectors/s-preffix/s-preffix.module').then(
        (m) => m.SPreffixPageModule
      ),
  },
  {
    path: 'create-serie-child',
    loadChildren: () =>
      import('./modals/create-sequence-child/create-serie-child.module').then(
        (m) => m.CreateSerieChildPageModule
      ),
  },
  {
    path: 's-catalog',
    loadChildren: () =>
      import('./selectors/s-catalog/s-catalog.module').then(
        (m) => m.SCatalogPageModule
      ),
  },

  {
    path: 'send-email',
    loadChildren: () =>
      import('./modals/send-email/send-email.module').then(
        (m) => m.SendEmailPageModule
      ),
  },
  {
    path: 'forgot-password',
    loadChildren: () =>
      import('./pages/forgot-password/forgot-password.module').then(
        (m) => m.ForgotPasswordPageModule
      ),
  },
  {
    path: 'select-mode',
    loadChildren: () =>
      import('./pages/select-mode/select-mode.module').then(
        (m) => m.SelectModePageModule
      ),
  },
  {
    path: 'contribuyentes',
    loadChildren: () =>
      import('./pages/contribuyentes/contribuyentes.module').then(
        (m) => m.ContribuyentesPageModule
      ),
  },
  {
    path: 'start-assignments',
    loadChildren: () =>
      import('./modals/start-assignments/start-assignments.module').then(
        (m) => m.StartAssignmentsPageModule
      ),
  },
  {
    path: 's-numero-serie',
    loadChildren: () =>
      import('./selectors/s-numero-serie/s-numero-serie.module').then(
        (m) => m.SNumeroSeriePageModule
      ),
  },
  {
    path: 's-sequence',
    loadChildren: () =>
      import('./selectors/s-sequence/s-sequence.module').then(
        (m) => m.SSequencePageModule
      ),
  },
  {
    path: 'increase-assignment',
    loadChildren: () =>
      import('./modals/increase-assignment/increase-assignment.module').then(
        (m) => m.IncreaseAssignmentPageModule
      ),
  },
  {
    path: 'register-assignment',
    loadChildren: () =>
      import('./modals/register-assignment/register-assignment.module').then(
        (m) => m.RegisterAssignmentPageModule
      ),
  },
  {
    path: 'process-assignment',
    loadChildren: () =>
      import('./modals/process-assignment/process-assignment.module').then(
        (m) => m.ProcessAssignmentPageModule
      ),
  },

  // Nueva ruta para view-invoice
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
