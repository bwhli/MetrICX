import { Component } from '@angular/core';
import { NavController, AlertController  } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, 
              public alertController: AlertController ) {

  }
  
  async calc(){
	  const alert = await this.alertController.create({
      title: 'Alert',
      message: 'This is an alert message.',
      buttons: ['Cancel', 'Open Modal', 'Delete']
    });

    await alert.present();
  }

}
