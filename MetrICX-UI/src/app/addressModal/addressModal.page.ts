import { Component } from '@angular/core';
import { ModalController, NavParams, AlertController } from '@ionic/angular';
import { SettingsService } from '../services/settings/settings.service';
import { TokenSet, Address } from '../services/settings/settings';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Component({
  selector: 'app-addressModal',
  templateUrl: './addressModal.page.html',
  styleUrls: ['./addressModal.page.scss'],
})

export class AddressModalPage {
  
  public Tokens: TokenSet;
  public address: string;
  public nickName: string;
   
  constructor(
    private modalController: ModalController,
    private settingsService: SettingsService,
    private barcodeScanner: BarcodeScanner,   
  ) {

  }
 
  async ionViewWillEnter() {
    var settings = await this.settingsService.get();
    if (settings.addresses_v2.p0.Tokens)
      this.Tokens = JSON.parse(JSON.stringify(settings.addresses_v2.p0.Tokens)); //Clone current Token settings
    else
      this.Tokens = new TokenSet();
  }

  async save() {
    var settings = await this.settingsService.get()

    if (this.settingsService.getActiveAddress().Tokens) { 
      Object.keys(this.Tokens).forEach(key => {
        this.settingsService.getActiveAddress().Tokens[key].IsSelected = this.Tokens[key].IsSelected;
      });
    } else {
      this.settingsService.getActiveAddress().Tokens = this.Tokens;
    }

    await this.modalController.dismiss();

    try {
      this.settingsService.save(settings);
    }
    catch {
      //Do nothing if we could not update firestore, it probably due to token not being available
    }
  }

  
  async scanQR () {
    this.barcodeScanner.scan().then(
      barcodeData => {
        this.address = barcodeData.text;
      }
    );
  }

  async closeModal() {
    await this.modalController.dismiss();
  }
}