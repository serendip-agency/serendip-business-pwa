


import { Component, OnInit, ChangeDetectorRef, Input, EventEmitter, Output } from "@angular/core";
import { DataService } from "../../data.service";
import * as _ from 'underscore';
import { IdbService, Idb } from "../../idb.service";
import { tabInterface, widgetCommandInterface } from "src/app/models";

import { FormTextInputComponent } from "./form-text-input/form-text-input.component";
import { FormPriceInputComponent } from "./form-price-input/form-price-input.component";
import { FormMobileInputComponent } from "./form-mobile-input/form-mobile-input.component";
import { FormTelephoneInputComponent } from "./form-telephone-input/form-telephone-input.component";
import { FormCalendarInputComponent } from "./form-calendar-input/form-calendar-input.component";
import { FormCityInputComponent } from "./form-city-input/form-city-input.component";
import { FormCountryInputComponent } from "./form-country-input/form-country-input.component";
import { FormStateInputComponent } from "./form-state-input/form-state-input.component";
import { FormLatlngInputComponent } from "./form-latlng-input/form-latlng-input.component";
import { FormChipsInputComponent } from "./form-chips-input/form-chips-input.component";
import { FormSelectInputComponent } from "./form-select-input/form-select-input.component";
import { FormCheckboxInputComponent } from "./form-checkbox-input/form-checkbox-input.component";
import { FormRadioInputComponent } from "./form-radio-input/form-radio-input.component";
import { FormAutoCompleteInputComponent } from "./form-auto-complete-input/form-auto-complete-input.component";
import { FormToggleInputComponent } from "./form-toggle-input/form-toggle-input.component";
import { FormMultipleTextInputComponent } from "./form-multiple-text-input/form-multiple-text-input.component";
import { HttpClient } from "@angular/common/http";
import { FormsService } from "src/app/forms.service";
import { ContactInputComponent } from "src/app/crm/contact-input/contact-input.component";



@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.less']
})
export class FormComponent implements OnInit {
    predefinedForms: any;


    constructor(public dataService: DataService,
        public httpClient: HttpClient,
        public formsService: FormsService,
        public ref: ChangeDetectorRef,
        public idbService: IdbService) {

    }


    model: any = {};

    @Input() entityName: string;
    @Input() entityModelName: string;
    @Input() entityLabel: string;
    @Input() entityIcon: string = 'folder-archive-open';

    @Input() defaultModel: any = {};



    /**
     * unique identifier for this widget. using for state management
     */
    @Input() widgetId: string;
    @Input() documentId: string;
    @Input() tab: any;

    @Output() widgetIdChange = new EventEmitter<string>();
    @Output() widgetDataChange = new EventEmitter<any>();
    @Output() widgetCommand = new EventEmitter<widgetCommandInterface>();
    @Output() widgetTabChange = new EventEmitter<tabInterface>();


    @Input() parts: { formName?: string, propertyType?: string, componentName?: string, property: string, inputs?: {} }[];

    @Input() formName: string;


    stateDb: Idb;
    async save() {

        if (!this.model._id) {
            var insertResponse = await this.dataService.insert(this.entityName, this.model,this.entityModelName);
            this.documentId = insertResponse._id;
            this.model = insertResponse;
            this.widgetTabChange.emit({ title: 'ویرایش  ' + this.entityLabel + ' ' + this.model.name });
        } else
            this.dataService.update(this.entityName, this.model,this.entityModelName);


        var stateDb = await this.idbService.userIDB("state");
        var savedState = await stateDb.get(this.widgetId);

        if (savedState)
            stateDb.delete(this.widgetId);

    }

    reset() {
        if (this.defaultModel)
            this.model = _.clone(this.defaultModel);
        else
            this.model = {};

        this.ref.detectChanges();

    }

    async detectChange() {

        this.ref.detectChanges();

        this.widgetDataChange.emit(this.model);
        var stateKey: string = this.widgetId;
        if (!stateKey) {
            this.widgetId = stateKey = 'form' + '-' + Date.now() + '-' + Math.random().toString().split('.')[1];
            this.widgetIdChange.emit(this.widgetId);
            this.model._widgetId = this.widgetId;
        }
        await this.stateDb.set(stateKey, { id: stateKey, componentName: 'form', model: this.model, tab: this.tab });

    }
    trackByFn(index: any, item: any) { return index; }

    async ngOnInit() {

        //this.ref.detach();

        this.predefinedForms = await this.formsService.predefinedForms();


        if (this.formName) {
            this.parts = this.predefinedForms[this.formName].parts;
            this.defaultModel = this.predefinedForms[this.formName].defaultModel;
        }


        this.reset();

        this.stateDb = await this.idbService.userIDB("state");
        var savedState;

        try {
            savedState = await this.stateDb.get(this.widgetId);
        } catch (error) { }

        if (savedState)
            this.model = savedState.model;
        else
            if (this.documentId) {
                var model: any = await this.dataService.details(this.entityName, this.documentId);

                this.model = model;

                this.widgetTabChange.emit({ title: 'ویرایش  ' + this.entityLabel + ' ' + this.model.name })
            }

        this.ref.detectChanges();
    }


    private DynamicFormParts = {

        FormTextInputComponent,
        FormMultipleTextInputComponent,
        FormPriceInputComponent,
        FormMobileInputComponent,
        FormTelephoneInputComponent,
        FormCalendarInputComponent,
        FormCityInputComponent,
        FormCountryInputComponent,
        FormStateInputComponent,
        FormLatlngInputComponent,
        FormChipsInputComponent,
        FormSelectInputComponent,
        FormCheckboxInputComponent,
        FormRadioInputComponent,
        FormToggleInputComponent,
        FormAutoCompleteInputComponent,
        ContactInputComponent
    }



    getDynamicPart(componentName) {
        return this.DynamicFormParts[componentName];

    }

    extendObj(obj1, obj2) {
        return _.extend({}, obj1, obj2);
    }

    dynamicPartModelChange(property, subProperty, subModelIndex) {

        return (newSubModel) => {

            console.log(property, subModelIndex, subProperty, newSubModel);

            if (property && !subProperty)
                this.model[property] = newSubModel;

            if (property && subProperty)
                this.model[property][subModelIndex][subProperty] = newSubModel;


            this.detectChange();
        };

    }
}
