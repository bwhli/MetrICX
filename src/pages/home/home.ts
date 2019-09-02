import { Component, Injectable  } from '@angular/core';
import { NavController, AlertController  } from 'ionic-angular';
import IconService, { HttpProvider, IconBuilder, IconConverter, IconAmount  } from 'icon-sdk-js';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

const { CallBuilder } = IconBuilder;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
   
  public stakingForm: FormGroup;
  
  constructor(public navCtrl: NavController,   
			  public alertController: AlertController,
			  public formBuilder: FormBuilder) 
			  { 
				this.stakingForm = formBuilder.group({
					amount: [null],
					network_perc: [null],
					address: [null]
				});
			  }
  
  async calc(){
	  var address = this.stakingForm.controls['address'].value;
	  const httpProvider = new HttpProvider('https://ctz.solidwallet.io/api/v3');
	  const iconService = new IconService(httpProvider);
	  console.log(address);
     
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
	 const stake = BigInt(getStake['stake']);
	 
	 const totalBalance = BigInt(BigInt(getStake['stake']) + BigInt(availableBalance)).toString();

	  const alert = await this.alertController.create({
      title: 'ICX Balance',
      message: totalBalance,
      buttons: ['Cancel']
    });

    await alert.present();
  }
  
}
