import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrepsPage } from './preps.page';
import { NgxDatatableModule} from '@swimlane/ngx-datatable';
import { TooltipModule } from 'ng2-tooltip-directive';

@NgModule({
  imports: [
    TooltipModule,
    IonicModule,
    CommonModule,
    FormsModule,
    NgxDatatableModule,
    RouterModule.forChild([{ path: '', component: PrepsPage }])
  ],
  declarations: [PrepsPage]
})
export class PrepsPageModule {}
