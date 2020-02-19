import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
//import { Storage } from '@ionic/storage';
import { ToastController, NavController } from '@ionic/angular';
//import { Chart } from 'chart.js';
//import 'chartjs-plugin-labels';
//import { IconContractService } from '../services/icon-contract/icon-contract.service';
import { LoadingController } from '@ionic/angular';
import { SettingsService } from '../services/settings/settings.service';
import { DeviceSettings, MapArray, Address } from '../services/settings/settings';
import { WalletPage } from '../wallet/wallet.page';

@Component({
  selector: 'app-wallet-tab',
  templateUrl: 'wallet-tab.page.html',
  styleUrls: ['wallet-tab.page.scss']
})
export class WalletTabPage {

  //@ViewChild("barCanvas", {static:false}) barCanvas: ElementRef;

  public Addresses: any //MapArray<Address>;

  constructor(
    private toastController: ToastController,
    public loadingController: LoadingController,
    public navCtrl: NavController,
    private settingsService: SettingsService
  ) { }

  async ionViewWillEnter() {
    this.Addresses = (await this.settingsService.get()).addresses_v2;
  }

}
