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

<<<<<<< HEAD
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { Firebase } from '@ionic-native/firebase/ngx';
import { FcmService } from './services/fcm/fcm.service';

// Your web app's Firebase configuration
const config = {
  apiKey: "AIzaSyBv05dMw6nVsJkp5UqUbYD444DLsI6kupI",
  authDomain: "iconomy-pushnotifications.firebaseapp.com",
  databaseURL: "https://iconomy-pushnotifications.firebaseio.com",
  projectId: "iconomy-pushnotifications",
  storageBucket: "iconomy-pushnotifications.appspot.com",
  messagingSenderId: "91183130894",
  appId: "1:91183130894:web:62062651d468168e47cf5f",
  measurementId: "G-04B4CNELPE"
};
=======
>>>>>>> a3487256f0b0ab7e01b9400e73488e243b28a4e6

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
    AngularFireModule.initializeApp(config),
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
