import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WalletTabPage } from './wallet-tab.page';
import { TooltipModule } from 'ng2-tooltip-directive';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faWallet, faCalendarAlt, faSteak, faGift, faChartPieAlt }  from '@fortawesome/pro-solid-svg-icons';
import { WalletPage } from '../wallet/wallet.page';
import { SuperTabsModule } from '@ionic-super-tabs/angular';
import { TranslateLoader,TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
@NgModule({
  imports: [
    TooltipModule,
    IonicModule,
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    RouterModule.forChild([{ path: '', component: WalletTabPage }]),
    SuperTabsModule.forRoot(),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
    
    declarations: [WalletTabPage, WalletPage] //<!-- ,  HACK, WalletPage should be in it's own module
})
export class WalletTabPageModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faWallet, faCalendarAlt, faSteak, faGift, faChartPieAlt );
 }  
}
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
