import { ReportInterface } from "serendip-business-model";

export const ReportsSchema: ReportInterface[] = [
  {
    name: "common",
    fields: [
      {
        enabled: true,
        name: "_id",
        label: "شناسه سند",
        template: "ObjectidViewComponent",
        queries: [
          {
            label: "برابر باشد با",
            method: "eq",
            methodInputForm: "report-query-eq"
          },
          {
            label: "برابر نباشد با",
            method: "neq",
            methodInputForm: "report-query-eq"
          }
        ]
      },
      {
        enabled: false,
        name: "_cdate",
        label: "تاریخ ثبت",
        template: "DateViewComponent",
        templateInputsForm: "report-field-date",
        templateInputs: {
          format: "jYYYY/jMM/jDD HH:mm:ss"
        },
        queries: [
          {
            label: "در این بازه زمانی باشد",
            method: "range",
            methodInputForm: "report-query-eq"
          },
          {
            label: "در این بازه زمانی نباشد",
            method: "range",
            methodInputForm: "report-query-eq"
          }
        ]
      },
      {
        enabled: false,
        name: "_vdate",
        label: "تاریخ ورژن",
        template: "DateViewComponent",
        templateInputs: {
          format: "jYYYY/jMM/jDD HH:mm:ss"
        }
      }
    ]
  },
  {
    name: "company-default",
    entityName: "company",
    label: "",
    fields: [
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
  },
  {
    name: "people-default",
    entityName: "people",
    label: "",
    fields: [
      {
        enabled: true,
        name: "gender",
        label: "جنسیت",
        template: "ShortTextViewComponent",
        templateInputs: {
          replace: {
            male: "آقا",
            female: "خانم"
          }
        }
      },
      {
        enabled: true,
        name: "firstName",
        label: "نام ",
        template: "ShortTextViewComponent"
      },
      {
        enabled: true,
        name: "lastName",
        label: "نام خانوادگی",
        template: "ShortTextViewComponent"
      },
      {
        enabled: true,
        name: "mobiles",
        label: "موبایل",
        template: "ShortTextViewComponent"
      },
      {
        enabled: false,
        name: "emails",
        label: "ایمیل",
        template: "ShortTextViewComponent"
      },
      {
        enabled: false,
        name: "contacts",
        label: "اطلاعات تماس",
        template: "ContactsViewComponent"
      }
    ]
  },
  {
    name: "service-default",
    entityName: "service",
    label: "",
    fields: []
  }
];
