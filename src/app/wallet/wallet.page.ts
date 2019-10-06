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
   const hours = await this.iconContract.getUnstackedPeriod(this.address);
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
      type: "bar",
      data: {
        labels: ["Aug", "Sept", "Oct", "Nov", "Dec", "Jan"],
        datasets: [
          {
            label: '',
            data: [5, 10, 25, 100, 252, 400],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)"
            ],
            borderColor: [
              "rgba(255,99,132,1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)"
            ],
            borderWidth: 1
          }, 
          {
            label: '',
            data: [5, 10, 25, 100, 252, 400],

            // Changes this dataset to become a line
            type: 'line'
        }]
      },
      options: {
        legend: {
          display: false,
          defaultFontFamily: "'Open Sans',  sans-serif",
          defaultFontSize: 8
          
      },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    });

  }
}
