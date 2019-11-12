import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicStorageModule } from '@ionic/storage';
import { TooltipModule } from 'ng2-tooltip-directive';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { Firebase } from '@ionic-native/firebase/ngx';
import { FcmService } from './services/fcm/fcm.service';

//From google firebase download the web app's config and put it into a new file called
//firebase-config.ts with this content
//export class FirebaseConfig {
//  public static config = {
//    apiKey: "xxxxx",
//    authDomain: "xxxxx.firebaseapp.com",
//    databaseURL: "https://xxxxx.firebaseio.com",
//    projectId: "xxxxx",
//    storageBucket: "xxxxx.appspot.com",
//    messagingSenderId: "xxxxx",
//    appId: "1:xxxxx:web:xxxxx",
//    measurementId: "G-xxxxx"
//  };
//}
import { FirebaseConfig } from '../../firebase-config';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    TooltipModule,
    BrowserAnimationsModule,
    BrowserModule, 
    FormsModule,
    ReactiveFormsModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(FirebaseConfig.config),
    AngularFirestoreModule],
  providers: [
    StatusBar,
    SplashScreen,
    Firebase,
    FcmService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
