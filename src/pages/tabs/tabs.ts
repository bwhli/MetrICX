import { Component } from '@angular/core';

import { Govern } from '../govern/govern';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = Govern;
  tab3Root = ContactPage;

  constructor() {

  }
}
