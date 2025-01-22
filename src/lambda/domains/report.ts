export interface INotification {
  title: string;
  description: string;
}

export interface INotificationClient {
  notify(notification: INotification): Promise<void>;
}

export interface ISpendingByService {
  service: string;
  amount: string;
}

export interface IPaymentClient {
  getCurrentSpending(from: Date, to: Date): Promise<number>;
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
      `*Current Cost* ${currentSpending}`,
      `*Forecast* ${forecast}`,
    ];

    if (this.enableServiceLevelReports) {
      const spendingByServices = await this.paymentClient.getSpendingByService(
        this.from,
        this.to,
      );

      lines.push(
        "\n| Service | Spending (USD) |",
        "|:---|:---|",
        ...spendingByServices.map(
          ({ service, amount }) => `| ${service} | ${amount} |`,
        ),
      );
    }

    await this.notificationClient.notify({
      title,
      description: lines.join("\n"),
    });
  }
}
