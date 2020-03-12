import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddTokenModalPage } from './addTokenModal.page';
import { TooltipModule } from 'ng2-tooltip-directive';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { TranslateLoader,TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { createTranslateLoader } from '../wallet-tab/wallet-tab.module'

@NgModule({
  imports: [
    TooltipModule,
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: AddTokenModalPage }]),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  declarations: [AddTokenModalPage]
})
export class AddTokenModalModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
 }
}
