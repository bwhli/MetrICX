import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';
import { Chart } from 'chart.js';
import 'chartjs-plugin-labels';
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
     const splitTime = this.splitTime(hours);
     this.unstakePeriod = splitTime[0]['d'] + 'd : ' + splitTime[0]['h'] + 'h : ' + splitTime[0]['m'] + 'm';;
   } else {
     this.unstakePeriod = 'N/A';
   }
  }

  async loadClaim() {
    this.claim = await this.iconContract.getClaimableRewards(this.address);
  }

  splitTime(numberOfHours: number): object[] {
    const days = Math.floor(numberOfHours/24);
    const remainder = numberOfHours % 24;
    const hours = Math.floor(remainder);
    const minutes = Math.floor(60*(remainder-hours));
    return [{'d':days,'h': hours, 'm':minutes}]
  }

  doRefresh(event) {
    console.log('Begin async operation');

    setTimeout(() => {
      this.ngOnInit();
      event.target.complete();
    }, 2000);
  }

  calculateY(pv: number, r: number, n: number) : number {
    const rateOfInterest = r/100;
    return pv * (Math.pow((1 + (rateOfInterest/52)), n));
  }

  async generateLineData(){
    const rewardRate = await this.iconContract.getCurrentRewardRate();
    const pv = Math.floor(this.stake);
    const r = Math.floor(rewardRate);
    let y = new Array();
    let m = 0;
    const xmax = 52; //weekly
    let j = 0;
    let ma = [];
    for (let i = 0; i <= xmax; i++) {
        y[i] = this.calculateY(pv, r, i);
        m = i%4; //roughly every 4 weeks (monthly)
        if(m==0) {  
          ma[j]=y[i];
          j++;
        }
    }
    return ma;
  }

  async loadChart() { 
    this.generateLineData().then(data => {
      this.barChart = new Chart(this.barCanvas.nativeElement, {
          type: 'line',
          data: {
            labels: ['1', '2', '3', '4', '5', '6', '7','8', '9', '10', '11', '12'],
            datasets: [{
              borderColor: '#32b8bb',
              data: data,
          }]
        },
        options: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Monthly reward estimation (i-score claimed weekly)'
          },
          layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0
                    }
          }     
        }
      });
    });
  }
}
