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
    private base64ToGallery: Base64ToGallery
   
    ) {
    this.settingsForm = formBuilder.group({
      address: [null],
      enablePushIScoreChange: [false],
      enablePushProductivityDrop: [false]}
    );

    //Update input value with stored address
    this.storage.get('address').then(address => this.settingsForm.patchValue({address: address}));
    this.storage.get('enablePushIScoreChange').then(enablePushIScoreChange => this.settingsForm.patchValue({enablePushIScoreChange: enablePushIScoreChange}));
    this.storage.get('enablePushProductivityDrop').then(enablePushProductivityDrop => this.settingsForm.patchValue({enablePushProductivityDrop: enablePushProductivityDrop}));
  }

  // Save to storage and display Toaster when done
  async save() {
    const address = this.settingsForm.controls['address'].value;
    const enablePushIScoreChange = this.settingsForm.controls['enablePushIScoreChange'].value;
    const enablePushProductivityDrop = this.settingsForm.controls['enablePushProductivityDrop'].value;
    const token = await this.fcm.getToken();

    // Save to local storage
    this.saveToStorage(address, enablePushIScoreChange, enablePushProductivityDrop);

    // Save this device id and address in FireStore for push Notifications
    this.saveToFcm(token, address, enablePushIScoreChange, enablePushProductivityDrop);

    //Save message and redirect
    this.presentToast();
    this.navCtrl.navigateForward('/tabs/wallet');
  }
  
  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Your settings have been saved.',
      duration: 2000
    });
    toast.present();
  }

  async saveToStorage(address: string, enablePushIScoreChange: boolean, enablePushProductivityDrop: boolean) {
    //Save local storage settings
    await this.storage.set('address', address);
    await this.storage.set('enablePushIScoreChange', enablePushIScoreChange);
    await this.storage.set('enablePushProductivityDrop', enablePushProductivityDrop);
  }

 async scanQR () {
    this.barcodeScanner.scan().then(
      barcodeData => {
       this.settingsForm.patchValue({address: barcodeData.text});
      }
    );
 }

  private saveToFcm(token: string, address: string, enablePushIScoreChange: boolean, enablePushProductivityDrop: boolean) {
    if (!token) return;

    const data = {
      token: token,
      address: address,
      enablePushIScoreChange: enablePushIScoreChange,
      enablePushProductivityDrop: enablePushProductivityDrop
    };

    const tokenRef = this.afs.collection('devices').doc(token)

    tokenRef.get()
      .subscribe((docSnapshot) => {
        if (docSnapshot.exists) {
          tokenRef.update(data);
        } else {
          tokenRef.set(data);
        }
    });
  }
}
