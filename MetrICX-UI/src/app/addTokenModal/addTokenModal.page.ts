import { Component } from '@angular/core';
import { ModalController, NavParams, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TokenEnum } from '../enums/tokens'
import { TokenModel } from './tokenModel';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-addTokenModal',
  templateUrl: './addTokenModal.page.html',
  styleUrls: ['./addTokenModal.page.scss'],
})

export class AddTokenModalPage {
  
  public Tokens = TokenEnum;
  public tokenForm: FormGroup;
  public
 
  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private formBuilder: FormBuilder,
    private storage: Storage,
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
    this.storage.get('tokens').then(tokens => {   
      if (tokens) {
        let tokenModel: TokenModel[] = [];
        tokenModel = tokens
        const length = tokenModel.length; 
        for(let i=0; i<length; i++) {
          this.tokenForm.patchValue({[tokenModel[i].Token]: tokenModel[i].IsSelected});
        }
      }
  })
}

 async save() {
  const tokens: TokenModel[] = [];

    Object.keys(this.tokenForm.controls).forEach(key => {
      const token = new TokenModel();
      token.Token = key;
      token.IsSelected = this.tokenForm.controls[key].value;
      token.Balance = 0;
      tokens.push(token); 
    });

    await this.storage.set('tokens', tokens);
    await this.modalController.dismiss();
 }


  async closeModal() {
    await this.modalController.dismiss();
  }
}