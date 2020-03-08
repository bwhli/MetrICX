import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ToastController, NavController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { SettingsService } from '../services/settings/settings.service';
import { NgZone  } from '@angular/core';

@Component({
  selector: 'app-wallet-tab',
  templateUrl: 'wallet-tab.page.html',
  styleUrls: ['wallet-tab.page.scss']
})
export class WalletTabPage {
  public Addresses: any //MapArray<Address>;

  constructor(
    private toastController: ToastController,
    public loadingController: LoadingController,
    public navCtrl: NavController,
    private settingsService: SettingsService
  ) { }

  async ionViewWillEnter() {
    this.Addresses = (await this.settingsService.get()).addresses_v2;
    if (this.Addresses.getLength() == 0)
      this.navCtrl.navigateForward('/tabs/settings')
  }
}
