import * as chatbot from "aws-cdk-lib/aws-chatbot";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as logs from "aws-cdk-lib/aws-logs";
import * as sns from "aws-cdk-lib/aws-sns";

import { Construct } from "constructs";
import { HandlerFunction } from "./lambda/ports/inbound/handler-function";

/**
 * Configuration of an the {@link SlackCostReporter} instance.
 */
export interface SlackCostReporterProps {
  /**
   * Guardrails applied to the permissions of the chatbot. If not set
   * the chatbot has no permission for any operation.
   * @default None
   */
  readonly guardRailPolicies?: Array<iam.IManagedPolicy>;
  /**
   * Schedule  or rate at which cost reports are generated and sent to the slack
   * channel. If not set the report is creates every day at 8 AM UTC.
   * @default None
   */
  readonly schedule?: events.Schedule;
  /**
   * Channel ID of the slack channel to send the reports.
   */
  readonly slackChannelId: string;
  /**
   * ID of the slack workspace. It is crucial, that a client
   * is set up & authenticated for this ID.
   */
  readonly slackWorkspaceId: string;
  /**
   * Topic used as to notify the slack bot. If not set, a new topic
   * is created.
   * @default None
   */
  readonly topic?: sns.ITopic;
}

/**
 * The constructs sets up a chatbot sending cost reports of the current bill & the expected
 * forecast to a slack channel based on a rate or schedule.
 * To use this construct, manual steps are required to be able to authorize with the AWS account.
 * Therefore, navigate to {@link https://us-east-2.console.aws.amazon.com/chatbot/home} and configure the slack client
 * corresponding to the {@link SlackCostReporterProps.slackWorkspaceId}. Right now, this is neither possible via the CLI, nor CloudFormation.
 * If this is not done, the deployment is going to fail with the error message
 * "Invalid request provided: AWS Chatbot can't create the configuration because Slack workspace *** is not authorized with AWS account ***".
 */
export class SlackCostReporter extends Construct {
  /**
   * Default schedule to generate the cost report. This is used, if {@link SlackCostReporterProps.schedule}
   * is not set.
   */
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
    private readonly props: SlackCostReporterProps,
  ) {
    super(scope, id);

    const guardrailPolicies = props.guardRailPolicies ?? [this.denyAllPolicy()];

    const slackChannelConfiguration =
      this.slackChannelConfiguration(guardrailPolicies);

    const chatbotTopic = props.topic ?? new sns.Topic(this, "ChatbotTopic");
    slackChannelConfiguration.addNotificationTopic(chatbotTopic);

    const reportGenerator = this.reportGeneratorFunction(chatbotTopic);
    this.schedule(
      props.schedule ?? SlackCostReporter.defaultNotificationSchedule,
      reportGenerator,
    );
  }

  private schedule(
    schedule: events.Schedule,
    reportGenerator: lambda.IFunction,
  ) {
    new events.Rule(this, "CronJob", {
      schedule: schedule,
      targets: [new targets.LambdaFunction(reportGenerator)],
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

  private reportGeneratorFunction(topic: sns.ITopic): lambda.IFunction {
    const currentForecastProcessor = new HandlerFunction(
      this,
      "ReadCostExplorerDataHandler",
      {
        environment: {
          TOPIC_ARN: topic.topicArn,
        },
        logRetention: logs.RetentionDays.ONE_WEEK,
      },
    );

    // new lambdaNodeJs.NodejsFunction(
    //   this,
    //   "ReadCostExplorerDataHandler",
    //   {
    //     entry: path.join(
    //       __dirname,
    //       "lambda/ports/inbound/generate-current-month-forecast-handler.js",
    //     ),
    //     environment: {
    //       TOPIC_ARN: topic.topicArn,
    //     },
    //     logRetention: logs.RetentionDays.ONE_WEEK,
    //   },
    // );

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
