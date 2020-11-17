export class DropDownItem {
  constructor(value: string, label: string) {
    this.value = value;
    this.label = label;
  }

  value: string;
  label: string;
}

export class RichDropDownItem {
  row: RowData;

  constructor(row: RowData) {
    this.row = row;
  }

  get keys(): string {
    return this.row.keys;
  }
  get colCount(): number {
    return this.row.colCount;
  }
  get visibleCols(): Cell[] {
    return this.row.visibleCols;
  }
  colValue(index: number): string {
    return this.row[index];
  }
}

export class Cell {
  constructor(value: string, isKey?: boolean, hidden?: boolean) {
    this.isKey = isKey;
    this.hidden = hidden;
    this.value = value;
  }

  isKey: boolean;
  hidden: boolean;
  value: string;
}

export class RowData {
  cols: Cell[];

  constructor(cols: Cell[]) {
    this.cols = cols;
  }

  get keys(): string {
    return this.cols
      ? this.cols
          .filter((x) => x.isKey)
          .map((x) => x.value)
          .join('/')
      : '';
  }
  get colCount(): number {
    return this.cols ? this.cols.length : 0;
  }
  get visibleCols(): Cell[] {
    return this.cols ? this.cols.filter((x) => !x.hidden) : [];
  }
}

export class RadioItem {
  checked: boolean;
  disabled: boolean;
  value: string;
  label: string;
}

export class ApiReq {
}

export class ApiRes {
  Error: string;
}

