self.__BUILD_MANIFEST = {
  "/": [
    "static/chunks/pages/index.js"
  ],
  "/dashboard": [
    "static/chunks/pages/dashboard.js"
  ],
  "/group/[id]": [
    "static/chunks/pages/group/[id].js"
  ],
  "/register": [
    "static/chunks/pages/register.js"
  ],
  "__rewrites": {
    "afterFiles": [],
    "beforeFiles": [],
    "fallback": []
  },
  "sortedPages": [
    "/",
    "/_app",
    "/_error",
    "/api/proxy",
    "/confirm",
    "/dashboard",
    "/group/[id]",
    "/register",
    "/test-tailwind"
  ]
};self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB()