import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TokensTabPage } from './tokens-tab.page';

describe('WalletPage', () => {
  let component: TokensTabPage;
  let fixture: ComponentFixture<TokensTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TokensTabPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TokensTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
