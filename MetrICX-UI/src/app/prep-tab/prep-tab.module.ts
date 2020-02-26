import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrepTabPage } from './prep-tab.page';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { SuperTabsModule } from '@ionic-super-tabs/angular';
import { PrepsPage } from '../prep/preps.page';

@NgModule({
  imports: [
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300
    }),
    IonicModule,
    CommonModule,
    FontAwesomeModule,
    RouterModule.forChild([{ path: '', component: PrepTabPage }]),
    SuperTabsModule.forRoot()
  ],
  declarations: [PrepTabPage, PrepsPage]
})
export class PrepTabModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
 }
}
