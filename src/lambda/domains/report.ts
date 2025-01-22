export interface NotificationClient {
  notify(payload: {
    from: Date;
    to: Date;
    currentSpending: number;
    forecast: number;
  }): Promise<void>;
}

export interface PaymentClient {
  getCurrentSpending(from: Date, to: Date): Promise<number>;
  getForecast(to: Date): Promise<number>;
}

export class Report {
  private readonly from: Date;
  private readonly to: Date;
  private readonly notificationClient: NotificationClient;
  private readonly paymentClient: PaymentClient;
  private forecast: {
    currentSpending: number;
    forecast: number;
  } = { currentSpending: 0, forecast: 0 };

  public constructor(props: {
    readonly from: Date;
    readonly to: Date;
    readonly notificationClient: NotificationClient;
    readonly paymentClient: PaymentClient;
  }) {
    this.from = props.from;
    this.to = props.to;
    this.notificationClient = props.notificationClient;
    this.paymentClient = props.paymentClient;
  }

  public async send(): Promise<void> {
    await this.generate();
    await this.notificationClient.notify({
      from: this.from,
      to: this.to,
      ...this.forecast,
    });
  }

  private async generate(): Promise<void> {
    this.forecast = {
      currentSpending: await this.paymentClient.getCurrentSpending(
        this.from,
        this.to,
      ),
      forecast: await this.paymentClient.getForecast(this.to),
    };
  }
}
