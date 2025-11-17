import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectModePageRoutingModule } from './select-mode-routing.module';

import { SelectModePage } from './select-mode.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectModePageRoutingModule
  ],
  declarations: [SelectModePage]
})
export class SelectModePageModule {}
