import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';
import { Chart } from 'chart.js';
import { IconContractService } from '../services/icon-contract/icon-contract.service';
import { LoadingController } from '@ionic/angular';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-wallet',
  templateUrl: 'wallet.page.html',
  styleUrls: ['wallet.page.scss']
})
export class WalletPage implements OnInit {

  @ViewChild("barCanvas", {static:false}) barCanvas: ElementRef;

  public address: string;
  public balance: number = 0;
  public stake = 0;
  public claim = 0;
  public networkedStaked = 0;
  public unstakePeriod: string;
  private barChart: Chart;
  public loaded: boolean = false;

  constructor(
    private storage: Storage,
    private toastController: ToastController,
    private iconContract: IconContractService,
    public loadingController: LoadingController,
    public navCtrl: NavController
  ) { }

  ngOnInit () { 
    //Update stored address
    this.storage.get('address').then(address => {
      this.address = address; 
      if (address) {
        this.presentLoading();
        this.loadWallet();
        this.loadStake();
        this.loadUnstake();
        this.loadClaim();
        this.loadChart();
        this.loaded = true;
      } else {
        this.navCtrl.navigateForward('/tabs/settings');
      }
    }); 
  }

  async presentLoading() {
      if(!this.loaded) {
      const loading = await this.loadingController.create({
        message: 'Loading',
        duration: 1000
      });
      await loading.present();
      const { role, data } = await loading.onDidDismiss();
    }
  }

  async loadWallet() {
    this.balance = await this.iconContract.getBalance(this.address);
  }

  async loadStake() {
    this.stake = await this.iconContract.getStakedAmount(this.address);
  }

  async loadUnstake() {
   const hours = await this.iconContract.getUnstakedPeriod(this.address);
   if (hours > 0) {
     const splitTime = this.SplitTime(hours);
     this.unstakePeriod = splitTime[0]['d'] + 'd : ' + splitTime[0]['h'] + 'h : ' + splitTime[0]['m'] + 'm';;
   } else {
     this.unstakePeriod = 'N/A';
   }
  }

  async loadClaim() {
    this.claim = await this.iconContract.getClaimableRewards(this.address);
  }

  SplitTime(numberOfHours : number): object[] {
    var Days = Math.floor(numberOfHours/24);
    var Remainder = numberOfHours % 24;
    var Hours = Math.floor(Remainder);
    var Minutes = Math.floor(60*(Remainder-Hours));
    return [{'d':Days,'h': Hours, 'm':Minutes}]
  }

  doRefresh(event) {
    console.log('Begin async operation');

    setTimeout(() => {
      this.ngOnInit();
      event.target.complete();
    }, 2000);
  }


  async loadChart() {

  //  await this.iconContract.getPReps(this.address);

    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'line',
			data: {
				labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
				datasets: [{
					label: '',
					data: [
						10000,
						10007,
						10012,
						10020,
						10030,
						10041,
						10055
					],
					fill: false,
        }]
      }
    });
  }
}
