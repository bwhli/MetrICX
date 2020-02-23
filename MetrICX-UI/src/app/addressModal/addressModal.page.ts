import { Component } from '@angular/core';
import { ModalController, ToastController, NavParams, AlertController } from '@ionic/angular';
import { SettingsService } from '../services/settings/settings.service';
import { TokenSet } from '../services/settings/settings';
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
  public enablePushDeposits: boolean = false;
  public Address: any;
  public isUpdate: boolean = false;
  public key: string;
   
  constructor(
    private modalController: ModalController,
    private settingsService: SettingsService,
    private barcodeScanner: BarcodeScanner,
    private toastController: ToastController,
    public navParams: NavParams   
  ) { }

  async ionViewWillEnter() {
     if(this.navParams.get('key')) {
       this.key = this.navParams.get('key');
       var settings = await this.settingsService.get();
       if (settings.addresses_v2) {
         this.isUpdate = true;
          this.Address = JSON.parse(JSON.stringify(settings.addresses_v2));
          this.address = settings.addresses_v2[this.key].address;
          this.nickName = settings.addresses_v2[this.key].Nickname;
          this.enablePushDeposits = settings.addresses_v2[this.key].enablePushDeposits;
       } 
     } 
  }
 
  async save() {  
    //this might need refactoring at some point
    if(this.isUpdate) {
      var updateResult = await this.settingsService.updateAndSave(this.key, this.address, this.nickName, this.enablePushDeposits);
      if(!updateResult) {
        const toast = await this.toastController.create({
          message: 'Unable to update address, please try again',
          duration: 2000,
          cssClass: 'error-message',
          position: 'middle'
        });
      toast.present();
      }
    }
    else {
      var addResult = await this.settingsService.addAddressAndSave(this.address, this.nickName, this.enablePushDeposits);
      if(!addResult) {
        const toast = await this.toastController.create({
          message: 'Only a maxixum of 5 address can be stored at once',
          duration: 2000,
          cssClass: 'error-message',
          position: 'middle'
        });
      toast.present();
      }
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