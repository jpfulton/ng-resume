import { Routes } from '@angular/router';

import { ResumeComponent } from './resume/resume.component';
import { ErrorComponent } from './core/components/error/error.component';
import { NotFoundComponent } from './core/components/not-found/not-found.component';
import { CookiePolicyComponent } from './core/components/cookie-policy/cookie-policy.component';

const TITLE_PREFIX = "jpatrickfulton.com - ";

const routeConfig: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: ResumeComponent,
        title: TITLE_PREFIX + 'Resume'
    },
    {
        path: 'error',
        component: ErrorComponent,
        title: TITLE_PREFIX + 'Error'
    },
    {
        path: 'cookiepolicy',
        component: CookiePolicyComponent,
        title: TITLE_PREFIX + 'Cookie Policy'
    },
    {
        path: '**',
        component: NotFoundComponent,
        title: TITLE_PREFIX + 'Not Found'
    }
];

export default routeConfig;