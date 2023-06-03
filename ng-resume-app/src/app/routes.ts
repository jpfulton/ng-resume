import { Routes } from '@angular/router';

import { ResumeViewComponent } from './views/resume/resume-view.component';
import { ErrorComponent } from './core/components/error/error.component';
import { NotFoundComponent } from './core/components/not-found/not-found.component';
import { CookiePolicyComponent } from './core/components/cookie-policy/cookie-policy.component';
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
        component: ErrorComponent,
        title: TITLE_PREFIX + 'Error',
        data: {
            image: "/assets/images/mountains.jpg",
            description: "Something went wrong."
        }
    },
    {
        path: 'cookiepolicy',
        component: CookiePolicyComponent,
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
        component: NotFoundComponent,
        title: TITLE_PREFIX + 'Not Found',
        data: {
            image: "/assets/images/mountains.jpg",
            description: "Page not found.",
        }
    }
];

export default routeConfig;