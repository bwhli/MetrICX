import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Chart } from 'chart.js';
import 'chartjs-plugin-labels';
import { IconContractService } from '../services/icon-contract/icon-contract.service';
import { DelegatedPRep, PReps, Delegations, PrepDetails } from '../services/icon-contract/preps';
import { PrepTable, PrepPie } from './prep-table';

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


   ionViewWillEnter() {
    this.storage.get('address').then(address => {   
      this.loadPageData(address);
    });
   }

  ngOnInit() { 
   
  }

   doRefresh(event: any) {
    setTimeout(() => {
      this.storage.get('address').then(address => {   
        this.loadPageData(address);
      });
      event.target.complete();
    }, 2000);
  }

  async filterPrepsList(delegatedPrepList: Delegations[], allPreps: PReps) : Promise<PrepDetails[]> {
    var filteredArrayPreps  = allPreps.preps.filter(function(array_el) {
      return delegatedPrepList.filter(function(anotherOne_el) {
         return anotherOne_el.address == array_el.address;
      }).length > 0
    });
    return filteredArrayPreps;
   }

   async loadPageData(address: string) {
    var preps = await this.iconContract.getPReps();
    var delegatedPReps = await this.iconContract.getDelegatedPReps(address);
    var totalSupply = await this.iconContract.getTotalSupply();
    var votedPreps: number = delegatedPReps.delegations.length;
    var prepData = new PrepPie();
    prepData.name = [];
    prepData.value = [];
    
    for(var i = 0; i < votedPreps; i++) {
      prepData.value[i] = delegatedPReps.delegations[i].value;
      var prep = await this.iconContract.getPRep(delegatedPReps.delegations[i].address);
      var prepName = prep['name'];
      prepData.name[i] = prepName;
    }
    var labels: string[] = [];
    
    var delegatedPrepDetail = await this.filterPrepsList(delegatedPReps.delegations, preps);   
  
    await this.createDnChart(prepData.value, prepData.name);
    await this.createTableData(delegatedPrepDetail, preps.totalDelegated);

    this.totalSupply = Math.round(totalSupply).toLocaleString();
    this.totalICXDelegated = Math.round(preps.totalDelegated).toLocaleString();
    this.totalNetworkDelegated = await this.iconContract.getNetworkStaked();
    this.totalNumPreps = preps.preps.length;
   }

  async createTableData(prepDetail: PrepDetails[], totalDelegated: number) {
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
       prepTable.production = Math.round(productivityPerc * 100)/100 + '%';
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
            '#545454',
            '#00A6CC',
            '#32b8bb',
            '#7273BF',
            '#995298',
            '#A53361'
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
            fontSize: 12,
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
              fontSize: 12,
              fontFamily: '"Open Sans",  sans-serif',
            }
          ]
        }
      }
    });
  }
}
