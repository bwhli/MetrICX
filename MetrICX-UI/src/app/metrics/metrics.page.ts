import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ToastController, NavController } from '@ionic/angular';
import { Chart } from 'chart.js';
import 'chartjs-plugin-labels';
import { IconContractService } from '../services/icon-contract/icon-contract.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-metrics',
  templateUrl: 'metrics.page.html',
  styleUrls: ['metrics.page.scss']
})
export class MetricsPage {

  @ViewChild("barCanvas", {static:false}) barCanvas: ElementRef;

  public address: string;
  public loaded: boolean = false;
  
  constructor(
    private storage: Storage,
    private toastController: ToastController,
    private iconContract: IconContractService,
    public loadingController: LoadingController,
    public navCtrl: NavController
  ) { }

  ionViewWillEnter() {
    //Update stored address
    this.storage.get('address').then(address => {
      this.address = address; 
      if (address) {
        this.loadChart();
        this.loaded = true;  
      } else {
        this.navCtrl.navigateForward('/tabs/settings');
      }
    }); 
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


  async loadChart() { 
      this.barChart = new Chart(this.barCanvas.nativeElement, {
          type: 'line',
          data: {
            labels: ['1', '2', '3', '4', '5', '6', '7'],
            datasets: [{
              borderColor: '#32b8bb',
              data: [123222,232322,2323222,122212,1212121,212442,233322],
          }]
        },
        options: {
          legend: {
            display: false
          },
          title: {
            display: false,
            text: '24 hour transaction count'
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
                      callback: function (value) {
                        return value.toLocaleString();
                      }
                    }
                }
            ]
        }     
        }
      });
  }
}
