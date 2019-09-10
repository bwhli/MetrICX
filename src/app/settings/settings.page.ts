import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';

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
    private toastController: ToastController
  ) {
    this.settingsForm = formBuilder.group({
      address: [null]}
    );

    //Update input value with stored address
    this.storage.get('address').then(address => this.settingsForm.patchValue({address: address}));
  }

  // Save to storage and display Toaster when done
  async save() {
    const address = this.settingsForm.controls['address'].value;
    await this.storage.set('address', address);
    this.presentToast();

    //TODO: Maybe go back to home page ???
  }
  
  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Your settings have been saved.',
      duration: 2000
    });
    toast.present();
  }

}
