import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SPreffixPageRoutingModule } from './s-preffix-routing.module';

import { SPreffixPage } from './s-preffix.page';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SPreffixPageRoutingModule,
    PipesModule
  ],
  declarations: [SPreffixPage]
})
export class SPreffixPageModule {}
