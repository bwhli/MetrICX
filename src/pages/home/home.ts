import { Component, Injectable  } from '@angular/core';
import { NavController, AlertController  } from 'ionic-angular';
import IconService, { HttpProvider, IconBuilder, IconConverter, IconAmount  } from 'icon-sdk-js';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';

const { CallBuilder } = IconBuilder;

type BigInt = number;
declare const BigInt: typeof Number;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
   
  public stakingForm: FormGroup;
  
  constructor(public navCtrl: NavController,   
			  public alertController: AlertController,
			  public formBuilder: FormBuilder,
			  public storage: Storage) 
			  { 
				this.stakingForm = formBuilder.group({
					amount: [null],
					network_perc: [null],
					address: [null]
				});
			  }
  
  async calc(){
	 const address = this.stakingForm.controls['address'].value;
	  
	 this.storage.set('address', address);
	  
	 const httpProvider = new HttpProvider('https://ctz.solidwallet.io/api/v3');
	 const iconService = new IconService(httpProvider);
	  
     
	 //hx1141b769011ee8399ef70f393b568ca15a6e22d7
	  const availableBalance = await iconService.getBalance(address).execute();
	  
	  const call = new CallBuilder()
				.to('cx0000000000000000000000000000000000000000')
				.method('getStake')
				.params({
							address: address
						})				
                .build();

     const getStake = await iconService.call(call).execute();
	 
	 const totalBalance = BigInt(BigInt(getStake['stake']) + BigInt(availableBalance)).toString();

	  const alert = await this.alertController.create({
      title: 'ICX Balance',
      message: totalBalance,
      buttons: ['Cancel']
    });

    await alert.present();
		 this.storage.get('address').then((val) => {
		 console.log(val);
	  });
	  
	
  }
  
}
