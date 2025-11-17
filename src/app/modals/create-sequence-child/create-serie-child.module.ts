import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateSerieChildPageRoutingModule } from './create-serie-child-routing.module';

import { CreateSerieChildPage } from './create-serie-child.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateSerieChildPageRoutingModule
  ],
  declarations: [CreateSerieChildPage]
})
export class CreateSerieChildPageModule {}
