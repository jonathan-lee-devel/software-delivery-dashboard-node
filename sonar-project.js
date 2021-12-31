const sonarqubeScanner = require("sonarqube-scanner");
sonarqubeScanner(
  {
    serverUrl: "http://localhost:9000",
    options: {
      "sonar.sources": "src",
      "sonar.tests": "src",
      "sonar.inclusions": "**",
      "sonar.test.inclusions":
        "src/**/*.spec.js,src/**/*.spec.jsx,src/**/*.test.js,src/**/*.test.jsx",
      "sonar.javascript.lcov.reportPaths": "coverage/lcov.info",
      "sonar.login": "5ac18e516d41bc2103a1b7aca0983c0dc557f96e",
    },
  },
  () => {}
);
