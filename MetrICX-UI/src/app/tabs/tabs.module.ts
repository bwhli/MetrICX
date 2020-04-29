import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faWallet, faCogs, faPollPeople, faCoins } from '@fortawesome/pro-duotone-svg-icons';
import { TabsPageRoutingModule } from './tabs.router.module';
import { TabsPage } from './tabs.page';

@NgModule({
  imports: [
    IonicModule,
    FontAwesomeModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {
constructor(library: FaIconLibrary) {
     library.addIcons(faWallet, faCogs, faPollPeople, faCoins);
  }  
}
