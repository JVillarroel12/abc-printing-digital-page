import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateSequencePageRoutingModule } from './create-sequence-routing.module';

import { CreateSequencePage } from './create-sequence.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateSequencePageRoutingModule
  ],
  declarations: [CreateSequencePage]
})
export class CreateSequencePageModule {}
