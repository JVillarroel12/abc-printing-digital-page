import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateOrgPageRoutingModule } from './create-org-routing.module';

import { CreateOrgPage } from './create-org.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateOrgPageRoutingModule
  ],
  declarations: [CreateOrgPage]
})
export class CreateOrgPageModule {}
