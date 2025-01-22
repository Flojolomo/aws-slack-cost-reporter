import { Report } from "./report";

describe("unit: report", () => {
  const notifyMock = jest.fn();
  const getCurrentSpendingMock = jest.fn();
  const getForecastMock = jest.fn();
  const getSpendingByServiceMock = jest.fn();

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
          getSpendingByService: getSpendingByServiceMock,
        },
      });

      await report.send();
    });

    it("reads current spending in given time interval", () => {
      expect(getCurrentSpendingMock).toHaveBeenCalledWith(from, to);
    });

    it("reads forecast until given date", () => {
      expect(getForecastMock).toHaveBeenCalledWith(to);
    });

    it("does not read spending grouped by service", () => {
      expect(getSpendingByServiceMock).not.toHaveBeenCalled();
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
          description: expect.stringContaining(
            `Cost estimate from ${from} to ${to}`,
          ),
        }),
      );
    });

    it("sends notification for read spending & forecast", () => {
      expect(notifyMock).toHaveBeenCalledWith(
        expect.objectContaining({
          description: expect.stringContaining(String(currentSpending)),
        }),
      );

      expect(notifyMock).toHaveBeenCalledWith(
        expect.objectContaining({
          description: expect.stringContaining(String(forecast)),
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
          getSpendingByService: getSpendingByServiceMock,
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

  describe("when service level reports are enabled", () => {
    beforeEach(async () => {
      getSpendingByServiceMock.mockResolvedValueOnce([
        { service: "S3", amount: 14 },
        { service: "CodeBuild", amount: 2 },
      ]);

      const report = new Report({
        from,
        to,
        enableServiceLevelReports: true,
        notificationClient: {
          notify: notifyMock,
        },
        paymentClient: {
          getCurrentSpending: getCurrentSpendingMock,
          getForecast: getForecastMock,
          getSpendingByService: getSpendingByServiceMock,
        },
      });

      await report.send();
    });

    it("read spending grouped by services", () => {
      expect(getSpendingByServiceMock).toHaveBeenCalledWith(from, to);
    });

    it("formats spending of services in a table to be sent out to notification", () => {
      expect(notifyMock).toHaveBeenCalledWith(
        expect.objectContaining({
          description: expect.stringContaining(
            `
| Service | Spending (USD) |
|:---|:---|
| S3 | 14 |
| CodeBuild | 2 |`,
          ),
        }),
      );
    });
  });
});
