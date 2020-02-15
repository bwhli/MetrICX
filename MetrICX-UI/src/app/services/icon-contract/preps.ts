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
    details: string;
    imageUrl: string;
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

export class DelegatedPRep {
    totalDelegated: number;
    votingPower: number;
    delegations: Delegations[];
}

export class Delegations {
    address: string;
    value: number;
}
