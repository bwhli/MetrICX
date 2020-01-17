import { Component  } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ToastController, NavController, ModalController  } from '@ionic/angular';
import { IconContractService } from '../services/icon-contract/icon-contract.service';
import { LoadingController } from '@ionic/angular';
import { AddTokenModalPage } from '../addTokenModal/addTokenModal.page';
import { TokenModel } from '../addTokenModal/tokenModel'
import { TokenEnum } from '../enums/tokens'
import { stringify } from 'querystring';


@Component({
  selector: 'app-tokens',
  templateUrl: 'tokens.page.html',
  styleUrls: ['tokens.page.scss']
})
export class TokensPage {

  dataReturned:any[];
  public tokens: TokenModel;
  public tokenModel: TokenModel[] = [];
  public address: string;
  public tapBalance: number = 0;
  public tapContract: string = 'cxc0b5b52c9f8b4251a47e91dda3bd61e5512cd782';
  public tokenEnum = TokenEnum;
 
  constructor(
    private storage: Storage,
    private toastController: ToastController,
    private iconContract: IconContractService,
    public loadingController: LoadingController,
    public navCtrl: NavController,
    public modalController: ModalController
  ) { }

  ionViewWillEnter() {
    //Update stored address
    this.storage.get('address').then(address => {
      this.address = address; 
      if (address) {
        this.loadTokenBalances();
      } else {
        this.navCtrl.navigateForward('/tabs/settings');
      }
    }); 
  }

  async loadTokenBalances() {
    await this.storage.get('tokens').then(async tokens => {   
        this.tokenModel = tokens;
        if (this.tokenModel) {
          const length = this.tokenModel.length; 
          for(let i=0; i<length; i++) {
            if(this.tokenModel[i].IsSelected) {
              var contractAddress: TokenEnum = TokenEnum[this.tokenModel[i].Token];
              this.tokenModel[i].Balance = await this.iconContract.getTokenBalance(contractAddress, this.address); 
            }
          }
        }
      });
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

