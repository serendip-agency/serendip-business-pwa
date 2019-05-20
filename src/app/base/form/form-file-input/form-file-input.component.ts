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

    if (this.type == 'multiple') {
      if (this.model.length > 0) {
        this.storageService.fileManagerFolderPath = this.model[0]
          .split('/').splice(0, this.model[0].split('/').length - 1).join('/')
      }
    } else {
      if (this.model) {
        this.storageService.fileManagerFolderPath = this.model
          .split('/').splice(0, this.model.split('/').length - 1).join('/')
      }

    }

    this.storageService.fileManagerSelectedPaths = this.type == 'multiple' ? this.model : [this.model];

    
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
