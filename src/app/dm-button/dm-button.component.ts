import { Component, Input, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'dm-button',
  templateUrl: './dm-button.component.html',
  styleUrls: ['./dm-button.component.scss']
})
export class DmButtonComponent implements OnInit {
  @Input() text: string;
  @Input() customClass: string;
  constructor() { }

  ngOnInit() {
  }
}
