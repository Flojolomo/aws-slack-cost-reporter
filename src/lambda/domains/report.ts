export interface INotification {
  title: string;
  description: string;
}

export interface INotificationClient {
  notify(notification: INotification): Promise<void>;
}

export interface ISpendingByService {
  service: string;
  amount: number;
}

export interface IPaymentClient {
  getCurrentSpending(from: Date, to: Date): Promise<number | undefined>;
  getForecast(to: Date): Promise<number | undefined>;
  getSpendingByService(
    from: Date,
    to: Date,
  ): Promise<Array<ISpendingByService>>;
}

export class Report {
  private readonly enableServiceLevelReports: boolean;
  private readonly from: Date;
  private readonly to: Date;

  private readonly notificationClient: INotificationClient;
  private readonly paymentClient: IPaymentClient;
  private readonly organizationIdentifier?: string;

  public constructor(props: {
    readonly from: Date;
    readonly notificationClient: INotificationClient;
    readonly organizationIdentifier?: string;
    readonly paymentClient: IPaymentClient;
    readonly to: Date;
    readonly enableServiceLevelReports?: boolean;
  }) {
    this.from = props.from;
    this.to = props.to;

    this.enableServiceLevelReports = props.enableServiceLevelReports ?? false;

    this.notificationClient = props.notificationClient;
    this.organizationIdentifier = props.organizationIdentifier;
    this.paymentClient = props.paymentClient;
  }

  public async send(): Promise<void> {
    const forecast = await this.paymentClient.getForecast(this.to);
    const currentSpending = await this.paymentClient.getCurrentSpending(
      this.from,
      this.to,
    );

    const title = this.organizationIdentifier
      ? `[${this.organizationIdentifier}] Current Cost and Forecast`
      : "Current Cost and Forecast";

    const lines = [
      `\n:warning: Cost estimate from ${this.from} to ${this.to}`,
      `*Current Cost* ${this.formatNumber(currentSpending)}`,
      `*Forecast* ${this.formatNumber(forecast)}`,
    ];

    if (this.enableServiceLevelReports) {
      lines.push(...(await this.buildServiceReport()));
    }

    await this.notificationClient.notify({
      title,
      description: lines.join("\n"),
    });
  }

  private async buildServiceReport(): Promise<Array<string>> {
    const spendingByServices = await this.paymentClient.getSpendingByService(
      this.from,
      this.to,
    );

    const serviceTitle = "Service";
    const spendingTitle = "Spending (USD)";

    const header = `\n${spendingTitle} ${serviceTitle}`;

    return [
      header,
      ...spendingByServices.map(
        ({ service, amount }) => `${amount} ${service}`,
      ),
    ];
  }

  private formatNumber(amount: number | undefined): string {
    if (!amount || Number.isNaN(amount)) {
      return "-1";
    }

    return String((Math.round(Number(amount) * 100) / 100).toFixed(2));
  }
}
