import { Component  } from '@angular/core';
import { ToastController, NavController, ModalController  } from '@ionic/angular';
import { IconContractService } from '../services/icon-contract/icon-contract.service';
import { LoadingController } from '@ionic/angular';
import { AddTokenModalPage } from '../addTokenModal/addTokenModal.page';
import { TokenModel } from '../services/settings/tokenModel'
import { TokenEnum } from '../services/settings/tokens'
import { SettingsService } from '../services/settings/settings.service';

@Component({
  selector: 'app-tokens',
  templateUrl: 'tokens.page.html',
  styleUrls: ['tokens.page.scss']
})
export class TokensPage {

  dataReturned:any[];
  public tokens: TokenModel[] = [];
  public tokenEnum = TokenEnum;
 
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
 
    if (settings && settings.addresses[0].tokens) {
      let tokens = settings.addresses[0].tokens;
      this.tokens = tokens;
      this.loadTokenBalances(settings.addresses[0].address, tokens);
    }
  }

  async loadTokenBalances(ownerAddress: string, tokens: TokenModel[]) {
    this.tokens = tokens;
    if (this.tokens) {
      const length = this.tokens.length; 
      for(let i=0; i<length; i++) {
        if(this.tokens[i].IsSelected) {
          const contractAddress = this.tokens[i].ContractAddress;
          this.tokens[i].Balance = await this.iconContract.getTokenBalance(contractAddress, ownerAddress); 
        }
      }
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
      cssClass: 'my-custom-modal-css'
    });
 
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.ionViewWillEnter();
      }
    });
 
    return await modal.present();
  }
}

