import { ReportInterface } from "serendip-business-model";

export const ReportsSchema: ReportInterface[] = [
  {
    name: "primary",
    fields: [
      {
        enabled: true,
        name: "_id",
        label: "شناسه سند",
        template: { component: "ObjectidViewComponent" },
        queries: [
          {
            label: "برابر باشد با",
            method: "eq",
            methodInputForm: "report-sync-field-query-eq"
          },
          {
            label: "برابر نباشد با",
            method: "neq",
            methodInputForm: "report-sync-field-query-eq"
          }
        ]
      },
      {
        enabled: true,
        name: "_cdate",
        label: "تاریخ ثبت",
        template: {
          component: "DateViewComponent",
          inputs: {
            format: "jYYYY/jMM/jDD HH:mm:ss"
          },
          formName: "report-async-field-format-date"
        },
        queries: [
          {
            label: "در این بازه زمانی باشد",
            method: "range",
            methodInputForm: "report-sync-field-query-range"
          },
          {
            label: "در این بازه زمانی نباشد",
            method: "range",
            methodInputForm: "report-sync-field-query-range"
          }
        ]
      },
      {
        enabled: true,
        name: "_vdate",
        label: "آخرین تغییر",
        template: {
          component: "DateViewComponent",
          inputs: {
            format: "jYYYY/jMM/jDD HH:mm:ss"
          },
          formName: "report-async-field-format-date"
        },
        queries: [
          {
            label: "در این بازه زمانی باشد",
            method: "range",
            methodInputForm: "report-sync-field-query-range"
          },
          {
            label: "در این بازه زمانی نباشد",
            method: "range",
            methodInputForm: "report-sync-field-query-range"
          }
        ]
      }
    ]
  },
  {
    name: "dashboard-default",
    entityName: "dashboard",
    label: "",
    fields: [
      {
        enabled: true,
        name: "name",
        label: "نام",
        template: { component: "ShortTextViewComponent" }
      },
      {
        enabled: true,
        name: "title",
        label: "عنوان  ",
        template: { component: "ShortTextViewComponent" }
      }
    ]
  },
  {
    name: "report-default",
    entityName: "report",
    label: "",
    fields: [
      {
        enabled: true,
        name: "name",
        label: "نام گزارش",
        template: { component: "ShortTextViewComponent" }
      }
    ]
  },
  {
    name: "form-default",
    entityName: "form",
    label: "",
    fields: [
      {
        enabled: true,
        name: "name",
        label: "نام فرم",
        template: { component: "ShortTextViewComponent" }
      }
    ]
  },
  {
    name: "email-default",
    entityName: "email",
    label: "",
    fields: [
      {
        enabled: true,
        name: "subject",
        label: "موضوع ",
        template: { component: "ShortTextViewComponent" }
      }
    ]
  },
  {
    name: "sms-default",
    entityName: "sms",
    label: "",
    fields: [
      {
        enabled: true,
        name: "body",
        label: "متن ",
        template: { component: "ShortTextViewComponent" }
      }
    ]
  },
  {
    name: "fax-default",
    entityName: "fax",
    label: "",
    fields: [
      {
        enabled: true,
        name: "pages",
        label: "صفحات ",
        template: { component: "ShortTextViewComponent" }
      }
    ]
  },
  {
    name: "support-invoice-default",
    entityName: "supportInvoice",
    label: "",
    fields: [
      {
        enabled: true,
        name: "subject",
        label: "عنوان فاکتور",
        template: { component: "ShortTextViewComponent" }
      }
    ]
  },
  {
    name: "company-relation-type-default",
    entityName: "companyRelationType",
    label: "",
    fields: [
      {
        enabled: true,
        name: "name",
        label: "نام نوع ارتباط",
        template: { component: "ShortTextViewComponent" }
      }
    ]
  },
  {
    name: "people-relation-type-default",
    entityName: "peopleRelationType",
    label: "",
    fields: [
      {
        enabled: true,
        name: "name",
        label: "نام نوع ارتباط",
        template: { component: "ShortTextViewComponent" }
      }
    ]
  },
  {
    name: "job-title-default",
    entityName: "jobTitle",
    label: "",
    fields: [
      {
        enabled: true,
        name: "name",
        label: "نام عنوان شعلی",
        template: { component: "ShortTextViewComponent" }
      }
    ]
  },
  {
    name: "job-title-default",
    entityName: "jobTitle",
    label: "",
    fields: [
      {
        enabled: true,
        name: "name",
        label: "نام عنوان شعلی",
        template: { component: "ShortTextViewComponent" }
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
        template: {
          inputs: {
            replace: {
              male: "آقا",
              female: "خانم"
            }
          },
          component: "ShortTextViewComponent"
        }
      },
      {
        enabled: true,
        name: "firstName",
        label: "نام ",
        template: { component: "ShortTextViewComponent" }
      },
      {
        enabled: true,
        name: "lastName",
        label: "نام خانوادگی",
        template: { component: "ShortTextViewComponent" }
      },
      {
        enabled: true,
        name: "__fullName",
        label: "نام کامل",
        method: "joinFields",
        methodOptions: { fields: ["firstName", "lastName"], seperator: " " },
        queries: [],
        template: { component: "ShortTextViewComponent" }
      },
      {
        enabled: true,
        name: "mobiles",
        label: "موبایل",
        template: { component: "ShortTextViewComponent" }
      },
      {
        enabled: false,
        name: "emails",
        label: "ایمیل",
        template: { component: "ShortTextViewComponent" }
      },
      {
        enabled: false,
        name: "contacts",
        label: "اطلاعات تماس",
        template: { component: "ContactsViewComponent" }
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
