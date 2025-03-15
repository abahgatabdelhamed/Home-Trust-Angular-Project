import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PermissionsComponent } from './permissions.component';
import {  StatementComponent } from './statement/statement.component';
import { AddEntrystatmentComponent } from './add-entrystatment/add-entrystatment.component';
import { StatementsGuard } from '../../services/statements.guard';
const routes: Routes = [
  {
      path: "",
      component: PermissionsComponent,
      children: [
        {
            path: "",
            redirectTo: "",
            pathMatch: "full"
        },
        {
          path: "entrystatments",
          component: StatementComponent,
          canActivate:[StatementsGuard],
          data: {feature: 2},
        },
        {
          path: "exitstatments",
          component: StatementComponent,
          canActivate:[StatementsGuard],
          data: {feature: 2},
        },
        {
          path: "newentrystatments",
          component: AddEntrystatmentComponent,
          canActivate:[StatementsGuard],
          data: {feature: 1},
        },
        {
          path: "newentrystatments/:id",
          component: AddEntrystatmentComponent,
          canActivate:[StatementsGuard],
          data: {feature: 2},
        },
        {
          path: "newexitentrystatments/:id",
          component: AddEntrystatmentComponent,
          canActivate:[StatementsGuard],
          data: {feature: 3},
        },
        {
          path: "newexitstatments/:id",
          component: AddEntrystatmentComponent,
          canActivate:[StatementsGuard],
          data: {feature: 3},
        },
    ]
  }]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermissionsRoutingModule { }
