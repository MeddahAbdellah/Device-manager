import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'dm-input',
  templateUrl: './dm-input.component.html',
  styleUrls: ['./dm-input.component.scss']
})
export class DmInputComponent implements OnInit {
  @Input() title: string;
  @Input() type: string;
  @Input() value: string;
  @Output() valueChange = new EventEmitter<string>();
  public ngOnInit() {
  }
}
