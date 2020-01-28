import { Component, OnInit } from '@angular/core';
import { DeviceSettings } from '../services/settings/settings';
import { SharedService } from '../services/shared/shared.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {

   public deviceSettings: DeviceSettings;
   public activeWallet: string;

   constructor(private sharedService: SharedService) { 
    
   }

   ngOnInit() {
    this.sharedService.newData.subscribe((data) => {
      this.deviceSettings = data;
      this.activeWallet = this.deviceSettings.addresses[0].Nickname;
    });
  
   }
}