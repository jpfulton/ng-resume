import { Routes } from '@angular/router';

import { ResumeComponent } from './resume/resume.component';
import { ErrorComponent } from './core/components/error/error.component';
import { NotFoundComponent } from './core/components/not-found/not-found.component';

const routeConfig: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: ResumeComponent,
        title: 'Resume'
    },
    {
        path: 'error',
        component: ErrorComponent,
        title: 'Error'
    },
    {
        path: '**',
        component: NotFoundComponent,
        title: 'Not Found'
    }
];

export default routeConfig;