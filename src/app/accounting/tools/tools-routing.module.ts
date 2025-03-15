import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolsComponent } from './tools.component';
import { RouterModule, Routes } from '@angular/router';
import { BarcodeInformationComponent } from './barcode-information/barcode-information.component';

const routes: Routes = [
  {
      path: "",
      component: ToolsComponent,
      children: [
        {
          path: "",
          redirectTo: "barcode-info",
          pathMatch: "full"
      },
      {
        path: "barcode-info",
        component: BarcodeInformationComponent
      },
    ]
  }]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ToolsRoutingModule { }
