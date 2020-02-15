import { Subject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { DeviceSettings } from '../settings/settings'


@Injectable()
export class SharedService {

    private dataSource = new Subject<DeviceSettings>();
    public newData: Observable<DeviceSettings>;
   
    constructor() {
       this.newData = this.dataSource.asObservable();
    }

    async changeData(data: DeviceSettings) {
        this.dataSource.next(data);
    }
}