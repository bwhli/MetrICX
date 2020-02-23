import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { HTTP } from '@ionic-native/http/ngx';

@Injectable()
export class HttpService  {

    imageUrl: string;
    logo: string;

    constructor(private http: HTTP) { }

     async get(url: string) : Promise<string> {
        const params = {};
        const headers = {};
        return await this.http.get(url,params,headers).then(function (response) { 
        try {
            response.data = JSON.parse(response.data);
            return response.data.representative.logo.logo_256;
        }
        catch {
            //unable to parse the json for some reason.
            return '';
        }
        //   return response.data.representative.logo.logo_256; //['representative']['logo']['logo_256'];
            // this.logo = data['representative']['logo']['logo_256'];
        }, function(response) {
            //something went wrong with the htpp request
            console.log(response.status);
        });

    }
}