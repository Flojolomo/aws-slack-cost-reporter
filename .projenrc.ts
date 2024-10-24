import { awscdk } from "projen";
const project = new awscdk.AwsCdkConstructLibrary({
  author: "Florian Siegel",
  authorAddress: "florian1siegel@googlemail.com",
  cdkVersion: "2.164.0",
  defaultReleaseBranch: "main",
  jsiiVersion: "~5.5.0",
  name: "aws-slack-cost-notification-bot",
  projenrcTs: true,
  repositoryUrl:
    "https://github.com/florian1siegel/aws-slack-cost-notification-bot.git",
  prettier: true,
  vscode: true,
  deps: [
    "@aws-lambda-powertools/logger",
    "@aws-sdk/client-sns",
  ] /* Runtime dependencies of this module. */,
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  devDeps: [
    "@types/aws-lambda",
    "aws-lambda",
  ] /* Build dependencies for this module. */,
  // packageName: undefined,  /* The "name" in package.json. */
});

project.vscode?.extensions.addRecommendations("esbenp.prettier-vscode");
project.vscode?.settings.addSettings(
  {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
  },
  ["typescript", "markdown", "json"],
);

project.eslint?.addRules({
  "sort-imports": ["off"],
  "import/order": "error",
});
project.synth();
