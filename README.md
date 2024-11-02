# AWS Slack Cost Reporter

Keeping an eye on budgets is crucial when working in the cloud. Otherwise, the bill might be a big surprise. Of course, configuring budgets is one way to cover this, but I decided to get notified on a regular basis with the amount of the current bill & the current forecast.

To use this construct exposed of this module, integrate the following code snippet in your stack.

```typescript
const stack: cdk.Stack;

new SlackCostReporter(stack, "SlackCostReporter", {
  slackChannelId: "***",
  slackWorkspaceId: "***",
});
```
