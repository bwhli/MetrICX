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
  public _tokens: any;
  public icxDivs: number;
  private TotalTap: number = 500000000;

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
    this.presentLoading()
    if (this._tokens) {
      Object.keys(this._tokens).forEach(async key => {
        if(this._tokens[key].IsSelected) {
          const contractAddress = this._tokens[key].ContractAddress;
          this._tokens[key].Balance = await this.iconContract.getTokenBalance(contractAddress, this.address); 
          this.tokenCount++;
          if(key == 'TAP') {
             const excess = await this.iconContract.GetTapDividends();
             const getTotalTapReleased= await this.iconContract.getTokenBalance('cxc0b5b52c9f8b4251a47e91dda3bd61e5512cd782','cx3b9955d507ace8ac27080ed64948e89783a62ab1')
             const balanceTap = this.TotalTap - getTotalTapReleased;
             this.icxDivs = (0.8) * excess * (this._tokens[key].Balance / balanceTap);
             if(this.icxDivs < 0) {
               this.icxDivs = 0;
             }
          }
        }
        else{
          this.tokenCount = 0;
        }
      });
    }
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      spinner: null,
      message: '<ion-img src="assets/loading-spinner-trans.gif" alt="loading..."></ion-img>',
      cssClass: 'loading-css',
      showBackdrop: false,
      duration: 1000
    });
    await loading.present();
  }

  async doRefresh(event) {
      this.loadTokenBalances();
      event.target.complete();
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

