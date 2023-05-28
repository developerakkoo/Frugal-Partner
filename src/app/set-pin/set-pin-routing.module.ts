import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SetPinPage } from './set-pin.page';

const routes: Routes = [
  {
    path: '',
    component: SetPinPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetPinPageRoutingModule {}
