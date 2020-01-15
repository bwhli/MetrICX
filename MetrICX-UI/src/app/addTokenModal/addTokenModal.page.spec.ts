import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddTokenModalPage } from './addTokenModal.page';

describe('WalletPage', () => {
  let component: AddTokenModalPage;
  let fixture: ComponentFixture<AddTokenModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddTokenModalPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddTokenModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
