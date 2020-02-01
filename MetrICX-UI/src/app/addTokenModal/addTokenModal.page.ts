import { Component } from '@angular/core';
import { ModalController, NavParams, AlertController } from '@ionic/angular';
import { SettingsService } from '../services/settings/settings.service';
import { TokenSet } from '../services/settings/settings';

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
    this.Tokens = JSON.parse(JSON.stringify(settings.addresses[0].tokens)); //Clone current Token settings
  }

  async save() {
    debugger;
    var settings = await this.settingsService.get()

    Object.keys(this.Tokens).forEach(key => {
      this.settingsService.getActiveAddress().tokens[key].IsSelected = this.Tokens[key].IsSelected;
    });
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