import { Routes } from '@angular/router';
import { ResumeComponent } from './resume/resume.component';
import { ErrorComponent } from './core/components/error/error.component';

const routeConfig: Routes = [
    {
        path: '',
        component: ResumeComponent,
        title: 'Resume'
    },
    {
        path: 'error',
        component: ErrorComponent,
        title: 'Error'
    }
];

export default routeConfig;