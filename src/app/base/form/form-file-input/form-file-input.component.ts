import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { StorageService } from 'src/app/storage.service';

@Component({
  selector: "app-form-file-input",
  templateUrl: "./form-file-input.component.html",
  styleUrls: ["./form-file-input.component.less"]
})
export class FormFileInputComponent implements OnInit {

  @Input() model;
  @Input() type = 'multiple';

  @Output() modelChange = new EventEmitter();
  constructor(public storageService: StorageService) {



  }


  selectFiles() {
    this.storageService.fileManagerSelecting = this.type;
    this.storageService.fileManagerVisible = true;

    var selectSubscribe = this.storageService.fileManagerSelectEvent.subscribe((paths) => {

      this.modelChange.emit(this.type == 'multiple' ? paths : (paths[0] || ''));
      this.storageService.fileManagerSelecting = null;
      this.storageService.fileManagerVisible = false;
      selectSubscribe.unsubscribe();

    });
  }
  @Input() label: string;

  ngOnInit() { }
}
