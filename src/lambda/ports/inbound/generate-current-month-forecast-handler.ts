import { EventBridgeHandler } from "aws-lambda";
import { generateCurrentMonthForecastUseCase } from "../../adapters/generate-current-month-forecast-use-case";
import { logger } from "../../utils/logger";

export const handler = async (event, context) => {
  logger.addContext(context);
  logger.logEventIfEnabled(event);

  await generateCurrentMonthForecastUseCase(process.env.TOPIC_ARN!);
};
