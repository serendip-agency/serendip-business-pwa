import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../data.service';
import { InsertMessage } from '../messaging/InsertMessage';
import { MessagingService } from '../messaging.service';

@Component({
  selector: 'app-people-form',
  templateUrl: './people-form.component.html',
  styleUrls: ['./people-form.component.css']
})
export class PeopleFormComponent implements OnInit {


  peopleForm: FormGroup;


  rpd(input) {
    if (!input)
      input = '';
    var convert = (a) => {
      return ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'][a];
    }
    return input.toString().replace(/\d/g, convert);
  }

  constructor(private messagingService: MessagingService, private fb: FormBuilder, private dataService: DataService) {

  }

  model: any = {
    socials: [],
    emails: []
  };

  save() {


    if (!this.peopleForm.value._id)
      this.dataService.insert('people', this.peopleForm.value)
    else
      this.dataService.update('people', this.peopleForm.value)
  }

  reset() {
    this.peopleForm.reset();
  }



  ngOnInit() {

    this.peopleForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: [''],
      address: this.fb.group({
        street: [''],
        city: [''],
        state: [''],
        zip: ['']
      }),
      mobiles: this.fb.array([
        this.fb.group({
          type: [''],
          value: ['']
        })
      ]),
      emails: this.fb.array([
        this.fb.control('')
      ]),
      socials: this.fb.array([
        this.fb.group({
          type: [''],
          value: ['']
        })
      ])
    });


    this.peopleForm.valueChanges.subscribe((data) => {
    });

  }

  addMobile() {
    (this.peopleForm.controls.mobiles as FormArray).push(this.fb.group({
      type: [''],
      value: ['']
    }));
  }

  removeMobile(index: number) {
    (this.peopleForm.controls.mobiles as FormArray).removeAt(index);
  }

  addSocial() {
    (this.peopleForm.controls.socials as FormArray).push(this.fb.group({
      type: [''],
      value: ['']
    }));
  }

  removeSocial(index: number) {
    (this.peopleForm.controls.socials as FormArray).removeAt(index);
  }


}
