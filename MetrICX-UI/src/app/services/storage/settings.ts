import { TokenModel } from './tokenModel';

export class DeviceSettings {
    token: string;
    enablePushIScoreChange: boolean;
    enablePushDeposits: boolean;
    enablePushProductivityDrop: boolean;    
    addresses: Address[];
    showUSDValue: boolean;
    tokens: TokenModel[];
}

export class Address {
    address: string;
    Symbol: string;
    name: string;
}
