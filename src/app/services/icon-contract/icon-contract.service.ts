import { Injectable } from '@angular/core';
import IconService, { HttpProvider, IconBuilder, IconConverter, IconAmount  } from 'icon-sdk-js';
const { CallBuilder } = IconBuilder;
import { PReps, PrepDetails, PRepDelegation, Delegations} from './preps';
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
    preps.preps = response.preps.map((result: PrepDetails) => <PrepDetails>result);
    return preps;
  }

  public async getDelegatedPReps(address: string) {
    const call = new CallBuilder()
    .to('cx0000000000000000000000000000000000000000')
    .method('getDelegation')
    .params({address: address})		
    .build();

    var response = await this.iconService.call(call).execute();
    var delegationPRep = new PRepDelegation();
    delegationPRep.totalDelegated = this.toBigInt(response.totalDelegated);
    delegationPRep.votingPower = this.toBigInt(response.votingPower);
    delegationPRep.delegations = response.delegations.map((result: Delegations) => <Delegations>result);
    return delegationPRep;
  }
}
