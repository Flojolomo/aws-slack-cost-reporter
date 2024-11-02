import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import { Logger } from "@aws-lambda-powertools/logger";
import { NotificationClient } from "../../domains/report";

const snsClient = new SNSClient({});

const logger = new Logger({ serviceName: "slack-client" });

const notify = (topicArn: string) => {
  return async ({
    from,
    to,
    currentSpending,
    forecast,
  }: {
    from: Date;
    to: Date;
    currentSpending: number;
    forecast: number;
  }): Promise<void> => {
    await snsClient.send(
      new PublishCommand({
        TopicArn: topicArn,
        Message: JSON.stringify({
          version: "1.0",
          source: "custom",
          content: {
            textType: "client-markdown",
            title: "Current Cost and Forecast",
            description: `
                    :warning: Cost estimate from ${from} to ${to}
                    * *Current Cost* ${currentSpending}
                    * *Forecast* ${forecast}`,
          },
        }),
      }),
    );

    logger.info("Sent notification to slack");
  };
};

export const slackClient = ({
  topicArn,
}: {
  topicArn: string;
}): NotificationClient => ({
  notify: notify(topicArn),
});
