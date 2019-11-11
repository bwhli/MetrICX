import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { FcmService } from '../services/fcm/fcm.service';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss']
})
export class SettingsPage {

  public settingsForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private storage: Storage,
    private toastController: ToastController,
    public navCtrl: NavController,
    private afs: AngularFirestore,
    private fcm: FcmService
    ) {
    this.settingsForm = formBuilder.group({
      address: [null],
      enablePushIScoreChange: [false],
      enablePushProductivityDrop: [false]}
    );

    //Update input value with stored address
    this.storage.get('address').then(address => this.settingsForm.patchValue({address: address}));
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

  private saveToFcm(token: string, address: string, enablePushIScoreChange: boolean, enablePushProductivityDrop: boolean) {
    if (!token) return;

    const devicesRef = this.afs.collection('devices');

    const data = {
      token: token,
      address: address,
      enablePushIScoreChange: enablePushIScoreChange,
      enablePushProductivityDrop: enablePushProductivityDrop
    };

    return devicesRef.doc(token).set(data);
  }
}
