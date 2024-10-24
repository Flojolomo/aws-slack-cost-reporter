import * as chatbot from "aws-cdk-lib/aws-chatbot";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNodeJs from "aws-cdk-lib/aws-lambda-nodejs";
import * as logs from "aws-cdk-lib/aws-logs";
import * as sns from "aws-cdk-lib/aws-sns";

import { Construct } from "constructs";
import path from "path";

interface CostNotificationSlackBotProps {
  guardRailPolicies?: Array<iam.IManagedPolicy>;
  notificationSchedule: events.Schedule;
  slackChannelId: string;
  slackWorkspaceId: string;
  topic?: sns.ITopic;
}
export class CostNotificationSlackBot extends Construct {
  private static readonly defaultNotificationSchedule = events.Schedule.cron({
    minute: "0",
    hour: "8",
    day: "*",
    month: "*",
    year: "*",
  });

  public constructor(
    scope: Construct,
    id: string,
    private readonly props: CostNotificationSlackBotProps,
  ) {
    super(scope, id);

    const guardrailPolicies = props.guardRailPolicies ?? [this.denyAllPolicy()];
    const slackChannelConfiguration =
      this.slackChannelConfiguration(guardrailPolicies);

    const chatbotTopic = props.topic ?? new sns.Topic(this, "chatbot-topic");
    slackChannelConfiguration.addNotificationTopic(chatbotTopic);

    const readCostExplorerData = this.readCostExplorerDataHandler(chatbotTopic);

    new events.Rule(this, "cost-notification-cron", {
      schedule:
        props.notificationSchedule ??
        CostNotificationSlackBot.defaultNotificationSchedule,
      targets: [new targets.LambdaFunction(readCostExplorerData)],
    });
  }

  private denyAllPolicy(): iam.IManagedPolicy {
    return new iam.ManagedPolicy(this, "DenyAllPolicy", {
      managedPolicyName: "DenyAll",
      statements: [
        new iam.PolicyStatement({
          actions: ["*"],
          effect: iam.Effect.DENY,
          resources: ["*"],
        }),
      ],
    });
  }

  private readCostExplorerDataHandler(topic: sns.ITopic): lambda.IFunction {
    const currentForecastProcessor = new lambdaNodeJs.NodejsFunction(
      this,
      "ReadCostExplorerDataHandler",
      {
        entry: path.join(
          __dirname,
          "lambda/ports/inbound/generate-current-month-forecast-handler.ts",
        ),
        environment: {
          TOPIC_ARN: topic.topicArn,
        },
        logRetention: logs.RetentionDays.ONE_WEEK,
      },
    );

    new iam.ManagedPolicy(this, "ReadCostExplorerPolicy", {
      roles: [currentForecastProcessor.role!],
      statements: [
        new iam.PolicyStatement({
          actions: ["ce:GetCostAndUsage", "ce:GetCostForecast"],
          effect: iam.Effect.ALLOW,
          resources: ["*"],
        }),
      ],
    });

    topic.grantPublish(currentForecastProcessor);
    return currentForecastProcessor;
  }

  private slackChannelConfiguration(
    guardrailPolicies: Array<iam.IManagedPolicy>,
  ): chatbot.SlackChannelConfiguration {
    return new chatbot.SlackChannelConfiguration(
      this,
      "SlackChannelConfiguration",
      {
        guardrailPolicies,
        loggingLevel: chatbot.LoggingLevel.INFO,
        logRetention: logs.RetentionDays.ONE_WEEK,
        slackChannelConfigurationName: "CostNotifications",
        slackWorkspaceId: this.props.slackWorkspaceId,
        slackChannelId: this.props.slackChannelId,
      },
    );
  }
}
