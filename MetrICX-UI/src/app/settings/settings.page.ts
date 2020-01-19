import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { FcmService } from '../services/fcm/fcm.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

//not used at the moment but if we want to show the QR Canvas we can use this
import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';
import { DeviceSettings, Address } from './settings';


@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss']
})
export class SettingsPage {
  public settingsForm: FormGroup;
  //this is used for drawing the QR Code
  public elementType: 'url' | 'canvas' | 'img' = 'canvas';

  constructor(
    private formBuilder: FormBuilder,
    private storage: Storage,
    private toastController: ToastController,
    public navCtrl: NavController,
    private afs: AngularFirestore,
    private fcm: FcmService,
    private barcodeScanner: BarcodeScanner,    
   
    //this will be used if we want to show the QR Code as well
    private base64ToGallery: Base64ToGallery) {
    this.settingsForm = formBuilder.group({
      address: [null],
      enablePushIScoreChange: [false],
      enablePushDeposits: [false],
      enablePushProductivityDrop: ["disabled"],
      showUSDValue: [false]}
    );
  }

  ionViewWillEnter()  {
    //Load OLD Data Structure from storage
    this.storage.get('address').then(address => this.settingsForm.patchValue({address: address}));
    this.storage.get('enablePushIScoreChange').then(enablePushIScoreChange => this.settingsForm.patchValue({enablePushIScoreChange: enablePushIScoreChange}));
    this.storage.get('enablePushDeposits').then(enablePushDeposits => this.settingsForm.patchValue({enablePushDeposits: enablePushDeposits}));
    this.storage.get('enablePushProductivityDrop').then(enablePushProductivityDrop => this.settingsForm.patchValue({enablePushProductivityDrop: enablePushProductivityDrop}));
    this.storage.get('showUSDValue').then(showUSDValue => this.settingsForm.patchValue({showUSDValue: showUSDValue}));

    //Get new data structure if it exists
    this.storage.get('settings').then(settings => { 
      if (settings) {
        if (settings.addresses && settings.addresses.length > 0) 
          this.settingsForm.patchValue({address: settings.addresses[0].address});
        this.settingsForm.patchValue({enablePushIScoreChange: settings.enablePushIScoreChange});
        this.settingsForm.patchValue({enablePushDeposits: settings.enablePushDeposits});
        this.settingsForm.patchValue({enablePushProductivityDrop: settings.enablePushProductivityDrop});
        this.settingsForm.patchValue({showUSDValue: settings.showUSDValue});
      }
    });
  }

  // Save to storage and display Toaster when done
  async save() {
    var deviceSettings = new DeviceSettings(); 

    deviceSettings.addresses = [];
    deviceSettings.addresses.push(new Address());
    deviceSettings.addresses[0].address = this.settingsForm.controls['address'].value; //This would need refactoring with new UI
    deviceSettings.enablePushIScoreChange = this.settingsForm.controls['enablePushIScoreChange'].value;
    deviceSettings.enablePushDeposits = this.settingsForm.controls['enablePushDeposits'].value;
    deviceSettings.enablePushProductivityDrop = this.settingsForm.controls['enablePushProductivityDrop'].value;
    deviceSettings.showUSDValue = this.settingsForm.controls['showUSDValue'].value;

    try {
      //Save to local storage
      this.saveToStorage(deviceSettings);

      const token = await this.fcm.getToken();
      // Save this device id and address in FireStore for push Notifications
      this.saveToFcm(deviceSettings);
      this.presentToast();
    }
    catch {
      if (deviceSettings.enablePushDeposits || deviceSettings.enablePushIScoreChange || deviceSettings.enablePushProductivityDrop) {
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

    //firebase failed most likely because of permissions issues for push notifications
    //reset the settings so the user is not confussed wondering why notifications are not working
    //even though they are enabled on the UI
    this.saveToStorage(deviceSettings);
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

  async saveToStorage(deviceSettings: DeviceSettings) {
    //Save local storage settings
    await this.storage.set('settings', deviceSettings);
  }

  async scanQR () {
    this.barcodeScanner.scan().then(
      barcodeData => {
       this.settingsForm.patchValue({address: barcodeData.text});
      }
    );
  }

  private saveToFcm(deviceSettings: DeviceSettings) {
    if (!deviceSettings.token) return;

    const tokenRef = this.afs.collection('devices').doc(deviceSettings.token)

    tokenRef.get()
      .subscribe((docSnapshot) => {
        if (docSnapshot.exists) {
          tokenRef.update(deviceSettings);
        } else {
          tokenRef.set(deviceSettings);
        }
    });
  }
}
