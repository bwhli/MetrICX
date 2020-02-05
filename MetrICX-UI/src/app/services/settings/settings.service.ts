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
      this.storage.get('address').then(address => this.deviceSettings.addresses_v2.p0.address = address);
      this.storage.get('enablePushIScoreChange').then(enablePushIScoreChange => this.deviceSettings.enablePushIScoreChange = enablePushIScoreChange);
      this.storage.get('enablePushDeposits').then(enablePushDeposits => this.deviceSettings.enablePushDeposits = enablePushDeposits);
      this.storage.get('enablePushProductivityDrop').then(enablePushProductivityDrop => this.deviceSettings.enablePushProductivityDrop = enablePushProductivityDrop);
      this.storage.get('showUSDValue').then(showUSDValue => this.deviceSettings.showUSDValue = showUSDValue);
      this.storage.get('tokens').then(tokens => this.deviceSettings.addresses_v2.p0.tokens = tokens);

      //Get new data structure if it exists
      let settings = await this.storage.get('settings')
      if (settings) {
        this.deviceSettings = settings;
        if (!this.deviceSettings.addresses_v2 && this.deviceSettings.addresses)
          this.deviceSettings.addresses_v2.p0 = this.deviceSettings.addresses[0];
      }
    }
    return this.deviceSettings;
  }

  public async save(deviceSettings: DeviceSettings) {
    if (!deviceSettings.token) 
      deviceSettings.token = await this.fcm.getToken();

    //Converts the class objects into pure java objects  
    let objectData = JSON.parse(JSON.stringify(deviceSettings));

    //Save local storage settings
    await this.storage.set('settings', objectData);
    //Save to firestore if possible
    await this.saveToFcm(deviceSettings.token, objectData);  
  }
  
  private async saveToFcm(token: string, objectData: any) {
    this.afs.collection('devices').doc(token).set(objectData, {merge:true});
  }

  public getActiveAddress() : Address {
    return this.deviceSettings.addresses_v2.p0;
  }
}
