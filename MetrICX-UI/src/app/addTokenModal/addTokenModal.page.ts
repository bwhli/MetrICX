import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { SettingsService } from '../services/settings/settings.service';
import { TokenSet, Address } from '../services/settings/settings';

@Component({
  selector: 'app-addTokenModal',
  templateUrl: './addTokenModal.page.html',
  styleUrls: ['./addTokenModal.page.scss'],
})

export class AddTokenModalPage {
  
  public Tokens;
  private _addressSetting: Address;
   
  constructor(
    private modalController: ModalController,
    private settingsService: SettingsService,
    private navParams: NavParams
  ) {

  }
 
  async ionViewWillEnter() {
    if(this.navParams.get('key')) {
      this._addressSetting = this.navParams.get('key');
    if (this._addressSetting.tokens) {
        this.Tokens = JSON.parse(JSON.stringify(this._addressSetting.tokens)); //Clone current Token settings
    }
    else {
      this._addressSetting.tokens = new TokenSet();
    }
   }
 }

  async save() {
    var settings = await this.settingsService.get()

    Object.keys(this._addressSetting.tokens).forEach(key => {
          this._addressSetting.tokens[key].IsSelected = this.Tokens[key].IsSelected;
    });

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