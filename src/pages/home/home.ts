import { Component, Injectable  } from '@angular/core';
import { NavController, AlertController  } from 'ionic-angular';
import IconService, { HttpProvider } from 'icon-sdk-js';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  constructor(public navCtrl: NavController,   
			  public alertController: AlertController) 
			  { }
  
  async calc(){
	 
	  const httpProvider = new HttpProvider('https://ctz.solidwallet.io/api/v3');
	  const service = new IconService(httpProvider);

	  const balance = await service.getBalance('hx902ecb51c109183ace539f247b4ea1347fbf23b5').execute();
	  	  
	  console.log(httpProvider);
	  const alert = await this.alertController.create({
      title: 'ICX Balance',
      message: balance,
      buttons: ['Cancel']
    });

    await alert.present();
	
  }

}
