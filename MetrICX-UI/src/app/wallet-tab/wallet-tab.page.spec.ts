import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WalletTabPage } from './wallet-tab.page';

describe('WalletTabPage', () => {
  let component: WalletTabPage;
  let fixture: ComponentFixture<WalletTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WalletTabPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WalletTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
