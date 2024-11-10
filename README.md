# AWS Slack Cost Reporter

Keeping an eye on budgets is crucial when working in the cloud. Otherwise, the bill might be a big surprise. Of course, configuring budgets is one way to cover this, but I decided to get notified on a regular basis with the amount of the current bill & the current forecast.

This is the module with all resources to send billing reports daily to slack.

## Usage

To use this construct, it is required to authenticate the target AWS account with the slack workspace. To do so, follow the steps in the next section.

So far, the module is published only as a node package. If python & Java support would be appreciated, please open an issue.
For installation instructions, please go to [Installation](#installation).

### Preparation

To authenticate the AWS account with the slack workspace, navigate to the [ChatBot service page](https://us-east-2.console.aws.amazon.com/chatbot/home) and configure a new slack client. This will redirect to slack and ask for permissions. It is required to allow access, to make this work.
Otherwise, the deployment might fail with the error message `"Invalid request provided: AWS Chatbot can't create the configuration because Slack workspace *** is not authorized with AWS account ***"`.

### Installation

To use this construct exposed of this module, install the dependency in your CDK module, by executing

```sh
yarn add aws-slack-cost-reporter
npm install aws-slack-cost-reporter
```

After that, the construct can be instantiated with the stack. Make sure that the `workspaceId` matches the authenticated workspace. The value can be taken from the [Configured Clients page](https://us-east-2.console.aws.amazon.com/chatbot/home?region=us-east-2#/chat-clients). Copy the channel ID from the slack channel details.

After the deployment, inviting the slackbot into the slack channel is crucial. To do so, type `invite @aws` as message in that channel. After this, it is possible to receive test messages, sent on the specified schedule.

```typescript
const stack: cdk.Stack;

new SlackCostReporter(stack, "SlackCostReporter", {
  slackChannelId: "***",
  slackWorkspaceId: "***",
});
```

## Further Reading

- [AWS Admin Guide: Slack Setup](https://docs.aws.amazon.com/chatbot/latest/adminguide/slack-setup.html)
