import { Injectable } from '@angular/core';
import { DeviceSettings, Address } from './settings';
import { AngularFirestore } from 'angularfire2/firestore';
import { FcmService } from '../fcm/fcm.service';
import { Storage } from '@ionic/storage';

@Injectable()
export class SettingsService {

  private deviceSettings: DeviceSettings = null;

  constructor(private storage: Storage,
              private afs: AngularFirestore,
              private fcm: FcmService) { }

  public async get(): Promise<DeviceSettings> {
    if (!this.deviceSettings) {
      //Load OLD Data Structure from storage
      this.deviceSettings = new DeviceSettings();
      this.storage.get('address').then(address => this.deviceSettings.addresses.p0.address = address);
      this.storage.get('enablePushIScoreChange').then(enablePushIScoreChange => this.deviceSettings.enablePushIScoreChange = enablePushIScoreChange);
      this.storage.get('enablePushDeposits').then(enablePushDeposits => this.deviceSettings.enablePushDeposits = enablePushDeposits);
      this.storage.get('enablePushProductivityDrop').then(enablePushProductivityDrop => this.deviceSettings.enablePushProductivityDrop = enablePushProductivityDrop);
      this.storage.get('showUSDValue').then(showUSDValue => this.deviceSettings.showUSDValue = showUSDValue);
      this.storage.get('tokens').then(tokens => this.deviceSettings.addresses.p0.tokens = tokens);

      //Get new data structure if it exists
      let settings = await this.storage.get('settings')
      if (settings) {
        this.deviceSettings = settings;
      }
    }
    return this.deviceSettings;
  }

  public async save(deviceSettings: DeviceSettings) {
    //Save local storage settings
    await this.storage.set('settings', Object.assign({}, deviceSettings));
    //Save to firestore if possible
    await this.saveToFcm(Object.assign({}, deviceSettings));    
  }
  
  private async saveToFcm(deviceSettings: DeviceSettings) {
    if (!deviceSettings.token) 
      deviceSettings.token = await this.fcm.getToken();

    const tokenRef = this.afs.collection('devices').doc(deviceSettings.token)

    tokenRef.get()
      .subscribe((docSnapshot) => {
        if (docSnapshot.exists) {
          tokenRef.update(Object.assign({}, deviceSettings));
        } else {
          tokenRef.set(Object.assign({}, deviceSettings));
        }
    });
  }

  public getActiveAddress() : Address {
    return this.deviceSettings.addresses.p0;
  }
}
