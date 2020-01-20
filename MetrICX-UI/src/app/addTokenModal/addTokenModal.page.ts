import { Component } from '@angular/core';
import { ModalController, NavParams, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TokenEnum } from '../services/storage/tokens'
import { TokenModel } from '../services/storage/tokenModel';
import { Storage } from '@ionic/storage';
import { SettingsService } from '../services/storage/settings.service';
import { FcmService } from '../services/fcm/fcm.service';

@Component({
  selector: 'app-addTokenModal',
  templateUrl: './addTokenModal.page.html',
  styleUrls: ['./addTokenModal.page.scss'],
})

export class AddTokenModalPage {
  
  public Tokens = TokenEnum;
  public tokenForm: FormGroup;
   
  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private formBuilder: FormBuilder,
    private storage: Storage,   
    private settingsService: SettingsService,
    private fcm: FcmService
  ) {
    this.tokenForm = formBuilder.group({
      AC3: [false],
      SPORT: [false],
      SSX: [false],
      TAP:[false],
      VELT: [false],
      WOK: [false]
    }
    );
  }
 
  ionViewWillEnter() {
    this.settingsService.get().then(settings => {   
      if (settings && settings.tokens) {
        let tokenModel: TokenModel[] = [];
        tokenModel = settings.tokens
        const length = tokenModel.length; 
        for(let i=0; i<length; i++) {
          this.tokenForm.patchValue({[tokenModel[i].Token]: tokenModel[i].IsSelected});
        }
      }
  })
}

  async save() {
    var settings = await this.settingsService.get()

    const tokens: TokenModel[] = [];

    Object.keys(this.tokenForm.controls).forEach(key => {
      const token = new TokenModel();
      token.Token = key;
      token.IsSelected = this.tokenForm.controls[key].value;
      token.Balance = 0;
      const contractAddress: TokenEnum = TokenEnum[key];
      token.ContractAddress = contractAddress;
      tokens.push(token); 
    });
    settings.tokens = tokens;
    await this.modalController.dismiss();

    try {
      this.settingsService.save(settings);
    }
    catch {
      //Do nothing if we could not update firestore, it probably due to token not being available
    }
  }

  async closeModal() {
    await this.modalController.dismiss();
  }
}