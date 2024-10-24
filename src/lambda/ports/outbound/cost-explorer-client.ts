import {
  CostExplorerClient,
  GetCostAndUsageCommand,
  GetCostForecastCommand,
} from "@aws-sdk/client-cost-explorer";
import { PaymentClient } from "../../domains/report";
import { Logger } from "@aws-lambda-powertools/logger";

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

const getForecast = async (to: Date): Promise<number> => {
  const today = new Date();
  logger.info(`Requesting forecast from ${today} to ${to}`);
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
};

export const costExplorerClient: PaymentClient = {
  getCurrentSpending,
  getForecast,
};
