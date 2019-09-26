import { Injectable } from '@angular/core';
import IconService, { HttpProvider, IconBuilder } from 'icon-sdk-js';
const { CallBuilder } = IconBuilder;
import { PReps, PrepDetails, DelegatedPRep, Delegations} from './preps';
@Injectable({
  providedIn: 'root'
})
export class IconContractService {
  private httpProvider = new HttpProvider('https://ctz.solidwallet.io/api/v3');
  private iconService = new IconService(this.httpProvider);

  public toBigInt(hexValue): number {
    return 1 * hexValue / 10**18;
  }

  public toInt(hexValue): number {
    return 1 * hexValue;
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
      rep.irepUpdateBlockHeight = this.toInt(item.irepUpdateBlockHeight);
      rep.lastGenerateBlockHeight = this.toInt(item.lastGenerateBlockHeight);
      rep.stake = this.toInt(item.stake);
      rep.status = this.toInt(item.status);
      rep.totalBlocks = this.toInt(item.totalBlocks);
      rep.validatedBlocks = this.toInt(item.validatedBlocks);
      rep.rank = i;
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
}