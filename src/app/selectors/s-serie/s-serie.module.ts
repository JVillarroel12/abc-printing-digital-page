import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SSeriePageRoutingModule } from './s-serie-routing.module';

import { SSeriePage } from './s-serie.page';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SSeriePageRoutingModule,
    PipesModule
  ],
  declarations: [SSeriePage]
})
export class SSeriePageModule {}
