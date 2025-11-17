import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SCatalogPageRoutingModule } from './s-catalog-routing.module';

import { SCatalogPage } from './s-catalog.page';
import { FilterService } from 'src/app/services/filter.service';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SCatalogPageRoutingModule,
    PipesModule
  ],
  declarations: [SCatalogPage]
})
export class SCatalogPageModule {}
