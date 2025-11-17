import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContribuyentesPageRoutingModule } from './contribuyentes-routing.module';

import { ContribuyentesPage } from './contribuyentes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContribuyentesPageRoutingModule
  ],
  declarations: [ContribuyentesPage]
})
export class ContribuyentesPageModule {}
