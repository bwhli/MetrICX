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
import { SettingsService } from '../services/settings/settings.service';

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

    private fcm: FcmService,
    private barcodeScanner: BarcodeScanner,   
    private settingsService: SettingsService, 
   
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

  async ionViewWillEnter()  {
    var settings = await this.settingsService.get();
    if (settings.addresses && settings.addresses.length > 0) 
      this.settingsForm.patchValue({address: settings.addresses[0].address});
    this.settingsForm.patchValue({enablePushIScoreChange: settings.enablePushIScoreChange});
    this.settingsForm.patchValue({enablePushDeposits: settings.enablePushDeposits});
    this.settingsForm.patchValue({enablePushProductivityDrop: settings.enablePushProductivityDrop});
    this.settingsForm.patchValue({showUSDValue: settings.showUSDValue});
  }

  // Save to storage and display Toaster when done
  async save() {
    var settings = await this.settingsService.get();
    settings.addresses[0].address = this.settingsForm.controls['address'].value; //This would need refactoring with new UI
    settings.enablePushIScoreChange = this.settingsForm.controls['enablePushIScoreChange'].value;
    settings.enablePushDeposits = this.settingsForm.controls['enablePushDeposits'].value;
    settings.enablePushProductivityDrop = this.settingsForm.controls['enablePushProductivityDrop'].value;
    settings.showUSDValue = this.settingsForm.controls['showUSDValue'].value;

    try {
      //Save to local storage
      this.settingsService.save(settings);
      this.presentToast();
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

  async scanQR () {
    this.barcodeScanner.scan().then(
      barcodeData => {
       this.settingsForm.patchValue({address: barcodeData.text});
      }
    );
  }

}
