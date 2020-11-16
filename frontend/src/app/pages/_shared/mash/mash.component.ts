import {Component, Input, OnInit} from '@angular/core';
import {SharedService} from "../../../infrastructure/service/shared.service";

@Component({
  selector: 'ngx-mash',
  templateUrl: './mash.component.html',
  styleUrls: ['./mash.component.scss']
})
export class MashComponent implements OnInit {

  @Input() value: any;
  @Input() rowData: any;

  constructor(
    private sharedService: SharedService,
  ) { }

  isHideDataMash: boolean = this.sharedService.hideDataMash;

  ngOnInit(): void {
  }

  toggleMash() {
    this.sharedService.toggleDataMash();
  }

}
