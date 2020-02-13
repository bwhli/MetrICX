 import { Component } from '@angular/core';
import { ToastController, NavController, IonFabButton, IonToggle, ModalController } from '@ionic/angular';

import { DeviceSettings, MapArray, Address } from '../services/settings/settings';

//not used at the moment but if we want to show the QR Canvas we can use this
import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';
import { SettingsService } from '../services/settings/settings.service';
import { AddressModalPage } from '../addressModal/addressModal.page';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss']
})
export class SettingsPage {
  //this is used for drawing the QR Code
  public elementType: 'url' | 'canvas' | 'img' = 'canvas';

  public enablePushIScoreChange: boolean = false;
  public enablePushDeposits: boolean = false;
  public enablePushProductivityDrop: boolean = false;
  public showUSDValue: boolean = false;
  public deviceSettings: DeviceSettings;

  public Address: MapArray<Address>;


  constructor(
    private toastController: ToastController,
    public navCtrl: NavController,
    public modalController: ModalController,
    private settingsService: SettingsService, 
   
    //this will be used if we want to show the QR Code as well
    private base64ToGallery: Base64ToGallery) { }

  async ionViewWillEnter()  {
    var settings = await this.settingsService.get();
    if (settings.addresses_v2)
        this.Address = JSON.parse(JSON.stringify(settings.addresses_v2));

    this.deviceSettings = settings;
    this.enablePushIScoreChange = settings.enablePushIScoreChange;
    this.enablePushProductivityDrop = settings.enablePushProductivityDrop;
    this.showUSDValue = settings.showUSDValue;

   //this.settingsForm.patchValue({address: this.settingsService.getActiveAddress().Address});

    if (settings.enablePushProductivityDrop)
       this.enablePushProductivityDrop = settings.enablePushProductivityDrop;

  }

  // Save to storage and display Toaster when done
  async save() {
    var settings = await this.settingsService.get();

    //this.settingsService.getActiveAddress().Address = this.settingsForm.controls['address'].value; //This would need refactoring with new UI
    settings.enablePushIScoreChange = this.enablePushIScoreChange;
    settings.enablePushDeposits = this.enablePushDeposits;
    settings.enablePushProductivityDrop = this.enablePushProductivityDrop;
    settings.showUSDValue = this.showUSDValue;


    try {
      //Save to local storage
      this.settingsService.save(settings);
    }
    catch {
      //firebase failed most likely because of permissions issues for push notifications
      //reset the settings so the user is not confussed wondering why notifications are not working
      //even though they are enabled on the UI
      if (settings.enablePushDeposits || settings.enablePushIScoreChange || settings.enablePushProductivityDrop) {
        const toast = await this.toastController.create({
          message: 'ICX address saved, however you must allow notifications to be able to receive notifications',
          duration: 3000,
          position: 'middle'
        });
        
        toast.present();
      }
      else {
        this.presentToast();
      }
    }
  }
  
  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Your settings have been saved.',
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }


  async removeAddress (key: string) {
   this.settingsService.deleteAddress(key);
   this.ionViewWillEnter();
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: AddressModalPage,
      cssClass: 'address-modal-css'
    });
 
    modal.onDidDismiss().then((dataReturned) => {
        this.ionViewWillEnter();
    });
 
    return await modal.present();

  }
}
