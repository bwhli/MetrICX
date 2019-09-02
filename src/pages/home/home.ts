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
	 
	  const httpProvider = new HttpProvider('https://ctz.solidwallet.io/api/v3');
	  const iconService = new IconService(httpProvider);
     
	  const balance = await iconService.getBalance('hx5af8bd1b5cdc321a53ead7a836601ce8e2c938c9').execute();
	  
	  const call = new CallBuilder()
				.to('cx0000000000000000000000000000000000000000')
				.method('getStake')
				.params({
							address: 'hx1141b769011ee8399ef70f393b568ca15a6e22d7'
						})				
                .build();

     const getStake = await iconService.call(call).execute();
	 const stake = BigInt(getStake['stake']).toString();
	
	 console.log(IconConverter.toBigNumber(IconAmount.of(stake, IconAmount.Unit.ICX).convertUnit(IconAmount.Unit.LOOP)));

	  const alert = await this.alertController.create({
      title: 'ICX Balance',
      message: stake,
      buttons: ['Cancel']
    });

    await alert.present();
	
  }
  
  
  


}
