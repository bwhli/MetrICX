import { Injectable } from '@angular/core';
import { DeviceSettings, Address, MapArray } from './settings';
import { AngularFirestore } from 'angularfire2/firestore';
import { FcmService } from '../fcm/fcm.service';
import { Storage } from '@ionic/storage';
import { SharedService } from '../shared/shared.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class SettingsService {

  private deviceSettings: DeviceSettings = null;
  private MaxAddresses: number = 5;

  constructor(private storage: Storage,
              private afs: AngularFirestore,
              private fcm: FcmService,
              private sharedService: SharedService) { }

  public async get(): Promise<DeviceSettings> {
    if (!this.deviceSettings) {
      //Load OLD Data Structure from storage
      this.deviceSettings = new DeviceSettings();
      this.storage.get('address').then(address => {
        if (address) {
          this.deviceSettings.addresses_v2.p0 = new Address();
          this.deviceSettings.addresses_v2.p0.address = address;
        }
      });
      this.storage.get('enablePushIScoreChange').then(enablePushIScoreChange => this.deviceSettings.enablePushIScoreChange = enablePushIScoreChange);
      this.storage.get('enablePushDeposits').then(enablePushDeposits => this.deviceSettings.enablePushDeposits = enablePushDeposits);
      this.storage.get('enablePushProductivityDrop').then(enablePushProductivityDrop => this.deviceSettings.enablePushProductivityDrop = enablePushProductivityDrop);
      this.storage.get('showUSDValue').then(showUSDValue => this.deviceSettings.showUSDValue = showUSDValue);
      this.storage.get('tokens').then(tokens => {
        if (tokens) {
          this.deviceSettings.addresses_v2.p0 = new Address();
          this.deviceSettings.addresses_v2.p0.tokens = tokens;
        }
      });

      //Get new data structure if it exists
      let settings = await this.storage.get('settings')
      if (settings) {
        this.deviceSettings = settings;
        if (!this.deviceSettings.addresses_v2 && this.deviceSettings.addresses) {
          this.deviceSettings.addresses_v2 = new MapArray<Address>();
          if (this.deviceSettings.addresses.length > 0)
            this.deviceSettings.addresses_v2.p0 = this.deviceSettings.addresses[0];
        }
      }
    }
    return this.deviceSettings;
  }

  public async save(deviceSettings: DeviceSettings) {

    if (!deviceSettings.token) 
      deviceSettings.token = await this.fcm.getToken();

    await this.sharedService.changeData(deviceSettings);

    //Converts the class objects into pure java objects  
    let objectData = JSON.parse(JSON.stringify(deviceSettings));

    //Save local storage settings
    await this.storage.set('settings', objectData);
    //emit changes to observable function
  
    //Save to firestore if possible
    await this.saveToFcm(deviceSettings.token, objectData);  
  } 
  
  private async saveToFcm(token: string, objectData: any) {
    try {
        this.afs.collection('devices').doc(token).set(objectData, {merge:true});
    }
    catch {}
  }

  public getActiveAddress() : Address {
    return this.deviceSettings.addresses_v2.p0;
  }

  public async updateAndSave(key: string, address: string, nickName: string, enablePushDeposits: boolean) : Promise<boolean> {
    try {
      var deviceSettings = await this.get();
      deviceSettings.addresses_v2[key].address = address;
      deviceSettings.addresses_v2[key].Nickname = nickName;
      deviceSettings.addresses_v2[key].enablePushDeposits = enablePushDeposits;
      this.save(deviceSettings);
      return true;
    }
    catch{
      return false;
    }
  } 


  public async addAddressAndSave(newAddress: string, nickname: string, enablePushDeposits: boolean) : Promise<boolean>{
      var deviceSettings = await this.get();
      var nextSlot = await this.getNextSlot();

      if(nextSlot) {
        deviceSettings.addresses_v2[nextSlot] = new Address();
        deviceSettings.addresses_v2[nextSlot].address = newAddress;
        deviceSettings.addresses_v2[nextSlot].Nickname = nickname;
        deviceSettings.addresses_v2[nextSlot].enablePushDeposits = enablePushDeposits;
        this.save(deviceSettings);
        return true;
      }

      return false;
  }

  public async deleteAddress(key: string) {
    var deviceSettings = await this.get();
    delete deviceSettings.addresses_v2[key]; 
    this.save(deviceSettings);
  }

  public async getNextSlot() : Promise<string> {
    var addressObjects = new Array(this.MaxAddresses);
    var deviceSettings = await this.get();

    Object.keys(deviceSettings.addresses_v2).forEach(async key =>  { 
      if(deviceSettings.addresses_v2[key]) {
        var keyIndex: number = parseInt(key.charAt(1));
        addressObjects[keyIndex] = key;
      }
    });

    for(var i = 0; i < addressObjects.length; i++) {
      if(!addressObjects[i])
      {
          return 'p'+i;
      }
    }
     return '' //no empty slots available;
  }

  public async getPrepDetails(prepAddress: string) : Promise<any> {
    var prep = await this.afs.collection('preps').doc(prepAddress).get().toPromise();
    if (prep.exists) {
      var details = prep.data().DetailInfo;
      return JSON.parse(details);
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
  }
  
  async getLength(): Promise<number> {
    var deviceSettings = await this.get();
    var length = 0;

    Object.keys(deviceSettings.addresses_v2).forEach(async key =>  { 
        if(deviceSettings.addresses_v2[key].address) {
            length++;
        }
    });
    return length;
  }

  async getByIndex(index: number): Promise<Address> {
    var deviceSettings = await this.get();
    var currentIndex = -1;
    var address = null;

    Object.keys(deviceSettings.addresses_v2).forEach(key =>  { 
        if(deviceSettings.addresses_v2[key].address) {
            currentIndex++;
            if (currentIndex == index) {
              address = deviceSettings.addresses_v2[key];
            }
        }
    });

    console.log(address);

    return address;
  }
}