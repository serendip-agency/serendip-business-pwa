export interface ReportFieldQueryInterface {
  method: "eq" | "neq" | "lt" | "lte" | "gt" | "gte" | "in" | "nin";
  label: string;
}

export interface ReportFieldInterface {
  name?: string;
  label?: string;
  template?: string;
  templateInputs?: any;
  templateInputsForm?: string;
  fieldQueries?: ReportFieldQueryInterface[];
}

export interface ReportInterface {
  reportName: string;
  reportEnityName: string;
  reportFields: ReportFieldInterface[];
}

export const ReportsSchema: ReportInterface[] = [
  {
    reportName: "company-default",
    reportEnityName: "company",

    reportFields: [
      {
        name: "_id",
        label: "شناسه سند",
        template: "ObjectidViewComponent",
        fieldQueries: [
          {
            method: "eq",
            label: "برابر باشد با"
          }
        ]
      },
      {
        name: "_cdate",
        label: "تاریخ ثبت",
        template: "DateViewComponent",
        templateInputsForm: "report-field-date",
        templateInputs: {
          format: "jYYYY/jMM/jDD HH:mm:ss"
        }
      },
      {
        name: "_vdate",
        label: "تاریخ ورژن",
        template: "DateViewComponent",
        templateInputs: {
          format: "jYYYY/jMM/jDD HH:mm:ss"
        }
      },
      {
        name: "name",
        label: "نام شرکت",
        template: "ShortTextViewComponent"
      },
      {
        name: "contacts",
        label: "اطلاعات تماس",
        template: "ContactsViewComponent"
      }
    ]
  }
];
