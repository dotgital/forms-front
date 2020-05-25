import { SettingsServicesTemplatesComponent } from './settings/settings-services-templates/settings-services-templates.component';
import { SettingsFiltersComponent } from './settings/settings-filters/settings-filters.component';
import { RoleGuard } from './services/role.guard';
import { SettingsPermissionsComponent } from './settings/settings-permissions/settings-permissions.component';
import { UsersViewComponent } from './users/users-view/users-view.component';
import { UsersListComponent } from './users/users-list/users-list.component';
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
    { path: 'clients/:id/case/:caseId', component: ClientsViewComponent },
    { path: 'users', component: UsersListComponent },
    { path: 'users/:id', component: UsersViewComponent },
    { path: 'forms', component: FillComponent },
    { path: 'settings', component: SettingsComponent, canActivate: [RoleGuard] },
    { path: 'settings/layout', component: SettingsLayoutComponent, canActivate: [RoleGuard] },
    { path: 'settings/permissions', component: SettingsPermissionsComponent, canActivate: [RoleGuard] },
    { path: 'settings/filters', component: SettingsFiltersComponent, canActivate: [RoleGuard] },
    { path: 'settings/services-templates', component: SettingsServicesTemplatesComponent, canActivate: [RoleGuard] },
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
