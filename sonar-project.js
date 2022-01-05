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
      "sonar.login": "43c5bdd93e62af907da4c61b83dfd4116129212e",
    },
  },
  () => {}
);
