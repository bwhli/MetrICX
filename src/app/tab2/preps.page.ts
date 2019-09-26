import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';
import { Chart } from 'chart.js';
import 'chartjs-plugin-labels';
import { IconContractService } from '../services/icon-contract/icon-contract.service';
import { DelegatedPRep, PReps, Delegations, PrepDetails } from '../services/icon-contract/preps';


@Component({
  selector: 'app-preps',
  templateUrl: 'preps.page.html',
  styleUrls: ['preps.page.scss',
              '../../../node_modules/@swimlane/ngx-datatable/assets/icons.css']
})
export class PrepsPage implements OnInit {

  @ViewChild('dnChart', {static:false}) dnChart: ElementRef;
  rows: Object;
  dn: Chart;
  public delegatedPrep: DelegatedPRep;
  public preps: PReps;

  public address: string;

  constructor( private storage: Storage, 
               private iconContract: IconContractService) {}

  ionViewWillEnter() {
    this.storage.get('address').then(address => {
      this.address = address;     
      this.getAllPreps();
      this.getMyPreps();
      this.createDnChart();  
    });
  }

  ngOnInit() {
     this.rows = [
      {
        "rank": '#2',
        "name": "Ubik",
        "production": "0/0",
        "votes": "13.6% / 13,545,552"
      },
      {
        "rank": '#4',
        "name": "ICONation",
        "production": "0/0",
        "votes": "9.7% / 10,256,556"
      },
      {
        "rank": "#5",
        "name": "RHIZOME",
        "production": "0/0",
        "votes": "8.1% / 9,654,225"
      }
    ];
  }

  async getMyPreps() {
    this.delegatedPrep = await this.iconContract.getDelegatedPReps(this.address);
  }

   async getAllPreps() {
      this.preps = await this.iconContract.getPReps();
   }

   doRefresh(event) {
    console.log('Begin async operation');

    setTimeout(() => {
      this.createDnChart();
      this.ionViewWillEnter();
      event.target.complete();
    }, 2000);
  }


  async filterPrepsList(delegatedPrepList: Delegations[]) : Promise<PrepDetails[]> {
    var preps = await this.iconContract.getPReps();

    var filteredArrayPreps  = preps.preps.filter(function(array_el) {
      return delegatedPrepList.filter(function(anotherOne_el) {
         return anotherOne_el.address == array_el.address;
      }).length > 0
    });
    return filteredArrayPreps
   }

  async createDnChart() {
    var delegatedPReps = await this.iconContract.getDelegatedPReps(this.address);
    var votedPreps: number = delegatedPReps.delegations.length;
    let data: number[] = [votedPreps];
    for(var i = 0; i < votedPreps; i++) {
      data[i] = delegatedPReps.delegations[i].value;
    }
    var labels: string[] = [];
    
    var delegatedPrepDetail = await this.filterPrepsList(delegatedPReps.delegations);   
    for(var i = 0; i < delegatedPrepDetail.length; i++) {
      labels[i] = delegatedPrepDetail[i].name;
    }

    this.dn = new Chart(this.dnChart.nativeElement, {
      type: 'pie',
      circumference: Math.PI,
      data: {
        labels: labels,
        datasets: [{
          label: '',
          data: data,
          backgroundColor: [
            '#729192',
            '#84d4d6',
            '#545454',
            '#9999cc',
            '#cccc99',
            '#cc9999'
          ],
          borderColor: [
            '#e9e9e9',
            '#e9e9e9',
            '#e9e9e9',
            '#e9e9e9',
            '#e9e9e9',
            '#e9e9e9'
          ],
          borderWidth: 1
        }]
      }, 
      
      options: {
        legend: {
          display: true,
          position: 'right',
          fullWidth: false,
          labels: {
            fontSize: 8,
            boxWidth: 10,
            fontFamily: '"Open Sans",  sans-serif',
          }
        },
      cutoutPercentage: 10,
      layout: {
        padding: {
            left: 0,
            right: 80,
            top: 0,
            bottom: 0
        }
      },
      responsive: true,
      plugins: {
          labels: [
            
            {
              render: 'percentage',
              fontColor: '#fff',
              fontSize: 10,
              fontFamily: '"Open Sans",  sans-serif',
            }
          ]
        }
      }
    });
  }
}
