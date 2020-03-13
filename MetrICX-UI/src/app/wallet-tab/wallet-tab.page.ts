import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ToastController, NavController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { SettingsService } from '../services/settings/settings.service';
import { SuperTabs } from '@ionic-super-tabs/angular';
import { Address } from '../services/settings/settings';

@Component({
  selector: 'app-wallet-tab',
  templateUrl: 'wallet-tab.page.html',
  styleUrls: ['wallet-tab.page.scss']
})
export class WalletTabPage {
  @ViewChild('superTabs', { static: false, read: SuperTabs }) st: SuperTabs;

  public Addresses: any //MapArray<Address>;
  public activeTabIndex: number;

  public address_0: Address;
  public address_1: Address;
  public address_2: Address;
  public address_3: Address;
  public address_4: Address;

  constructor(
    public toastController: ToastController,
    public loadingController: LoadingController,
    public navCtrl: NavController,
    public settingsService: SettingsService    
  ) { }

  async ionViewWillEnter() {
    var length = await this.settingsService.getLength();
    if (length == 0) {
      this.navCtrl.navigateForward('/tabs/settings');
      return;
    }
    this.address_0 = await this.settingsService.getByIndex(0);
    if (length > 1) this.address_1 = await this.settingsService.getByIndex(1);
    if (length > 2) this.address_2 = await this.settingsService.getByIndex(2);
    if (length > 3) this.address_3 = await this.settingsService.getByIndex(3);
    if (length > 4) this.address_4 = await this.settingsService.getByIndex(4);
  }

  async onTabChange(newTabIndexEvent: CustomEvent<number>) {
    var length = await this.settingsService.getLength();
    if (newTabIndexEvent.detail > length - 1) {
      setTimeout(()=> this.st.selectTab(0, true), 100);
    }
  }
}