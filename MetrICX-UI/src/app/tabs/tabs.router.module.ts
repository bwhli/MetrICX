import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'wallet',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../wallet-tab/wallet-tab.module').then(m => m.WalletTabPageModule)
          }
        ]
      },
      {
        path: 'preps',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../prep-tab/prep-tab.module').then(m => m.PrepTabModule)
          }
        ]
      },
      {
        path: 'tokens',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../tokens/tokens.module').then(m => m.TokensPageModule)
          }
        ]
      },
      {
        path: 'metrics',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../metrics/metrics.module').then(m => m.MetricsPageModule)
          }
        ]
      },
      {
        path: 'settings',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../settings/settings.module').then(m => m.SettingsPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/wallet',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/wallet',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
