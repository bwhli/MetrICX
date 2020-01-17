import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TokensPage } from './tokens.page';
import { TooltipModule } from 'ng2-tooltip-directive';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

@NgModule({
  imports: [
    TooltipModule,
    IonicModule,
    FontAwesomeModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: TokensPage }])
  ],
  declarations: [TokensPage]
})
export class TokensPageModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
 } 
}
