import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-form-quill-input',
  templateUrl: './form-quill-input.component.html',
  styleUrls: ['./form-quill-input.component.less']
})
export class FormQuillInputComponent implements OnInit {
  initial: string;

  constructor(private sanitizer: DomSanitizer) {


  }


  private _model = '';
  public get model() {
    return this._model;
  }
  @Input()

  public set model(value) {
    this.initial = this._model = value;
  }

  @Output() modelChange = new EventEmitter<string>();

  ngOnInit() {

    this.initial = this.model;
  }

}
