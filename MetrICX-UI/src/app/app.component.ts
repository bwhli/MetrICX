import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FcmService } from './services/fcm/fcm.service';
//import { ToastService } from './shared/service/toast.service';
import { ToastController } from '@ionic/angular';
import { ScreenOrientation } from  '@ionic-native/screen-orientation/ngx'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private fcm: FcmService,
    //private toastr: ToastService,
    public toastController: ToastController,
    private screenOrientation: ScreenOrientation
  ) { }

  async ionViewDidEnter() {
    this.platform.ready().then(() => { 
      setTimeout(() => {
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
        this.splashScreen.hide();
        this.statusBar.backgroundColorByName("black");
        this.statusBar.styleLightContent();
        this.statusBar.overlaysWebView(false);
        this.notificationSetup();
      }, 3000);
    });
  }

  private async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 3000
    });
    toast.present();
  }

  private async notificationSetup() {
    this.fcm.getToken();
    this.fcm.onNotifications().subscribe(
      (msg) => {
        if (this.platform.is('ios')) {
          this.presentToast(msg.aps.body);
        } else {
          this.presentToast(msg.body);
        }
      });
  }
}
