import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddressModalPage } from './addressModal.page';
import { TooltipModule } from 'ng2-tooltip-directive';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { NgxQRCodeModule } from 'ngx-qrcode2';

@NgModule({
  imports: [
    TooltipModule,
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NgxQRCodeModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: AddressModalPage }])
  ],
  declarations: [AddressModalPage]
})
export class AddressModalModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
 }
}
