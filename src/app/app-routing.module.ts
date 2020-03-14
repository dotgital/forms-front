import { SettingsLayoutComponent } from './settings/settings-layout/settings-layout.component';
import { SettingsComponent } from './settings/settings.component';
import { DetailsViewComponent } from './clients/details-view/details-view.component';
import { ListViewComponent } from './clients/list-view/list-view.component';
import { FillComponent } from './forms/fill/fill.component';
import { ResetComponent } from './auth/reset/reset.component';
import { ForgotComponent } from './auth/forgot/forgot.component';
import { AuthGuard } from './services/auth.guard';
import { NavigationComponent } from './navigation/navigation.component';
import { LoginComponent } from './auth/login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotComponent },
  { path: 'reset-password', component: ResetComponent },
  { path: '', component: NavigationComponent, canActivate: [AuthGuard], children: [
    { path: 'clients', component: ListViewComponent },
    { path: 'clients/:id', component: DetailsViewComponent },
    { path: 'forms', component: FillComponent },
    { path: 'settings', component: SettingsComponent },
    { path: 'settings/layout', component: SettingsLayoutComponent }
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
