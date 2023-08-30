# ng-resume

[![continous-integration-and-deployment](https://github.com/jpfulton/ng-resume/actions/workflows/ci-and-cd-workflow.yml/badge.svg)](https://github.com/jpfulton/ng-resume/actions/workflows/ci-and-cd-workflow.yml)
![Visitors](https://visitor-badge.laobi.icu/badge?page_id=jpfulton.ng-resume)

A personal resume implemented in [Angular v16](https://angular.io/) and
[Azure Functions](https://learn.microsoft.com/en-us/azure/azure-functions/functions-overview?pivots=programming-language-csharp).

## Features

- [Yarn](https://yarnpkg.com) package management
- [SASS](https://sass-lang.com) CSS pre-processing using C-syntax
- Responsive layout implemented with SASS variables for breakpoints and mixins to render [CSS media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries)
- [es-lint](https://eslint.org) style checking
- [JSDOC](https://jsdoc.app) comments
- Unit test suite implemented in [jasmine](https://jasmine.github.io/) and run in [Karma](https://karma-runner.github.io/latest/index.html)
- [VSCode](https://code.visualstudio.com) extension recommendations and settings
- Continuous integration workflow implemented in [GitHub Actions](https://github.com/features/actions)
- E2E automated test suite for deployment santity implemented in [Cypress](https://docs.cypress.io/guides/overview/why-cypress)
- [Google Analytics](https://analytics.google.com/) integration that pushes page views based on [Angular Router](https://angular.io/api/router/Router) events
- Integration with [Azure Monitor (Application Insights)](https://learn.microsoft.com/en-us/azure/azure-monitor/overview)
- User cookie consent banner implementation
- Build-time prerendering using [Angular Universal](https://github.com/angular/universal)
- SEO head and meta tag generation through dynamically configured route data with support for:
  - [iMessage Previews](https://developer.apple.com/library/archive/technotes/tn2444/_index.html)
  - [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/guides/getting-started)
  - [Open Graph Previews](https://ogp.me)
- [Angular Material](https://material.angular.io) component integration
- Light and dark themes that respect operating system preferences and switching via user interaction
- RESTful backend API implemented in [C# 10](https://learn.microsoft.com/en-us/dotnet/csharp/) and [Azure Functions v4](https://learn.microsoft.com/en-us/azure/azure-functions/functions-overview?pivots=programming-language-csharp)
  - [OpenAPI v3](https://www.openapis.org) backend API descriptors
  - [Swagger](https://swagger.io) interactive backend API documentation and harness

## DevOps and Deployment

### CI/CD Workflow

The CI/CD workflow pipeline for this project is implemented in a [GitHub Actions](https://github.com/features/actions) workflow through [YAML](https://yaml.org) file
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

### E2E Deployment Santity Testing

Following deployments to both preivew and production Azure environments, an end-to-end test suite is run to validate the sanity of the deployment. In the event of a test failure, screenshots of the
website state following each individual test are uploaded as artifacts to the source workflow. After
each test suite run, a video of the test suite run is always uploaded as a workflow artifact.

## Building and Debugging

### macOS and Visual Studio Code

Primarily authored on [macOs](https://www.apple.com/macos/ventura/) in [Visual Studio Code](https://code.visualstudio.com),
several tips and tricks apply in addition to using the recommended extensions:

- Reference the workaround in [this](https://github.com/OmniSharp/omnisharp-vscode/issues/4903)
  issue if the debugger fails to attach to the C# functions locally
- Enable the setting `Editor: Format on Type` in VSCode
- Utilize [this](https://github.com/isen-ng/homebrew-dotnet-sdk-versions)
  [Homebrew](https://brew.sh) tap to install multiple versions of the dotnet SDK in parallel
- When debugging in Chrome Dev Tools, the
  [Angular DevTools Extension](https://angular.io/guide/devtools) comes in handy
