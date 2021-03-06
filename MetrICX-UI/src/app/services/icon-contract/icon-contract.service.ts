import { Injectable } from '@angular/core';
import IconService, { HttpProvider, IconBuilder, IconAmount, IconConverter } from 'icon-sdk-js';
const { CallBuilder } = IconBuilder;
import { PReps, PrepDetails, DelegatedPRep, Delegations} from './preps';
import { HttpService } from '../http-service/http.service';
import { debug } from 'util';
import { async } from '@angular/core/testing';

@Injectable({
  providedIn: 'root'
})
export class IconContractService {
  private httpProvider = new HttpProvider('https://ctz.solidwallet.io/api/v3');
  private iconService = new IconService(this.httpProvider);
  private rPoint = 0.7;
  private logoUrl: string = "";

  constructor(private httpService: HttpService) {}

  public toBigInt(hexValue): number {
      return IconConverter.toNumber(IconAmount.of(hexValue, IconAmount.Unit.LOOP).convertUnit(IconAmount.Unit.ICX));
  }

  public toInt(hexValue): number {
    return 1 * hexValue;
  }

  public async getTotalSupply() {
    const bigSupply = await this.iconService.getTotalSupply().execute();
    return this.toBigInt(bigSupply);
  }

  public async getLastBlockCreatedBy() {
    const response = await this.iconService.getLastBlock().execute();
    const name = await this.getPRep(response['peerId']);
    return name['name'];
  }

  public async getBalance(address: string) {
    const bigBalance = await this.iconService.getBalance(address).execute();
    return this.toBigInt(bigBalance);
  }

  public async getStakedAmount(address: string) {
	  const call = new CallBuilder()
      .to('cx0000000000000000000000000000000000000000')
      .method('getStake')
      .params({address: address})				
      .build();

    var response = await this.iconService.call(call).execute();
    return this.toBigInt(response['stake']);
  }

  public async getNetworkStaked() { 
    var preps = await this.getPReps();
    var totalSupply = await this.getTotalSupply(); 
    return Math.round((preps.totalDelegated / totalSupply * 100) *100)/100;   
  }

public async getCurrentRewardRate() {
  const networkStaked = await this.getNetworkStaked();
  const rMax = 0.12;
  const rMin = 0.02;

  const percentStaked = networkStaked;
  let rRep = ((rMax - rMin) / (Math.pow(this.rPoint, 2))) * (Math.pow(percentStaked / 100 - this.rPoint, 2)) + rMin;
  if (percentStaked > 70) {
      rRep = 0.02;
  }
  return rRep * 3 * 100;
}

public async getNetworkStakedPeriod() {
  const lMin = 5;
  const lMax = 20;
  const percentStaked: number = await this.getNetworkStaked();
  let lPeriod = ((lMax - lMin) / (Math.pow(this.rPoint, 2))) * (Math.pow(percentStaked / 100 - this.rPoint, 2)) + lMin;
  
  return Math.round(lPeriod * 100) / 100;;
}


public async getUnstakedPeriod(address: string) : Promise<number> {
    const call = new CallBuilder()
    .to('cx0000000000000000000000000000000000000000')
    .method('getStake')
    .params({address: address})	
    .build();			

  var response = await this.iconService.call(call).execute();
  if (response['unstakeBlockHeight']) {
    const latest = await this.iconService.getBlock("latest").execute();
    const targetBH = parseInt(response['unstakeBlockHeight'], 16);
    const diffBlocks = targetBH - latest['height'];
    const diffSeconds = diffBlocks * 2;
    return (diffSeconds / 3600.0);
  } else {
    return -1;
  }
}

public async getClaimableRewards(address: string) {
	  const call = new CallBuilder()
      .to('cx0000000000000000000000000000000000000000')
      .method('queryIScore')
      .params({address: address})				
      .build();

    var response = await this.iconService.call(call).execute();
    return this.toBigInt(response['estimatedICX']);
  }
  
  public async getPRep(address: string) {
    const call = new CallBuilder()
    .to('cx0000000000000000000000000000000000000000')
    .method('getPRep')			
    .params({address: address})		
    .build();

    return await this.iconService.call(call).execute();
  }

  
  public async getPReps() {
	  const call = new CallBuilder()
      .to('cx0000000000000000000000000000000000000000')
      .method('getPReps')			
      .build();

    var response = await this.iconService.call(call).execute();
    var preps = new PReps();
    preps.blockHeight = this.toInt(response.blockHeight);
    preps.totalDelegated = this.toBigInt(response.totalDelegated);
    preps.totalStake = this.toBigInt(response.totalStake);
    preps.startRanking = this.toInt(response.startRanking);
    preps.preps = [];

    for (var i = 0; i < response.preps.length; i++) {
      var item = response.preps[i];
      var rep = new PrepDetails();
      rep.name = item.name;
      rep.address = item.address;
      rep.city = item.city;
      rep.delegated = this.toBigInt(item.delegated);
      rep.grade = this.toInt(item.grade);
      rep.irep = this.toBigInt(item.irep);
      rep.details = item.details;
      rep.irepUpdateBlockHeight = this.toInt(item.irepUpdateBlockHeight);
      rep.lastGenerateBlockHeight = this.toInt(item.lastGenerateBlockHeight);
      rep.stake = this.toInt(item.stake);
      rep.status = this.toInt(item.status);
      rep.totalBlocks = this.toInt(item.totalBlocks);
      rep.validatedBlocks = this.toInt(item.validatedBlocks);
      rep.rank = i+1;
    
      preps.preps.push(rep);
    }

    return preps;
  }

  public async getDelegatedPReps(address: string) {
    const call = new CallBuilder()
    .to('cx0000000000000000000000000000000000000000')
    .method('getDelegation')
    .params({address: address})		
    .build();

    var response = await this.iconService.call(call).execute();
    var delegatedPRep = new DelegatedPRep();
    delegatedPRep.totalDelegated = this.toBigInt(response.totalDelegated);
    delegatedPRep.votingPower = this.toBigInt(response.votingPower);
    delegatedPRep.delegations = [];
    for (var i = 0; i < response.delegations.length; i++) {
      var item = response.delegations[i];
      var delegate = new Delegations();
      delegate.address = item.address;
      delegate.value = this.toBigInt(item.value);
      delegatedPRep.delegations.push(delegate);
    }
    return delegatedPRep; 
  }
  
  public async getUSDValue() {
	  const call = new CallBuilder()
      .to('cxc26094b789b82c94305e79590ad39898b0d513a0')
      .method('value')			
      .build(); 

    var response = await this.iconService.call(call).execute();
    return this.toBigInt(response);
  }

  public async getTokenBalance(tokenAddress: string, ownerAddress: string) { 
    const params = {
      _owner: ownerAddress
    };
    
    const call = new CallBuilder()
      .to(tokenAddress)
      .method('balanceOf')
      .params(params)
      .build();

        // Check the wallet balance
    const bigBalance = await this.iconService.call(call).execute();
    return this.toBigInt(bigBalance);
  }

  public async GetTapDividends() {
    const call = new CallBuilder()
    .to('cx1b97c1abfd001d5cd0b5a3f93f22cccfea77e34e')
    .method('get_excess')
    .params()
    .build();

      // Check the wallet balance
   const result = await this.iconService.call(call).execute();
   return this.toBigInt(result);
  }

  public async GetTotalTapMinted() {
    const call = new CallBuilder()
    .to('cx1b97c1abfd001d5cd0b5a3f93f22cccfea77e34e')
    .method('get_total_distributed')
    .params()
    .build();

      // Check the wallet balance
   const result = await this.iconService.call(call).execute();
   return this.toBigInt(result);
  }

  public async GetBalanceTap() {
    const params = {
      _owner: 'cx3b9955d507ace8ac27080ed64948e89783a62ab1'
    };
    
    const call = new CallBuilder()
      .to('cxc0b5b52c9f8b4251a47e91dda3bd61e5512cd782')
      .method('balanceOf')
      .params(params)
      .build();

        // Check the wallet balance
    const bigBalance = await this.iconService.call(call).execute();
    return this.toBigInt(bigBalance);
  }  
}