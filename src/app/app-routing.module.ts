import { EditComponent } from './clients/edit/edit.component';
import { ResetComponent } from './auth/reset/reset.component';
import { ForgotComponent } from './auth/forgot/forgot.component';
import { AuthGuard } from './services/auth.guard';
import { NavigationComponent } from './navigation/navigation.component';
import { LoginComponent } from './auth/login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './clients/list/list.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotComponent },
  { path: 'reset-password', component: ResetComponent },
  { path: '', component: NavigationComponent, canActivate: [AuthGuard], children: [
    { path: 'clients', component: ListComponent },
    { path: 'clients/:id/edit', component: EditComponent },
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
