import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SNumeroSeriePageRoutingModule } from './s-numero-serie-routing.module';

import { SNumeroSeriePage } from './s-numero-serie.page';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SNumeroSeriePageRoutingModule,
    PipesModule,
  ],
  declarations: [SNumeroSeriePage],
})
export class SNumeroSeriePageModule {}
