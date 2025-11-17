import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateSeriePageRoutingModule } from './create-serie-routing.module';

import { CreateSeriePage } from './create-serie.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateSeriePageRoutingModule
  ],
  declarations: [CreateSeriePage]
})
export class CreateSeriePageModule {}
