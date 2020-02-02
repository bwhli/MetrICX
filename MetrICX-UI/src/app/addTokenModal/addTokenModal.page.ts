import { Component } from '@angular/core';
import { ModalController, NavParams, AlertController } from '@ionic/angular';
import { SettingsService } from '../services/settings/settings.service';
import { TokenSet, Address } from '../services/settings/settings';

@Component({
  selector: 'app-addTokenModal',
  templateUrl: './addTokenModal.page.html',
  styleUrls: ['./addTokenModal.page.scss'],
})

export class AddTokenModalPage {
  
  public Tokens: TokenSet;
   
  constructor(
    private modalController: ModalController,
    private settingsService: SettingsService
  ) {

  }
 
  async ionViewWillEnter() {
    var settings = await this.settingsService.get();
    if (settings.addresses._0.tokens)
      this.Tokens = JSON.parse(JSON.stringify(settings.addresses._0.tokens)); //Clone current Token settings
    else
      this.Tokens = new TokenSet();
  }

  async save() {
    var settings = await this.settingsService.get()

    if (this.settingsService.getActiveAddress().tokens) {
      Object.keys(this.Tokens).forEach(key => {
        this.settingsService.getActiveAddress().tokens[key].IsSelected = this.Tokens[key].IsSelected;
      });
    } else {
      this.settingsService.getActiveAddress().tokens = this.Tokens;
    }

    await this.modalController.dismiss();

    try {
      this.settingsService.save(settings);
    }
    catch {
      //Do nothing if we could not update firestore, it probably due to token not being available
    }
  }

  async closeModal() {
    await this.modalController.dismiss();
  }
}