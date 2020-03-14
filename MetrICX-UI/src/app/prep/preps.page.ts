import { Component, Input } from '@angular/core';
import { IconContractService } from '../services/icon-contract/icon-contract.service';
import { DelegatedPRep, PReps, Delegations, PrepDetails } from '../services/icon-contract/preps';
import { PrepTable, PrepPie } from './prep-table';
import { NavController, LoadingController } from '@ionic/angular';
import { SettingsService } from '../services/settings/settings.service';
import { HttpService } from '../services/http-service/http.service';
import { Address } from '../services/settings/settings';

@Component({
  selector: 'app-preps',
  templateUrl: 'preps.page.html',
  styleUrls: ['preps.page.scss']
})


export class PrepsPage  {
  
  rows: Object;
  public delegatedPrep: DelegatedPRep;
  public preps: PReps;
  public totalSupply: string;
  public totalNumPreps: number;
  public totalICXDelegated: string;
  public totalStakedPerc: number;
  public totalStaked: string;
  public totalNetworkDelegated: number;
  public address: string;
  public imageUrl: string;
  public votedPerc: number;
  public lastBlockCreatedBy: string;
  public votedPercentage: number;
  public isLoaded: boolean = false;
  public numberOfVotedReps: number = 0;
  private _addressSetting: Address;
  public circulatingSupply: string;
  public circPercentage: number;

  @Input("addresssetting")
  set addresssetting(value: Address) {
      this._addressSetting = value;
      this.address = this._addressSetting.address; 
      if (this.address) {
        this.ionViewWillEnter();
      }
  }
  get addresssetting(): Address {
      return this._addressSetting;
  }

  constructor( private iconContract: IconContractService,
               public navCtrl: NavController,
               private settingsService: SettingsService,
               private httpService: HttpService,
               private loadingController: LoadingController) {
               }


   async ionViewWillEnter() {
      if (this.address) {
        await this.presentLoading();
        this.preps = await this.iconContract.getPReps();
        await this.showStakePercentage();
        await this.loadPageData(this.address);
        this.isLoaded = true;
      }
   }

   doRefresh(event) {
    setTimeout(() => {
      this.ionViewWillEnter();
      event.target.complete();
    }, 2000);
  }

  async showStakePercentage() {
    await this.httpService.get().then((data) => {
      var cS: number = data['tmainInfo']['icxCirculationy']; 
      this.circPercentage = this.preps.totalDelegated / cS * 100;
      this.circulatingSupply = Math.round(cS).toLocaleString();
    });
    this.totalICXDelegated = Math.round(this.preps.totalDelegated).toLocaleString();
  }

  async presentLoading() {
    this.isLoaded = true;
    await this.loadingController.create({
      spinner: null,
      message: '<ion-img src="/assets/loading-spinner-trans.gif" alt="loading..."></ion-img>',
      cssClass: 'loading-css',
      showBackdrop: false,
      duration: 5000
    }).then(a => {
      a.present().then(() => {
        console.log('presented');
        if (!this.isLoaded) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }

  async dismiss() {
    this.isLoaded = false;
    return await this.loadingController.dismiss().then(() => console.log('dismissed'));
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
    var delegatedPReps = await this.iconContract.getDelegatedPReps(address);
    var totalSupply = await this.iconContract.getTotalSupply();
    var votedPreps: number = delegatedPReps.delegations.length;
   
    var prepData: PrepPie[] = [];
    let numPreps = 0;
    for(var i = 0; i < votedPreps; i++) {
      var pData = new PrepPie();
      numPreps++;
      pData.value = delegatedPReps.delegations[i].value;
      var prep = await this.iconContract.getPRep(delegatedPReps.delegations[i].address);
      var prepName = prep['name'];
      pData.name = prepName;
      prepData.push(pData);
    }

    this.numberOfVotedReps = numPreps;
    var delegatedPrepDetail = await this.filterPrepsList(delegatedPReps.delegations, this.preps);   

    await this.createTableData(delegatedPrepDetail, this.preps.totalDelegated, prepData);

    this.totalSupply = Math.round(totalSupply).toLocaleString();
    this.totalNetworkDelegated = await this.iconContract.getNetworkStaked();
    this.votedPerc =  this.preps.totalDelegated / totalSupply * 100;
    this.totalStakedPerc = this.preps.totalStake / totalSupply * 100;
    this.totalStaked = Math.round(this.preps.totalStake).toLocaleString();
    this.lastBlockCreatedBy = await this.iconContract.getLastBlockCreatedBy();

    this.totalNumPreps = this.preps.preps.length;
    await this.dismiss();
   }

  async createTableData(prepDetail: PrepDetails[], totalDelegated: number, prepDataVoted: PrepPie[]) {
    var prepArray: PrepTable[] = [];
    let totalVoted: number = 0;
    
    for(var j=0;j<prepDataVoted.length;j++) {
      totalVoted = totalVoted + prepDataVoted[j].value;
    }

    for(var i = 0; i < prepDetail.length; i++) {
      var prepTable = new PrepTable();
      prepTable.votingPerc = prepDetail[i].delegated / totalDelegated * 100;

      let prepDetails = await this.settingsService.getPrepDetails(prepDetail[i].address);
      prepTable.imageUrl = prepDetails.representative.logo.logo_256

      prepTable.rank = "#"+prepDetail[i].rank;
      prepTable.name = prepDetail[i].name;
      var productivityPerc = prepDetail[i].validatedBlocks /  prepDetail[i].totalBlocks * 100;
      if(!productivityPerc) {
        productivityPerc = 0; 
      }

      for(var k = 0; k < prepDataVoted.length; k++) {
        if(prepDetail[i].name == prepDataVoted[k].name) {
          prepTable.myVotes = prepDataVoted[k].value;
          prepTable.width = prepDataVoted[k].value / totalVoted * 100;
        }
      }

       prepTable.city = prepDetail[i].city;
       prepTable.totalVotes = (Math.round(prepDetail[i].delegated *100)/100).toLocaleString();
       prepTable.production = Math.round(productivityPerc * 100)/100;
       prepArray.push(prepTable);
    }
    this.rows = prepArray;
  }
}