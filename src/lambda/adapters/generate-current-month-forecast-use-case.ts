import { Report } from "../domains/report";
import { costExplorerClient } from "../ports/outbound/cost-explorer-client";
import { slackClient } from "../ports/outbound/slack-client";

export const generateCurrentMonthForecastUseCase = async (topicArn: string) => {
  const today = new Date();

  const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
  const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const forecast = new Report(
    startDate,
    endDate,
    slackClient({ topicArn }),
    costExplorerClient,
  );

  await forecast.generate();
  await forecast.send();
};
