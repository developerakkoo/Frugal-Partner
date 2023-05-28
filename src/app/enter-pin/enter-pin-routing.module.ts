import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnterPinPage } from './enter-pin.page';

const routes: Routes = [
  {
    path: '',
    component: EnterPinPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnterPinPageRoutingModule {}
