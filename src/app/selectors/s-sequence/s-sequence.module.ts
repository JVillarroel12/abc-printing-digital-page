import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SSequencePageRoutingModule } from './s-sequence-routing.module';

import { SSequencePage } from './s-sequence.page';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SSequencePageRoutingModule,
    PipesModule,
  ],
  declarations: [SSequencePage],
})
export class SSequencePageModule {}
