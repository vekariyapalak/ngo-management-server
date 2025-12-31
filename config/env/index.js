import devConfig from "./development.js";
import prodConfig from "./production.js";
let appConfig;
if (process.env.NODE_ENV === "development") {
  appConfig = devConfig;
} else {
  appConfig = prodConfig;
}

export default appConfig;
