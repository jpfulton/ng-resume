# ng-resume

A personal resume implemented in [Angular v16](https://angular.io/). Static JSON files hosted from the assets folder provide a data source for the resume content and simulate a remote API backend.

## Features

* [Yarn](https://yarnpkg.com) package management
* [SASS](https://sass-lang.com) CSS pre-processing using C-syntax
* Responsive layout implemented with SASS variables for breakpoints and mixins to render [CSS media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries)
* [es-lint](https://eslint.org) style checking
* [JSDOC](https://jsdoc.app) comments
* Unit test suite implemented in [jasmine](https://jasmine.github.io/) and run in [Karma](https://karma-runner.github.io/latest/index.html)
* [VSCode](https://code.visualstudio.com) extension recommendations and settings
* Continuous integration workflow implemented in [GitHub Actions](https://github.com/features/actions)

## DevOps and Deployment

The CI/CD pipeline for this project is implemented in a [GitHub Actions](https://github.com/features/actions) workflow through [YAML](https://yaml.org) file
that can be found [here](https://github.com/jpfulton/ng-resume/blob/main/.github/workflows/ci-and-cd.yml).
Deployments to both preview and production environments are made by the pipeline into
[Microsoft Azure](https://azure.microsoft.com/en-us/) and hosted in a
[Static Web App Service](https://azure.microsoft.com/en-us/products/app-service/static/) resource.
Prior to deployment to either a preview environment or production, merges and PRs must pass
linting, test suite execution and compilation steps. The CI/CD pipeline is triggered by either
a push into the default branch or the opening, reopening or synchronization of a PR into the default
branch. PR build results are deployed to preview environments that are given dynamic DNS entries. Preview environment
locations are posted as comments on the PR following a successful deployment. Closure of a PR will
result in the preview environment being deleted from the Azure resource as a clean up mechanism.
