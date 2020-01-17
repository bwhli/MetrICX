import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddTokenModalPage } from './addTokenModal.page';
import { TooltipModule } from 'ng2-tooltip-directive';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

@NgModule({
  imports: [
    TooltipModule,
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: AddTokenModalPage }])
  ],
  declarations: [AddTokenModalPage]
})
export class AddTokenModalModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
 }
}
