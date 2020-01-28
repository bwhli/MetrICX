import { TokenModel } from './tokenModel';

export class DeviceSettings {
    token: string;
    enablePushIScoreChange: boolean;
    enablePushDeposits: boolean;
    enablePushProductivityDrop: boolean;    
    addresses: Address[];
    showUSDValue: boolean;    
}

export class Address {
    Nickname: string;
    address: string;
    Symbol: string;
    name: string;
    tokens: TokenModel[];
}
