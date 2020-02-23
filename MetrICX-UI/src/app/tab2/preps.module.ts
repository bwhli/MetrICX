import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrepsPage } from './preps.page';
import { NgxDatatableModule} from '@swimlane/ngx-datatable';
import { TooltipModule } from 'ng2-tooltip-directive';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { NgCircleProgressModule } from 'ng-circle-progress';

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
    TooltipModule,
    IonicModule,
    CommonModule,
    FormsModule,
    NgxDatatableModule,
    FontAwesomeModule,
    RouterModule.forChild([{ path: '', component: PrepsPage }])
  ],
  declarations: [PrepsPage]
})
export class PrepsPageModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
 }
}
