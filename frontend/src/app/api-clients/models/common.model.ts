export class PagedList<T> {
  rowsCount: number;
  data: T[];
}

export class DropDownItem {
  constructor(value: string, label: string) {
    this.value = value;
    this.label = label;
  }

  value: string;
  label: string;
}

export class RadioItem {
  checked: boolean;
  disabled: boolean;
  value: string;
  label: string;
}

export class ApiRes {
  error: string;
}
