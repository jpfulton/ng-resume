import { Routes } from '@angular/router';

import { ResumeViewComponent } from './views/resume/resume-view.component';
import { ErrorViewComponent } from './views/error/error-view.component';
import { NotFoundViewComponent } from './views/not-found/not-found-view.component';
import { CookiePolicyViewComponent } from './views/cookie-policy/cookie-policy-view.component';
import { PrivacyPolicyComponent } from './core/components/privacy-policy/privacy-policy.component';

const TITLE_PREFIX = "jpatrickfulton.com - ";

const routeConfig: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: ResumeViewComponent,
        title: TITLE_PREFIX + 'Resume',
        data: {
            image: "/assets/images/riverwalk.png",
            description: "A personal resume implemented in Angular.",
            keywords: ["resume", "Angular", "Angular Universal"],
            allowRobotIndexing: true
        }
    },
    {
        path: 'error',
        component: ErrorViewComponent,
        title: TITLE_PREFIX + 'Error',
        data: {
            image: "/assets/images/mountains.jpg",
            description: "Something went wrong."
        }
    },
    {
        path: 'cookiepolicy',
        component: CookiePolicyViewComponent,
        title: TITLE_PREFIX + 'Cookie Policy',
        data: {
            image: "/assets/images/cookie.jpg",
            description: "Site cookie policy.",
            keywords: ["cookie policy", "Angular", "Angular Universal"],
            allowRobotIndexing: true
        }
    },
    {
        path: 'privacy',
        component: PrivacyPolicyComponent,
        title: TITLE_PREFIX + 'Privacy Policy',
        data: {
            image: "/assets/images/harbor.jpg",
            description: "Site privacy policy.",
            keywords: ["privacy policy", "Angular", "Angular Universal"],
            allowRobotIndexing: true
        }
    },
    {
        path: '**',
        component: NotFoundViewComponent,
        title: TITLE_PREFIX + 'Not Found',
        data: {
            image: "/assets/images/mountains.jpg",
            description: "Page not found.",
        }
    }
];

export default routeConfig;