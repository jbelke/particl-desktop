import { Amount } from '../../shared/util/utils';

export type TransactionCategory = 'all' | 'stake' | 'coinbase' | 'send' | 'receive' | 'orphaned_stake' | 'internal_transfer';

export class Transaction {

  type: string;

    txid: string;
    address:string ;
    stealth_address: string;
    label: string;
    category: string;
    amount: number;
    reward: number;
    fee: number;
    time: number;
    comment: string;

    ouputs: any[];

    /* conflicting txs */
    walletconflicts: any[];

    /* block info */
    blockhash: string;
    blockindex: number;
    blocktime: number;
    confirmations: number;

  constructor(json: any) {
    console.log("tx model constructed");
    /* transactions */
    this.txid = json.txid;
    if(json.outputs !== undefined) {
      this.address = json.outputs[0].address;
      this.stealth_address = json.outputs[0].stealth_address;
      this.label = json.outputs[0].label;
    }
    this.category = json.category;
    this.amount = json.amount;
    this.reward = json.reward;
    this.fee = json.fee;
    this.time = json.time;
    this.comment = json.comment;

    this.ouputs = json.outputs;

    /* conflicting txs */
    this.walletconflicts = json.walletconflicts;

    /* block info */
    this.blockhash = json.blockhash;
    this.blockindex = json.blockindex;
    this.blocktime = json.blocktime;
    this.confirmations = json.confirmations;
  }

  public getAddress(): string {
    if (this.stealth_address === undefined) {
      return this.address;
    }
    return this.stealth_address;
  }


  public getExpandedTransactionID(): string {
    return this.txid + this.getAmountObject().getAmount() + this.category;
  }


  public getConfirmationCount(confirmations: number): string {
    if (this.confirmations > 12) {
      return '12+';
    }
    return this.confirmations.toString();
  }


  /* Amount stuff */
  /** Turns amount into an Amount Object */
  public getAmountObject(): Amount {
    if (this.category === 'stake') {
      return new Amount(+this.reward);
    } else {
      return new Amount(+this.amount);
    }
  }

  /** Calculates the actual amount that was transfered, including the fee */
  /* todo: fee is not defined in normal receive tx, wut? */
  public getNetAmount(): number {
    const amount: number = +this.getAmountObject().getAmount();

    /* If fee undefined then just return amount */
    if (this.fee === undefined) {
      return amount;
    /* sent */
    } else if (amount < 0) {
      return new Amount(+amount + (+this.fee)).getAmount();
    } else {
      return new Amount(+amount - (+this.fee)).getAmount();
    }
  }



  /* Date stuff */
  public getDate(): string {
    return this.dateFormatter(new Date(this.time * 1000));
  }

  private dateFormatter(d: Date) {
    return (
      d.getDate() < 10 ? '0' + d.getDate() : d.getDate()) + '-' +
      ((d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)) + '-' +
      (d.getFullYear() < 10 ? '0' + d.getFullYear() : d.getFullYear()) + ' ' +
      (d.getHours() < 10 ? '0' + d.getHours() : d.getHours()) + ':' +
      (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()) + ':' +
      (d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds()
    );
  }


}


