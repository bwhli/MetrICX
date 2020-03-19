import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import {  NavController,  } from '@ionic/angular';
import { Chart } from 'chart.js';
import 'chartjs-plugin-labels';
import { IconContractService } from '../services/icon-contract/icon-contract.service';
import { LoadingController } from '@ionic/angular';
import { SettingsService } from '../services/settings/settings.service';
import { Address, DeviceSettings } from '../services/settings/settings';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-wallet',
  templateUrl: 'wallet.page.html',
  styleUrls: ['wallet.page.scss']
})
export class WalletPage {
  private _addressSetting: Address;

  @Input("addresssetting")
  set addresssetting(value: Address) {
      this._addressSetting = value;
      this.address = this._addressSetting.address; 
      if (this.address) {
        this.ionViewWillEnter();
        this.loaded = true;  
      }
  }
  get asyncaddresssetting(): Address {
      return this._addressSetting;
  }

  @ViewChild("barCanvas", {static:false}) barCanvas: ElementRef;

  private barChart: Chart;
  public address: string;
  public balance: number = 0;
  public stake = 0;
  public claim = 0;
  public networkedStaked = 0;
  public unstakePeriod: string;
  public networkUnstakePeriod = '';
  public loaded: boolean = false;
  public rewardRate = 0;
  public monthlyICX = 0;
  public yearlyICX = 0;
  public hideUnstakeTimer: boolean = true;
  public rowSize: number = 12;
  public colSize: number = 2;
  public USDValue: number = 0;
  public deviceSettings: DeviceSettings;
  public graphHeader: string;
  constructor(
    private iconContract: IconContractService,
    public loadingController: LoadingController,
    public navCtrl: NavController,
    private settingsService: SettingsService,
    private translateService: TranslateService ) { }

  async ionViewWillEnter() {
    if (this.address) {
      this.presentLoading();
      this.deviceSettings = await this.settingsService.get()
      this.loadWallet();
      this.loadStake();
      this.loadUnstake();
      this.loadClaim();
      this.loadChart();
      this.loadUSDValue();
      this.loaded = true;  
     } 
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      spinner: null,
      message: '<ion-img src="/assets/loading-spinner-trans.gif" alt="loading..."></ion-img>',
      cssClass: 'loading-css',
      showBackdrop: false,
      duration: 1000
    });
    await loading.present();
  }

  async loadWallet() {
    this.balance = await this.iconContract.getBalance(this.address);
  }

  async loadUSDValue() { 
    this.USDValue = await this.iconContract.getUSDValue();
  }

  async loadStake() {
    this.stake = await this.iconContract.getStakedAmount(this.address);
  }

  async loadUnstake() {
    const networkUnstakePeriod = await this.iconContract.getNetworkStakedPeriod();
    const networkUnstakePeriodDays= this.splitTime(networkUnstakePeriod *24);
    this.networkUnstakePeriod = networkUnstakePeriodDays[0]['d'] + 'd: ' + networkUnstakePeriodDays[0]['h'] + 'h';

   const hours = await this.iconContract.getUnstakedPeriod(this.address);
   if (hours > 0) {
     const splitTime = this.splitTime(hours);
     this.unstakePeriod = splitTime[0]['d'] + 'd: ' + splitTime[0]['h'] + 'h: ' + splitTime[0]['m'] + 'm';
     this.rowSize = 6;
     this.hideUnstakeTimer = false;
     this.colSize = 3;
   } else {
     this.hideUnstakeTimer = true;
     this.rowSize = 12;
     this.colSize = 2;
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
    setTimeout(() => {
      this.ionViewWillEnter();
      event.target.complete();
    }, 2000);
  }

  calculateY(pv: number, r: number, n: number) : number {
    const rateOfInterest = r/100;
    return pv * (Math.pow((1 + (rateOfInterest/52)), n));
  }

  async generateLineData(){
    this.rewardRate = await this.iconContract.getCurrentRewardRate();
    const pv = Math.floor(this.stake);
    const r = this.rewardRate;
    let y = new Array();
    let m = 0;
    const xmax = 52; //weekly
    let j = 0;
    let ma = [];
    for (let i = 0; i <= xmax; i++) {
        y[i] = this.calculateY(pv, r, i);
        m = i%4; //roughly every 4 weeks (monthly)
        if(m==0 && i > 0) {  
          ma[j]=y[i];
          j++;
        }
    }
    return ma;
  }

  async loadChart() { 

    this.translateService.get('wallet.graphHeader').subscribe(
      value => {
        // value is our translated string
        this.graphHeader = value;
      }
    )

    this.generateLineData().then(data => {
      this.yearlyICX = data[11] - this.stake; //array starts at 0 (value after 12 months)
      this.monthlyICX = this.yearlyICX/12;
      this.barChart = new Chart(this.barCanvas.nativeElement, {
          type: 'line',
          data: {
            labels: ['1', '2', '3', '4', '5', '6', '7','8', '9', '10', '11', '12'],
            datasets: [{
              borderColor: '#b9efa4',
              data: data,
              backgroundColor: '#1d2025'
          }]
        },
        options: {
          legend: {
            display: false,
            fontColor: 'white'
          },
          title: {
            display: true,
            text: this.graphHeader,
            fontColor: '#fff',
            fontSize: 9,
          },
          layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0
                    }
          },
          scales: {
            yAxes: [
                {
                    ticks: {
                      stepSize: 5000, // this worked as expected
                      fontColor: '#fff',
                      callback: function (value) {
                        return value.toLocaleString();
                      },         
                    },
                    gridLines: {
                      display:false   
                    }
                }],
                xAxes: [
                  {
                      gridLines: {
                        display:false
                    },
                    ticks: {
                      fontColor: '#fff'
                  }
                  } 
            ]
        }     
        }
      });
    });
  }
}
