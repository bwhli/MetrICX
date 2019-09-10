import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';
import IconService, { HttpProvider, IconBuilder, IconConverter, IconAmount  } from 'icon-sdk-js';
const { CallBuilder } = IconBuilder;
import { Chart } from 'chart.js';

@Component({
  selector: 'app-wallet',
  templateUrl: 'wallet.page.html',
  styleUrls: ['wallet.page.scss']
})
export class WalletPage implements OnInit {

  @ViewChild("barCanvas", {static:false}) barCanvas: ElementRef;

  public address: string;
  public balance = 0;
  public stake = 0;
  public claim = 0;
  public networkedStaked = 0;
  public unstakePeriod = 0;
  private barChart: Chart;

  constructor(
    private storage: Storage,
    private toastController: ToastController
  ) { }
   
  ngOnInit () { 
    //Update stored address
    this.storage.get('address').then(address => {
      this.address = address; 
      this.loadWallet();
      this.loadStake();
      this.loadClaim();
      this.loadUnstakePeriod();
      this.loadChart();
    });
  }

  async loadWallet() {
    const httpProvider = new HttpProvider('https://ctz.solidwallet.io/api/v3');
    const iconService = new IconService(httpProvider);
    const bigBalance = await iconService.getBalance(this.address).execute();
    this.balance = 1 * bigBalance / 10**18
  }

  async loadStake() {
    const httpProvider = new HttpProvider('https://ctz.solidwallet.io/api/v3');
    const iconService = new IconService(httpProvider);
    
	  const call = new CallBuilder()
      .to('cx0000000000000000000000000000000000000000')
      .method('getStake')
      .params({
          address: this.address
      })				
      .build();

      var response = await iconService.call(call).execute();
      const bigStakedAmount = response['stake'];
      this.stake = 1 * bigStakedAmount / 10**18 ;
  }

  async loadClaim() {
    const httpProvider = new HttpProvider('https://ctz.solidwallet.io/api/v3');
    const iconService = new IconService(httpProvider);
    
	  const call = new CallBuilder()
      .to('cx0000000000000000000000000000000000000000')
      .method('queryIScore')
      .params({
          address: this.address
      })				
      .build();

      var response = await iconService.call(call).execute();
      const bigAmount = response['estimatedICX'];
      this.claim = 1 * bigAmount / 10**18 ;
      
  }

  async loadUnstakePeriod() {
    const httpProvider = new HttpProvider('https://ctz.solidwallet.io/api/v3');
    const iconService = new IconService(httpProvider);
    
	  const call = new CallBuilder()
      .to('cx0000000000000000000000000000000000000000')
      .method('estimateUnstakeLockPeriod')
      .params({
          address: this.address
      })				
      .build();

      var response = await iconService.call(call).execute();
      this.unstakePeriod = response['unstakeLockPeriod'];
   
  }

  async loadChart() {
    const httpProvider = new HttpProvider('https://ctz.solidwallet.io/api/v3');
    const iconService = new IconService(httpProvider);
    
	  const call = new CallBuilder()
      .to('cx0000000000000000000000000000000000000000')
      .method('getPReps')
      .params({
          address: this.address
      })				
      .build();

      var response = await iconService.call(call).execute();
      const totalStaked = response['totalStake'];
      const staked = 1 * totalStaked / 10**18;
      const perc  = IconConverter.toNumber(staked) / 800362000 * 100;

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
          display: false
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
