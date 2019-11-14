import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingsPage } from './settings.page';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxQRCodeModule } from 'ngx-qrcode2';

library.add(fas);
@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    NgxQRCodeModule,
    RouterModule.forChild([{ path: '', component: SettingsPage }])
  ],
  declarations: [SettingsPage]
})
export class SettingsPageModule {}
