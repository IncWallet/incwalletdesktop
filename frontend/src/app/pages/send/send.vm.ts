import { RichDropDownItem, Cell, RowData } from '../../api-clients/_index';
import { Observable, of } from 'rxjs';

export class SendViewModel {
  constructor() {
    this.autoTokens$ = of([]);
    this.rawTokens = new Array();
  }

  toAddress: string;
  selectedToken: string;
  amount: number;
  fee: number;
  memo: string;

  rawTokens: any[];
  autoTokens$: Observable<RichDropDownItem[]>;
}

export class SendViewModelResolver {

  static prepData(model: SendViewModel): void {
    this.prepTokens(model);
  }

  static prepTokens(model: SendViewModel): void {
    if (model.rawTokens) {
      const dropDownItems = new Array();
      model.rawTokens.forEach(token => {
        dropDownItems.push(new RowData([
          new Cell(token.TokenID, true, true),
          new Cell(token.TokenName),
          new Cell(token.TokenSymbol),
        ]));
      });

      model.autoTokens$ = of(dropDownItems);
    }
  }

  static filterToken(searchVal: string, model: SendViewModel): Observable<RichDropDownItem[]> {
    const searchStr = searchVal.toLowerCase();
    const dropdownItems = model.rawTokens
      .filter((option) =>
      (`${option.TokenID} ${option.TokenName} ${option.TokenSymbol} ${option.Amount}`).toLowerCase().includes(searchStr))
      .map((x) => new RichDropDownItem(new RowData([
        new Cell(x.TokenID, true, true),
        new Cell(x.TokenName),
        new Cell(x.TokenSymbol),
      ])));

    return of(dropdownItems);
  }

  static clear(model: SendViewModel) {
    model.toAddress = '';
    model.selectedToken = '';
    model.amount = null;
    model.fee = null;
    model.memo = '';
  }
}
