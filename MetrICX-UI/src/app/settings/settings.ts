export class DeviceSettings {
    token: string;
    enablePushIScoreChange: boolean;
    enablePushDeposits: boolean;
    enablePushProductivityDrop: boolean;    
    addresses: Address[];
    showUSDValue: boolean;
}

export class Address {
    address: string;
    Symbol: string;
    name: string;
}
