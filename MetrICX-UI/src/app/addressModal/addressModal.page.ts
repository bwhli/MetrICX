import { Component } from '@angular/core';
import { ModalController, ToastController, NavParams, AlertController } from '@ionic/angular';
import { SettingsService } from '../services/settings/settings.service';
import { TokenSet } from '../services/settings/settings';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { SharedService } from '../services/shared/shared.service';

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
    private sharedService: SharedService,
    private toastController: ToastController   
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
    var result = await this.settingsService.addAddressAndSave(this.address, this.nickName)
    try {
      if(!result) {
        const toast = await this.toastController.create({
          message: 'Only a maxixum of 5 address can be stored at once',
          duration: 2000,
          cssClass: 'error-message',
          position: 'middle'
        });
      toast.present();
      }
    }
    catch {
      //Do nothing if we could not update firestore, it probably due to token not being available
    }

    await this.modalController.dismiss();
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