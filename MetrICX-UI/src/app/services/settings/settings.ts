

export class DeviceSettings {
    token: string;
    enablePushIScoreChange: boolean;
    enablePushDeposits: boolean;
    enablePushProductivityDrop: boolean;    
    addresses: Address[];
    addresses_v2: MapArray<Address>;
    showUSDValue: boolean;    
        
    constructor() {
        this.addresses_v2 = new MapArray<Address>();
        //this.addresses_v2.p0 = new Address();
    }
}

export class MapArray<T> {
    p0: T;
    p1: T;
    p2: T;
    p3: T;
    p4: T;
}

export class Address {
    Nickname: string;
    address: string;
    Symbol: string;
    tokens: TokenSet;
    enablePushDeposits: boolean;
    
    constructor() {
        this.tokens = new TokenSet();
    }
}

export class TokenSet {
    AC3 : Token;
    SPORT : Token;
    SSX : Token;
    TAP : Token;
    VELT : Token;
    WOK : Token;
    
    constructor() {
        this.AC3 = new Token("AC3", "cx9ab3078e72c8d9017194d17b34b1a47b661945ca");
        this.SPORT = new Token("SPORT", "cx3ec2814520c0096715159b8fc55fa1f385be038c");
        this.SSX = new Token("SSX", "cx429731644462ebcfd22185df38727273f16f9b87");
        this.TAP = new Token("TAP", "cxc0b5b52c9f8b4251a47e91dda3bd61e5512cd782");
        this.VELT = new Token("VELT", "cx19a23e850bf736387cd90d0b6e88ce9af76a8d41");
        this.WOK = new Token("WOK", "cx921205acb7c51e16d5b7cbc37539a4357d929d20");
    }
}

export class Token {
    Token: string;
    IsSelected: boolean;
    Balance: number;
    ContractAddress: string;

    constructor(token: string, contractAddress: string) {
        this.Token = token;
        this.ContractAddress = contractAddress;
        this.IsSelected = false;
        this.Balance = 0;
    }
}