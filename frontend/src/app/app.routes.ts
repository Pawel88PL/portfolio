import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { adminGuard } from './core/guards/admin.guard';

import { AdminComponent } from './admin/admin.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './shared/components/login/login.component';

export const routes: Routes = [
    {
        path: 'admin',
        component: AdminComponent,
        canActivate: [adminGuard],
        children: [
            { path: '', redirectTo: 'login', pathMatch: 'full' }
        ]
    },
    { path: '', redirectTo: 'landing', pathMatch: 'full' },
    { path: 'login', component: LoginComponent, data: { title: 'Sign in' } },
    { path: 'landing', component: LandingComponent, data: { title: 'Pawel Staniul - portfolio' } },
    { path: '**', redirectTo: 'login' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }