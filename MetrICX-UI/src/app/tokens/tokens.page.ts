import { Component  } from '@angular/core';
import { ToastController, NavController, ModalController  } from '@ionic/angular';
import { IconContractService } from '../services/icon-contract/icon-contract.service';
import { LoadingController } from '@ionic/angular';
import { AddTokenModalPage } from '../addTokenModal/addTokenModal.page';
import { SettingsService } from '../services/settings/settings.service';
import { DeviceSettings, TokenSet, Address } from '../services/settings/settings';

@Component({
  selector: 'app-tokens',
  templateUrl: 'tokens.page.html',
  styleUrls: ['tokens.page.scss']
})
export class TokensPage {

  dataReturned:any[];
  public Tokens;
  public tokenCount: number = 0;

  constructor(
    private toastController: ToastController,
    private iconContract: IconContractService,
    public loadingController: LoadingController,
    public navCtrl: NavController,
    public modalController: ModalController,  
    private settingsService: SettingsService

  ) { }

  async ionViewWillEnter() {
    var settings = await this.settingsService.get();
 
    if (settings && settings.addresses_v2.p0.tokens) {
       this.loadTokenBalances(settings.addresses_v2.p0);
    }
    else {
      this.tokenCount = 0;
    }
  }

  async loadTokenBalances(address: Address) {
    this.Tokens = address.tokens;
    if (this.Tokens) {
      Object.keys(this.Tokens).forEach(async key => {
        if(this.Tokens[key].IsSelected) {
          const contractAddress = this.Tokens[key].ContractAddress;
          this.Tokens[key].Balance = await this.iconContract.getTokenBalance(contractAddress, address.address); 
          this.tokenCount++;
        }
      });
    }
  }

  doRefresh(event) {
    setTimeout(() => {
      this.ionViewWillEnter();
      event.target.complete();
    }, 2000);
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: AddTokenModalPage,
      cssClass: 'address-modal-css'
    });
 
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.ionViewWillEnter();
      }
    });
 
    return await modal.present();
  }
}

