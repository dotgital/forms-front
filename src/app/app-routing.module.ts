import { RegistrationComponent } from './auth/registration/registration.component';
import { ClientsListComponent } from './clients/clients-list/clients-list.component';
import { SettingsLayoutComponent } from './settings/settings-layout/settings-layout.component';
import { SettingsComponent } from './settings/settings.component';
import { FillComponent } from './forms/fill/fill.component';
import { ResetComponent } from './auth/reset/reset.component';
import { ForgotComponent } from './auth/forgot/forgot.component';
import { AuthGuard } from './services/auth.guard';
import { NavigationComponent } from './navigation/navigation.component';
import { LoginComponent } from './auth/login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientsViewComponent } from './clients/clients-view/clients-view.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'forgot-password', component: ForgotComponent },
  { path: 'reset-password', component: ResetComponent },
  { path: '', component: NavigationComponent, canActivate: [AuthGuard], children: [
    { path: 'clients', component: ClientsListComponent },
    { path: 'clients/:id', component: ClientsViewComponent },
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
