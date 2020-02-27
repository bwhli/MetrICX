import { Component, Input  } from '@angular/core';
import { NavController, ModalController  } from '@ionic/angular';
import { IconContractService } from '../services/icon-contract/icon-contract.service';
import { LoadingController } from '@ionic/angular';
import { AddTokenModalPage } from '../addTokenModal/addTokenModal.page';
import { TokenSet, Address } from '../services/settings/settings';

@Component({
  selector: 'app-tokens',
  templateUrl: 'tokens.page.html',
  styleUrls: ['tokens.page.scss']
})
export class TokensPage {

  private _addressSetting: Address;
  public address: string;
  public _tokens: TokenSet;

  @Input("addresssetting")
  set addresssetting(value: Address) {
      this._addressSetting = value;
      this.address = this._addressSetting.address;
      this._tokens = this._addressSetting.tokens; 
      this.loadTokenBalances();    
  }

  get addresssetting(): Address {
      return this._addressSetting;
  }

  dataReturned:any[];
  public Tokens;
  public tokenCount: number = 0;

  constructor(
    private iconContract: IconContractService,
    public loadingController: LoadingController,
    public navCtrl: NavController,
    public modalController: ModalController) { }


  async loadTokenBalances() {
    if (this._tokens) {
      Object.keys(this._tokens).forEach(async key => {
        if(this._tokens[key].IsSelected) {
          const contractAddress = this._tokens[key].ContractAddress;
          this._tokens[key].Balance = await this.iconContract.getTokenBalance(contractAddress, this.address); 
          this.tokenCount++;
        }
        else{
          this.tokenCount = 0;
        }
      });
    }
  }

  async doRefresh(event) {
    setTimeout(() => {
      this.loadTokenBalances();
      event.target.complete();
    }, 2000);
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: AddTokenModalPage,
      cssClass: 'address-modal-css',
      componentProps: {
        key: this._addressSetting
     }
    });
 
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.loadTokenBalances();
      }
    });
    return await modal.present();
  }
}

