import { ReportInterface } from "serendip-business-model";

export const ReportsSchema: ReportInterface[] = [

  {
    name: "company-default",
    entityName: "company",
    label: "",
    fields: [
      {
        enabled: true,
        name: "_id",
        label: "شناسه سند",
        template: "ObjectidViewComponent",
        queries: [{ label: "برابر باشد با", method: "eq" }]
      },
      {
        enabled: true,
        name: "_cdate",
        label: "تاریخ ثبت",
        template: "DateViewComponent",
        templateInputsForm: "report-field-date",
        templateInputs: {
          format: "jYYYY/jMM/jDD HH:mm:ss"
        }
      },
      {
        enabled: true,
        name: "_vdate",
        label: "تاریخ ورژن",
        template: "DateViewComponent",
        templateInputs: {
          format: "jYYYY/jMM/jDD HH:mm:ss"
        }
      },
      {
        enabled: true,
        name: "name",
        label: "نام شرکت",
        template: "ShortTextViewComponent"
      },
      {
        enabled: true,
        name: "contacts",
        label: "اطلاعات تماس",
        template: "ContactsViewComponent"
      }
    ]
  }
];
