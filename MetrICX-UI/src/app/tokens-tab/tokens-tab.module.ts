import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokensPage} from '../tokens/tokens.page';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { SuperTabsModule } from '@ionic-super-tabs/angular';
import { TokensTabPage } from './tokens-tab.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FontAwesomeModule,
    RouterModule.forChild([{ path: '', component: TokensTabPage }]),
    SuperTabsModule.forRoot()
  ],
    declarations: [TokensTabPage, TokensPage] //<!-- ,  HACK, WalletPage should be in it's own module
})
export class TokensTabModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
 }
}
