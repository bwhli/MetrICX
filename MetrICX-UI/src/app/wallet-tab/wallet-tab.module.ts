import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WalletTabPage } from './wallet-tab.page';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faWallet, faCalendarAlt, faSteak, faGift, faChartPieAlt }  from '@fortawesome/pro-solid-svg-icons';
import { SuperTabsModule } from '@ionic-super-tabs/angular';
import { WalletPage } from '../wallet/wallet.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    RouterModule.forChild([{ path: '', component: WalletTabPage }]),
    SuperTabsModule.forRoot()
  ],
    
    declarations: [WalletTabPage, WalletPage] //<!-- ,  HACK, WalletPage should be in it's own module
})
export class WalletTabPageModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faWallet, faCalendarAlt, faSteak, faGift, faChartPieAlt );
 }  
}
