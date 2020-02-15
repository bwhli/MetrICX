import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Chart } from 'chart.js';
import 'chartjs-plugin-labels';
import { IconContractService } from '../services/icon-contract/icon-contract.service';
import { DelegatedPRep, PReps, Delegations, PrepDetails } from '../services/icon-contract/preps';
import { PrepTable, PrepPie } from './prep-table';
import { NavController } from '@ionic/angular';
import { SettingsService } from '../services/settings/settings.service';

@Component({
  selector: 'app-preps',
  templateUrl: 'preps.page.html',
  styleUrls: ['preps.page.scss',
              '../../../node_modules/@swimlane/ngx-datatable/assets/icons.css']
})
export class PrepsPage  {

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
               private iconContract: IconContractService,
               public navCtrl: NavController,
               private settingsService: SettingsService) {}


   async ionViewWillEnter() {
    var settings = await this.settingsService.get();
    if (settings && this.settingsService.getActiveAddress().address) {
      this.address = this.settingsService.getActiveAddress().address; 
      if (this.address) {
        this.loadPageData(this.address);
      }
      else {
        this.navCtrl.navigateForward('/tabs/settings');
      }
    };
   }

   doRefresh(event) {
    setTimeout(() => {
      this.ionViewWillEnter();
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
    if(this.dn) {
      this.dn.destroy();
    }  
    this.dn = new Chart(this.dnChart.nativeElement, {
      type: 'pie',
      circumference: 2*Math.PI,
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
            '#A53361',
            '#BB8732',
            '#32BB8C',
            '#3245BB',
            '#A60711'
          ],
          borderColor: [
            '#e9e9e9',
            '#e9e9e9',
            '#e9e9e9',
            '#e9e9e9',
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
          position: 'bottom',
          fullWidth: true,
          labels: {
            fontSize: 10,
            boxWidth: 5,
            fontFamily: '"Open Sans",  sans-serif',
          }
        },
      layout: {
        padding: {  
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        }
      },
      responsive: true,
      maintainAspectRatio: false,
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