import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import { Logger } from "@aws-lambda-powertools/logger";
import { INotificationClient } from "../../domains/report";

const snsClient = new SNSClient({});

const logger = new Logger({ serviceName: "slack-client" });

const notify = (topicArn: string) => {
  return async ({
    title,
    message,
    currentSpending,
    forecast,
  }: {
    title: string;
    message: string;
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
            title,
            description: `
                    :warning: ${message}
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
}): INotificationClient => ({
  notify: notify(topicArn),
});
