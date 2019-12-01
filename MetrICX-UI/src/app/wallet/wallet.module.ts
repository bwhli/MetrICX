import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WalletPage } from './wallet.page';
import { TooltipModule } from 'ng2-tooltip-directive';

@NgModule({
  imports: [
    TooltipModule,
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: WalletPage }])
  ],
  declarations: [WalletPage]
})
export class WalletPageModule {}
