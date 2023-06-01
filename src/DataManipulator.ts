import { ServerRespond } from './DataStreamer';
import { TableData } from '@finos/perspective';

export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]): TableData[] {
    const priceABC = (serverResponds[0].top_ask.price + serverResponds[0].top_bid.price) / 2;
    const priceDEF = (serverResponds[1].top_ask.price + serverResponds[1].top_bid.price) / 2;
    const ratio = (priceABC / priceDEF).toString();
    const upper_bound = 1.05;
    const lower_bound = 0.95;
    let trigger_alert: string | undefined;

    if (parseFloat(ratio) > upper_bound || parseFloat(ratio) < lower_bound) {
      trigger_alert = parseFloat(ratio).toString();
    }

    const timestamp = serverResponds[0].timestamp > serverResponds[1].timestamp ? serverResponds[0].timestamp : serverResponds[1].timestamp;

    return [
      {
        stock: 'pair',
        ratio,
        lower_bound: lower_bound.toString(),
        upper_bound: upper_bound.toString(),
        trigger_alert: trigger_alert !== undefined ? trigger_alert.toString() : '',
        timestamp: timestamp.toISOString(),
        price_abc: priceABC.toString(),
        price_def: priceDEF.toString(),
      },
    ];
  }
}
