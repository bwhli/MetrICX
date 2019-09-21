export class DelegatedPRep {
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
    preps: DelegatedPRep[];
    blockHeight: number;
    startRanking: number;
}
