import { Routes } from "@angular/router";
import { authorizationGuard } from "./core/guards/authorization.guard";

const TITLE_PREFIX = "jpatrickfulton.com - ";

const routeConfig: Routes = [
  {
    path: "",
    pathMatch: "full",
    loadComponent: () =>
      import("./views/resume/resume-view.component").then(
        (c) => c.ResumeViewComponent,
      ),
    title: TITLE_PREFIX + "Resume",
    data: {
      image: "/assets/images/riverwalk.png",
      description: "A personal resume implemented in Angular.",
      keywords: ["resume", "Angular", "Angular Universal"],
      allowRobotIndexing: true,
    },
  },
  {
    path: "error",
    loadComponent: () =>
      import("./views/error/error-view.component").then(
        (c) => c.ErrorViewComponent,
      ),
    title: TITLE_PREFIX + "Error",
    data: {
      image: "/assets/images/mountains.jpg",
      description: "Something went wrong.",
    },
  },
  {
    path: "cookiepolicy",
    loadComponent: () =>
      import("./views/cookie-policy/cookie-policy-view.component").then(
        (c) => c.CookiePolicyViewComponent,
      ),
    title: TITLE_PREFIX + "Cookie Policy",
    data: {
      image: "/assets/images/cookie.jpg",
      description: "Site cookie policy.",
      keywords: ["cookie policy", "Angular", "Angular Universal"],
      allowRobotIndexing: true,
    },
  },
  {
    path: "privacy",
    loadComponent: () =>
      import("./views/privacy-policy/privacy-policy-view.component").then(
        (c) => c.PrivacyPolicyViewComponent,
      ),
    title: TITLE_PREFIX + "Privacy Policy",
    data: {
      image: "/assets/images/harbor.jpg",
      description: "Site privacy policy.",
      keywords: ["privacy policy", "Angular", "Angular Universal"],
      allowRobotIndexing: true,
    },
  },
  {
    path: "claims",
    loadComponent: () =>
      import("./views/claims/claims-view.component").then(
        (c) => c.ClaimsViewComponent,
      ),
    title: TITLE_PREFIX + "Token Claims",
    canActivate: [authorizationGuard],
    data: {
      roles: ["SiteOwners", "Administrators", "Developers"],
      image: "/assets/images/harbor.jpg",
      description: "Token claims.",
      keywords: ["Angular", "Angular Universal"],
      allowRobotIndexing: false,
    },
  },
  {
    path: "users",
    loadComponent: () =>
      import("./views/users/users-view.component").then(
        (c) => c.UsersViewComponent,
      ),
    title: TITLE_PREFIX + "Users",
    canActivate: [authorizationGuard],
    data: {
      roles: ["SiteOwners", "Administrators"],
      image: "/assets/images/harbor.jpg",
      description: "User administration.",
      keywords: ["Angular", "Angular Universal"],
      allowRobotIndexing: false,
    },
  },
  {
    path: "test",
    loadComponent: () =>
      import("./views/test/test-view.component").then(
        (c) => c.TestViewComponent,
      ),
    title: TITLE_PREFIX + "Test Harness",
    canActivate: [authorizationGuard],
    data: {
      roles: ["SiteOwners", "Administrators", "Developers"],
      image: "/assets/images/harbor.jpg",
      description: "Test harness.",
      keywords: ["Angular", "Angular Universal"],
      allowRobotIndexing: false,
    },
  },
  {
    path: "**",
    loadComponent: () =>
      import("./views/not-found/not-found-view.component").then(
        (c) => c.NotFoundViewComponent,
      ),
    title: TITLE_PREFIX + "Not Found",
    data: {
      image: "/assets/images/mountains.jpg",
      description: "Page not found.",
    },
  },
];

export default routeConfig;
