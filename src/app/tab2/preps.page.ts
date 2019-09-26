import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Chart } from 'chart.js';
import 'chartjs-plugin-labels';
import { IconContractService } from '../services/icon-contract/icon-contract.service';
import { DelegatedPRep, PReps, Delegations, PrepDetails } from '../services/icon-contract/preps';
import { PrepTable } from './prep-table';

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
  public totalSupply: string;
  public totalNumPreps: number;
  public totalICXDelegated: string;
  public totalNetworkDelegated: number;

  public address: string;

  constructor( private storage: Storage, 
               private iconContract: IconContractService) {}

  ngOnInit() { 
    this.storage.get('address').then(address => {
      this.address = address;     
      this.loadPageData();
    });
  }

  async getMyPreps() {
    this.delegatedPrep = await this.iconContract.getDelegatedPReps(this.address);
  }

   async getAllPreps() {
      this.preps = await this.iconContract.getPReps();
   }

   doRefresh(event: any) {
    setTimeout(() => {
      this.loadPageData();
      event.target.complete();
    }, 2000);
  }

  async filterPrepsList(delegatedPrepList: Delegations[], allPreps: PReps) : Promise<PrepDetails[]> {
    var filteredArrayPreps  = allPreps.preps.filter(function(array_el) {
      return delegatedPrepList.filter(function(anotherOne_el) {
         return anotherOne_el.address == array_el.address;
      }).length > 0
    });
    return filteredArrayPreps
   }

   async loadPageData() {
    var preps = await this.iconContract.getPReps();
    var delegatedPReps = await this.iconContract.getDelegatedPReps(this.address);
    var totalSupply = await this.iconContract.getTotalSupply();
    var votedPreps: number = delegatedPReps.delegations.length;
    let data: number[] = [votedPreps];
    for(var i = 0; i < votedPreps; i++) {
      data[i] = delegatedPReps.delegations[i].value;
    }
    var labels: string[] = [];
    
    var delegatedPrepDetail = await this.filterPrepsList(delegatedPReps.delegations, preps);   
    for(var i = 0; i < delegatedPrepDetail.length; i++) {
      labels[i] = delegatedPrepDetail[i].name + ' ('+ Math.round(delegatedPReps.delegations[i].value).toLocaleString() +')';
    }

    await this.createDnChart(data, labels);
    await this.createTableData(delegatedPrepDetail, preps.totalDelegated);

    this.totalSupply = totalSupply.toLocaleString();
    this.totalICXDelegated = Math.round(preps.totalDelegated).toLocaleString();
    this.totalNetworkDelegated = Math.round((preps.totalDelegated / totalSupply * 100) *100)/100;
    this.totalNumPreps = preps.preps.length;
   }

  

  async createTableData(prepDetail: PrepDetails[], totalDelegated: number) {
     debugger;

     var prepArray: PrepTable[] = [];

     for(var i = 0; i < prepDetail.length; i++) {
      var prepTable = new PrepTable();
       prepTable.rank = "#"+prepDetail[i].rank;
       prepTable.name = prepDetail[i].name;
       var productivityPerc = prepDetail[i].validatedBlocks /  prepDetail[i].totalBlocks * 100;
       if(!productivityPerc) {
        productivityPerc = 0;
       }
       var votePrec = prepDetail[i].delegated / totalDelegated * 100;
       prepTable.production = prepDetail[i].validatedBlocks + '/' + prepDetail[i].totalBlocks + ' (' + productivityPerc + '%)';
       prepTable.votes = Math.round(votePrec  * 100)/100 + '%' + ' | ' + Math.round(prepDetail[i].delegated).toLocaleString();
       prepArray.push(prepTable);
    }
    this.rows = prepArray;
  }

  async createDnChart(chartData: number[], labelData: string[]) {
    this.dn = new Chart(this.dnChart.nativeElement, {
      type: 'pie',
      circumference: Math.PI,
      data: {
        labels: labelData,
        datasets: [{
          label: '',
          data: chartData,
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
            right: 50,
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
