import { Report } from "./report";

describe("unit: report", () => {
  const notifyMock = jest.fn();
  const getCurrentSpendingMock = jest.fn();
  const getForecastMock = jest.fn();

  const from = new Date(Date.parse("01 Jan 2025"));
  const to = new Date(Date.parse("31 Jan 2025"));

  const currentSpending = 1000;
  const forecast = 2000;

  beforeEach(() => {
    jest.resetAllMocks();

    getCurrentSpendingMock.mockResolvedValueOnce(currentSpending);
    getForecastMock.mockResolvedValueOnce(forecast);
  });

  describe("when generating & sending report", () => {
    beforeEach(async () => {
      const report = new Report({
        from,
        to,
        notificationClient: {
          notify: notifyMock,
        },
        paymentClient: {
          getCurrentSpending: getCurrentSpendingMock,
          getForecast: getForecastMock,
        },
      });

      await report.send();
    });

    it("reads current spending in given time interval", () => {
      expect(getCurrentSpendingMock).toHaveBeenCalledWith(from, to);
    });

    it("reads forcast until given date", () => {
      expect(getForecastMock).toHaveBeenCalledWith(to);
    });

    it("sends notification with title", () => {
      expect(notifyMock).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Current Cost and Forecast",
        }),
      );
    });

    it("sends notification with message defining the time interval", () => {
      expect(notifyMock).toHaveBeenCalledWith(
        expect.objectContaining({
          message: `Cost estimate from ${from} to ${to}`,
        }),
      );
    });

    it("sends notification for read spending & forecast", () => {
      expect(notifyMock).toHaveBeenCalledWith(
        expect.objectContaining({
          currentSpending,
          forecast,
        }),
      );
    });
  });

  describe("when organization identifier is given", () => {
    it("calls sends notification with organization identifier in title", async () => {
      const organizationIdentifier = "AWS Organization";
      const report = new Report({
        from,
        to,
        notificationClient: {
          notify: notifyMock,
        },
        paymentClient: {
          getCurrentSpending: getCurrentSpendingMock,
          getForecast: getForecastMock,
        },
        organizationIdentifier,
      });

      await report.send();

      expect(notifyMock).toHaveBeenCalledWith(
        expect.objectContaining({
          title: `[${organizationIdentifier}] Current Cost and Forecast`,
        }),
      );
    });
  });
});
