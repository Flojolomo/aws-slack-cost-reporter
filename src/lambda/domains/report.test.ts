import { Report } from "./report";

describe("unit: report", () => {
  describe("when generating & sending report", () => {
    const notifyMock = jest.fn();
    const getCurrentSpendingMock = jest.fn();
    const getForecastMock = jest.fn();

    const from = new Date(Date.parse("01 Jan 2025"));
    const to = new Date(Date.parse("31 Jan 2025"));

    const currentSpending = 1000;
    const forecast = 2000;

    beforeEach(async () => {
      jest.resetAllMocks();

      getCurrentSpendingMock.mockResolvedValueOnce(currentSpending);
      getForecastMock.mockResolvedValueOnce(forecast);

      const report = new Report(
        from,
        to,
        {
          notify: notifyMock,
        },
        {
          getCurrentSpending: getCurrentSpendingMock,
          getForecast: getForecastMock,
        },
      );

      await report.send();
    });

    it("reads current spending in given time interval", () => {
      expect(getCurrentSpendingMock).toHaveBeenCalledWith(from, to);
    });

    it("reads forcast until given date", () => {
      expect(getForecastMock).toHaveBeenCalledWith(to);
    });

    it("sends notification for given time interval", () => {
      expect(notifyMock).toHaveBeenCalledWith(
        expect.objectContaining({
          from,
          to,
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
});
