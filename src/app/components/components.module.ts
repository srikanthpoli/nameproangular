import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import {RecordedvoiceComponent} from '../user-profile/recordedvoice/recordedvoice.component';
import { MatAutocompleteModule } from "@angular/material/autocomplete";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatAutocompleteModule
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent]
})
export class ComponentsModule { }
