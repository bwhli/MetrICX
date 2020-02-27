import { Component} from '@angular/core';
import { NavController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { SettingsService } from '../services/settings/settings.service';
import { TokensPage } from '../tokens/tokens.page';

@Component({
  selector: 'app-tokens-tab-page',
  templateUrl: 'tokens-tab.page.html',
  styleUrls: ['tokens-tab.page.scss']
})
export class TokensTabPage {

  public Addresses: any //MapArray<Address>;

  constructor(
    public loadingController: LoadingController,
    public navCtrl: NavController,
    private settingsService: SettingsService
  ) { }

  async ionViewWillEnter() {
    this.Addresses = (await this.settingsService.get()).addresses_v2;
  }

}
