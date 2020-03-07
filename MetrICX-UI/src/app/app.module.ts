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
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';
import { AddTokenModalModule } from './addTokenModal/addTokenModal.module';
import { AddressModalModule } from  './addressModal/addressModal.module';
import { SharedService } from './services/shared/shared.service';
import { HttpService } from './services/http-service/http.service';
import { HttpClientModule } from '@angular/common/http';
// import { WalletPageModule } from '../theme/wallet.module';
import { WalletTabPageModule } from './wallet-tab/wallet-tab.module';
import { PrepTabModule } from './prep-tab/prep-tab.module';
import { TokensTabModule } from './tokens-tab/tokens-tab.module';
import { ScreenOrientation } from  '@ionic-native/screen-orientation/ngx'

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
import { SettingsService } from './services/settings/settings.service';
import { SuperTabsModule } from '@ionic-super-tabs/angular';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    HttpClientModule,
    TooltipModule,
    BrowserAnimationsModule,
    BrowserModule, 
    FormsModule,
    ReactiveFormsModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    AddTokenModalModule,
    AddressModalModule,
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(FirebaseConfig.config),
    AngularFirestoreModule,
    SuperTabsModule.forRoot(),
    //WalletPageModule,
    WalletTabPageModule,
    PrepTabModule,
    TokensTabModule
    
  ], 
  providers: [
    StatusBar,
    SplashScreen,
    Firebase,
    FcmService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    BarcodeScanner,
    Base64ToGallery,
    SettingsService,
    SharedService,
    HttpService,
    ScreenOrientation
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
