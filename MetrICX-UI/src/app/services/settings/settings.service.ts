import { Injectable } from '@angular/core';
import { DeviceSettings, Address } from './settings';
import { AngularFirestore } from 'angularfire2/firestore';
import { FcmService } from '../fcm/fcm.service';

@Injectable()
export class SettingsService {

  private deviceSettings = new DeviceSettings();

  constructor(private storage: Storage,
              private afs: AngularFirestore,
              private fcm: FcmService) { }

  public async get(): Promise<DeviceSettings> {
    if (!this.deviceSettings) {
      //Load OLD Data Structure from storage
      this.deviceSettings.addresses = [];
      this.deviceSettings.addresses.push(new Address());
      this.storage.get('address').then(address => this.deviceSettings.addresses[0].address = address);
      this.storage.get('enablePushIScoreChange').then(enablePushIScoreChange => this.deviceSettings.enablePushIScoreChange = enablePushIScoreChange);
      this.storage.get('enablePushDeposits').then(enablePushDeposits => this.deviceSettings.enablePushDeposits = enablePushDeposits);
      this.storage.get('enablePushProductivityDrop').then(enablePushProductivityDrop => this.deviceSettings.enablePushProductivityDrop = enablePushProductivityDrop);
      this.storage.get('showUSDValue').then(showUSDValue => this.deviceSettings.showUSDValue = showUSDValue);
      this.storage.get('tokens').then(tokens => this.deviceSettings.addresses[0].tokens = tokens);
      //Get new data structure if it exists
      this.storage.get('settings').then(settings => {
        if (settings) {
          this.deviceSettings = settings;
        }
      });
    }
    return this.deviceSettings;
  }

  public async save(deviceSettings: DeviceSettings) {
    //Save local storage settings
    await this.storage.set('settings', deviceSettings);
    //Save to firestore if possible
    await this.saveToFcm(deviceSettings);    
  }
  
  private async saveToFcm(deviceSettings: DeviceSettings) {
    if (!deviceSettings.token) 
      deviceSettings.token = await this.fcm.getToken();

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
