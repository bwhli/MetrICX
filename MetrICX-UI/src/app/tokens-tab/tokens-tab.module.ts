import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokensPage} from '../tokens/tokens.page';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { SuperTabsModule } from '@ionic-super-tabs/angular';
import { TokensTabPage } from './tokens-tab.page';
import { TranslateLoader,TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { createTranslateLoader } from '../wallet-tab/wallet-tab.module'

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FontAwesomeModule,
    RouterModule.forChild([{ path: '', component: TokensTabPage }]),
    SuperTabsModule.forRoot(),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
    declarations: [TokensTabPage, TokensPage] //<!-- ,  HACK, WalletPage should be in it's own module
})
export class TokensTabModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
 }
}
