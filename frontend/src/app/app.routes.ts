import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { adminGuard } from './core/guards/admin.guard';

import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './shared/components/login/login.component';
import { ProjectFormComponent } from './admin/components/project-form/project-form.component';
import { ProjectListComponent } from './admin/components/project-list/project-list.component';

export const routes: Routes = [
    {
        path: 'admin',
        component: AdminLayoutComponent,
        canActivate: [adminGuard],
        children: [
            { path: 'projects', component: ProjectListComponent, data: { title: 'Projects' } },
            { path: 'projects/add', component: ProjectFormComponent, data: { title: 'Add project' } },
            { path: 'projects/edit/:id', component: ProjectFormComponent, data: { title: 'Edit project' } },
            { path: '', redirectTo: 'projects', pathMatch: 'full' }
        ]
    },
    { path: 'admin-login', component: LoginComponent, data: { title: 'Sign in' } },
    { path: '', component: LandingComponent, data: { title: 'Pawel Staniul - portfolio' } },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }