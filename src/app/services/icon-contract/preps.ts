export class PrepDetails {
    address: string;
    city: string;
    country: string;
    delegated: number;
    grade: number;
    irep: number;
    irepUpdateBlockHeight: number;
    lastGenerateBlockHeight: number;
    name: string;
    stake: number;
    status: number;
    totalBlocks: number;
    validatedBlocks: number;
    rank: number;
}

export class PReps {
    totalDelegated: number;
    totalStake: number;
    preps: PrepDetails[];
    blockHeight: number;
    startRanking: number;
}

export class PRepDelegation {
    totalDelegated: number;
    votingPower: number;
    delegations: Delegations[];
}

export class Delegations {
    address: string;
    value: number;
}
