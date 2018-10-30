import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
@Component({
  selector: 'app-contact-input',
  templateUrl: './contact-input.component.html',
  styleUrls: ['./contact-input.component.css']
})
export class ContactInputComponent implements OnInit {

  SelectId = `cantact-${Math.random().toString().split('.')[1]}`;

  constructor() { }

  ngOnInit() {

  }

  inputsChange() {
    this.modelChange.emit(this.model);
  }

  @Output() modelChange = new EventEmitter<any>();

  private _model: any[];

  @Input() set model(value: any[]) {
    this._model = value;
  }

  get model(): any[] {
    return this._model;
  }

}
