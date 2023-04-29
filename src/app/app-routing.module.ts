import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './services/auth.guard';
import { AirtableComponent } from './pages/airtable/airtable.component';
import { LoginComponent } from './pages/login/login.component';
import { PagenotfoundComponent } from './pages/pagenotfound/pagenotfound.component';
import { ProjectSettingComponent } from './pages/project-setting/project-setting.component';
import { DataPropertiesSettingComponent } from './pages/data-properties-setting/data-properties-setting.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'table' },
  { path: 'table', component: AirtableComponent, canActivate: [AuthGuard] },
  { path: 'project-setting', component: ProjectSettingComponent, canActivate: [AuthGuard] },
  { path: 'data-properties-setting', component: DataPropertiesSettingComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: '**', component: PagenotfoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }