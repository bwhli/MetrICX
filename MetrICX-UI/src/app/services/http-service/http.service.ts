import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { HTTP } from '@ionic-native/http/ngx';

@Injectable()
export class HttpService  {

    imageUrl: string;
    logo: string;

    constructor(private http: HttpClient) { }
     async get() {
        return await this.http.get('https://tracker.icon.foundation/v3/main/mainInfo').toPromise();

    }
}