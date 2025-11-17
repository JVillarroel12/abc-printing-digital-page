import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SOrgPageRoutingModule } from './s-org-routing.module';

import { SOrgPage } from './s-org.page';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SOrgPageRoutingModule,
    PipesModule,
  ],

  declarations: [SOrgPage]
  
})
export class SOrgPageModule {}
