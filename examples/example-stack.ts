import { App, CfnParameter, Stack } from "aws-cdk-lib";
import { Schedule } from "aws-cdk-lib/aws-events";
import { SlackCostReporter } from "../src/";

const app = new App();

const stack = new Stack(app);
const slackChannelId = new CfnParameter(stack, "SlackChannelId", {
  description: "Id of the slack channel to publish messages",
});
const slackWorkspaceId = new CfnParameter(stack, "SlackWorkspaceId", {
  description: "Id of the slack workspace",
});

new SlackCostReporter(stack, "SlackCostReporter", {
  organizationIdentifier: "Netlight AFT",
  schedule: Schedule.cron({
    minute: "0",
    hour: "*",
  }),
  slackChannelId: slackChannelId.valueAsString,
  slackWorkspaceId: slackWorkspaceId.valueAsString,
});
