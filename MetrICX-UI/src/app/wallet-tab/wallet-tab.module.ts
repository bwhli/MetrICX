import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WalletTabPage } from './wallet-tab.page';
import { TooltipModule } from 'ng2-tooltip-directive';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { SuperTabsModule } from '@ionic-super-tabs/angular';
import { WalletPageModule } from '../wallet/wallet.module';

@NgModule({
  imports: [
    TooltipModule,
    IonicModule,
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    RouterModule.forChild([{ path: '', component: WalletTabPage }]),
    SuperTabsModule.forRoot(),
    WalletPageModule
  ],
  declarations: [WalletTabPage]
})
export class WalletTabPageModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
 }
}
