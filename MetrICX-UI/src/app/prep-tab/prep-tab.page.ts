import { Component} from '@angular/core';
import { NavController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { SettingsService } from '../services/settings/settings.service';

@Component({
  selector: 'app-prep-tab',
  templateUrl: 'prep-tab.page.html',
  styleUrls: ['prep-tab.page.scss']
})
export class PrepTabPage {

  public Addresses: any;

  constructor(
    public loadingController: LoadingController,
    public navCtrl: NavController,
    private settingsService: SettingsService
  ) { }

  async ionViewWillEnter() {
    this.Addresses = (await this.settingsService.get()).addresses_v2;
  }
}
