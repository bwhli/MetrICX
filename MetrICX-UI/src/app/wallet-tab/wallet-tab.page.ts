import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ToastController, NavController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { SettingsService } from '../services/settings/settings.service';
import { SuperTabs } from '@ionic-super-tabs/angular';
import { SuperTabChangeEventDetail } from '@ionic-super-tabs/core';

@Component({
  selector: 'app-wallet-tab',
  templateUrl: 'wallet-tab.page.html',
  styleUrls: ['wallet-tab.page.scss']
})
export class WalletTabPage {
  public Addresses: any //MapArray<Address>;
  @ViewChild('superTabs', { static: false, read: SuperTabs }) st: SuperTabs;

  public activeTabIndex: number;
  private lastPosition: number = 0;



  constructor(
    public loadingController: LoadingController,
    public navCtrl: NavController,
    private settingsService: SettingsService
  ) { }

  async ionViewWillEnter() {
    this.Addresses = (await this.settingsService.get()).addresses_v2;
    if (this.Addresses.getLength() == 0) {
      this.navCtrl.navigateForward('/tabs/settings')
    }

    var nextSlot = await this.settingsService.getNextSlot(false);
    //if the nextSlot available is 0 it means the first address has been removed
    //so we need to set the first tab to 1;
    if (Number(nextSlot) == 0) {
      console.log("here");
      this.st.activeTabIndex = 0;
      this.st.selectTab(1, false);
    }
  }

  async onTabChange(ev: CustomEvent<SuperTabChangeEventDetail>) {
    this.lastPosition = this.activeTabIndex; 
    this.activeTabIndex = ev.detail.index;

    var nextSlot = await this.settingsService.getNextSwipeIndex(this.lastPosition, this.activeTabIndex);

  //  var nextSlot = await this.settingsService.getNextSlot(false);
   // if(this.activeTabIndex == Number(nextSlot)) {
    //    this.st.selectTab(this.activeTabIndex-1, true);
        //tab doesnt exist
     // }
   // }
    //catch {
      
   // }
  }

  selectTab(index: number) {
    this.st.selectTab(index, true);
  }
}
