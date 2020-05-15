const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/Estimate.vue") },
      {
        path: "/estimations",
        component: () => import("pages/Estimations.vue")
      },

      { path: "/auth", component: () => import("pages/Auth.vue") },
      {
        path: "/organizations",
        component: () => import("pages/Organizations.vue")
      }
    ]
  }
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/Error404.vue")
  });
}

export default routes;
