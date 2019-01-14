import { ReportInterface } from "serendip-business-model";

export const ReportsSchema: ReportInterface[] = [
  {
    name: "primary",
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
    name: "dashboard-default",
    entityName: "dashboard",
    label: "",
    fields: [
      {
        enabled: true,
        name: "name",
        label: "نام داشبورد",
        template: "ShortTextViewComponent"
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
        template: "ShortTextViewComponent"
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
        template: "ShortTextViewComponent"
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
        name: "peoples",
        label: "افراد",
        templateInputs: { viewType: "json" },
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
    name: "service-type-default",
    entityName: "serviceType",
    label: "",
    fields: [
      {
        enabled: true,
        name: "name",
        label: "نام دسته بندی",
        template: "ShortTextViewComponent"
      },
      {
        enabled: true,
        name: "price",
        label: "قیمت",
        template: "PriceViewComponent"
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
        template: "ShortTextViewComponent"
      }
    ]
  },
  {
    name: "support-ticket-default",
    entityName: "supportTicket",
    label: "",
    fields: [
      {
        enabled: true,
        name: "name",
        label: "موضوع تیکت",
        template: "ShortTextViewComponent"
      }
    ]
  },
  {
    name: "complaint-default",
    entityName: "complaint",
    label: "",
    fields: [
      {
        enabled: true,
        name: "subject",
        label: "موضوع ",
        template: "ShortTextViewComponent"
      }
    ]
  },
  {
    name: "sale-default",
    entityName: "sale",
    label: "",
    fields: [
      {
        enabled: true,
        name: "subject",
        label: "موضوع ",
        template: "ShortTextViewComponent"
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
        template: "ShortTextViewComponent"
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
        template: "ShortTextViewComponent"
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
        template: "ShortTextViewComponent"
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
        template: "ShortTextViewComponent"
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
        template: "ShortTextViewComponent"
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
        template: "ShortTextViewComponent"
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
        template: "ShortTextViewComponent"
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
        template: "ShortTextViewComponent"
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
        name: "__fullName",
        label: "نام کامل",
        method: "joinFields",
        methodOptions: { fields: ["firstName", "lastName"], seperator: " " },
        queries: [],
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
