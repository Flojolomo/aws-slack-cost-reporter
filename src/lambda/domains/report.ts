export interface INotification {
  title: string;
  message: string;
  currentSpending: number;
  forecast: number;
}

export interface INotificationClient {
  notify(notification: INotification): Promise<void>;
}

export interface IPaymentClient {
  getCurrentSpending(from: Date, to: Date): Promise<number>;
  getForecast(to: Date): Promise<number | undefined>;
}

export class Report {
  private readonly from: Date;
  private readonly to: Date;
  private readonly notificationClient: INotificationClient;
  private readonly paymentClient: IPaymentClient;
  private readonly organizationIdentifier?: string;

  private forecast: {
    currentSpending: number;
    forecast: number;
  } = { currentSpending: 0, forecast: 0 };

  public constructor(props: {
    readonly from: Date;
    readonly to: Date;
    readonly notificationClient: INotificationClient;
    readonly paymentClient: IPaymentClient;
    readonly organizationIdentifier?: string;
  }) {
    this.from = props.from;
    this.to = props.to;
    this.notificationClient = props.notificationClient;
    this.paymentClient = props.paymentClient;
    this.organizationIdentifier = props.organizationIdentifier;
  }

  public async send(): Promise<void> {
    await this.generate();

    const title = this.organizationIdentifier
      ? `[${this.organizationIdentifier}] Current Cost and Forecast`
      : "Current Cost and Forecast";

    await this.notificationClient.notify({
      title,
      message: `Cost estimate from ${this.from} to ${this.to}`,
      ...this.forecast,
    });
  }

  private async generate(): Promise<void> {
    const forecast = await this.paymentClient.getForecast(this.to);
    const currentSpending = await this.paymentClient.getCurrentSpending(
      this.from,
      this.to,
    );
    this.forecast = {
      currentSpending,
      forecast: forecast ?? -1,
    };
  }
}
