import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';
import IconService, { HttpProvider, IconBuilder, IconConverter, IconAmount  } from 'icon-sdk-js';

const { CallBuilder } = IconBuilder;

@Component({
  selector: 'app-wallet',
  templateUrl: 'wallet.page.html',
  styleUrls: ['wallet.page.scss']
})
export class WalletPage {

  public address: string;
  public balance: number;
  public stake: number;
  public claim: number;

  constructor(
    private storage: Storage,
    private toastController: ToastController
  ) {
    //Update stored address
    this.storage.get('address').then(address => {
      this.address = address; 
      this.loadWallet();
      this.loadStake();
      this.loadClaim();
    });
  }

  async loadWallet() {
    const httpProvider = new HttpProvider('https://ctz.solidwallet.io/api/v3');
    const iconService = new IconService(httpProvider);
    const bigBalance = await iconService.getBalance(this.address).execute();
    this.balance = 1 * bigBalance / 10**18
  }

  async loadStake() {
    const httpProvider = new HttpProvider('https://ctz.solidwallet.io/api/v3');
    const iconService = new IconService(httpProvider);
    
	  const call = new CallBuilder()
      .to('cx0000000000000000000000000000000000000000')
      .method('getStake')
      .params({
          address: this.address
      })				
      .build();

      var response = await iconService.call(call).execute();
      const bigStakedAmount = response['stake'];
      this.stake = 1 * bigStakedAmount / 10**18 ;
  }

  async loadClaim() {
    const httpProvider = new HttpProvider('https://ctz.solidwallet.io/api/v3');
    const iconService = new IconService(httpProvider);
    
	  const call = new CallBuilder()
      .to('cx0000000000000000000000000000000000000000')
      .method('queryIScore')
      .params({
          address: this.address
      })				
      .build();

      var response = await iconService.call(call).execute();
      const bigAmount = response['estimatedICX'];
      this.claim = 1 * bigAmount / 10**18 ;
      
  }
}
