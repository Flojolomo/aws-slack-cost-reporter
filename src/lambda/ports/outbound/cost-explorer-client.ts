// eslint-disable-next-line import/no-extraneous-dependencies
import {
  CostExplorerClient,
  GetCostAndUsageCommand,
  GetCostForecastCommand,
} from "@aws-sdk/client-cost-explorer";
import { Logger } from "@aws-lambda-powertools/logger";
import { IPaymentClient, ISpendingByService } from "../../domains/report";

const costExplorer = new CostExplorerClient({});

const logger = new Logger({ serviceName: "cost-explorer-client" });

const toNumber = (amount: string | undefined): number => {
  if (!amount) {
    return 0;
  }

  return Number((Math.round(Number(amount) * 100) / 100).toFixed(2));
};

const getCurrentSpending = async (from: Date, to: Date): Promise<number> => {
  logger.info(`Requesting current cost from ${from} to ${to}`);
  const currentCostAndUsage = await costExplorer.send(
    new GetCostAndUsageCommand({
      Granularity: "MONTHLY",
      //   https://aws.amazon.com/blogs/aws-cloud-financial-management/understanding-your-aws-cost-datasets-a-cheat-sheet/
      Metrics: ["UnblendedCost"],
      TimePeriod: {
        Start: from.toISOString().split("T")[0],
        End: to.toISOString().split("T")[0],
      },
    }),
  );

  const amount =
    currentCostAndUsage.ResultsByTime?.[0]?.Total?.UnblendedCost?.Amount;
  logger.info(`Got current cost ${amount}`);

  return toNumber(amount);
};

const getForecast = async (to: Date): Promise<number | undefined> => {
  const today = new Date();
  logger.info(`Requesting forecast from ${today} to ${to}`);

  try {
    const forecast = await costExplorer.send(
      new GetCostForecastCommand({
        Granularity: "MONTHLY",
        Metric: "UNBLENDED_COST",
        TimePeriod: {
          Start: today.toISOString().split("T")[0],
          End: to.toISOString().split("T")[0],
        },
      }),
    );

    const amount = forecast.Total?.Amount;
    logger.info(`Got forecast ${amount}`);

    return toNumber(amount);
  } catch (error: unknown) {
    logger.error(`Failed to determine forecast: ${error}`);
    return;
  }
};

const getSpendingByService = async (
  from: Date,
  to: Date,
): Promise<Array<ISpendingByService>> => {
  logger.info(
    `Requesting current cost from ${from} to ${to} grouped by service`,
  );

  const currentCostAndUsage = await costExplorer.send(
    new GetCostAndUsageCommand({
      Granularity: "MONTHLY",
      //   https://aws.amazon.com/blogs/aws-cloud-financial-management/understanding-your-aws-cost-datasets-a-cheat-sheet/
      Metrics: ["UnblendedCost"],
      TimePeriod: {
        Start: from.toISOString().split("T")[0],
        End: to.toISOString().split("T")[0],
      },
      GroupBy: [{ Type: "DIMENSION", Key: "SERVICE" }],
    }),
  );

  logger.info(
    `Received response ${JSON.stringify(currentCostAndUsage, null, 2)}`,
  );

  const costByService = currentCostAndUsage.ResultsByTime?.[0]?.Groups?.map(
    (service): ISpendingByService => ({
      amount: service.Metrics?.UnblendedCost?.Amount ?? "-1",
      service: service.Keys?.join(" ") ?? "unknown",
    }),
  );

  return costByService ?? [];
};

export const costExplorerClient: IPaymentClient = {
  getCurrentSpending,
  getForecast,
  getSpendingByService,
};
