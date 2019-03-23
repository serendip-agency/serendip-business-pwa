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
      },
      {
        enabled: true,
        name: "_cuser",
        label: "ثبت‌کننده",
        analytical: true,
        template: { component: "ShortTextViewComponent" }
      },
      {
        enabled: true,
        name: "_vuser",
        analytical: true,
        link: "_user",
        label: "آخرین تغییر‌دهنده",
        template: { component: "ShortTextViewComponent" }
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
    name: "grid-default",
    entityName: "grid",
    label: "",
    fields: []
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
        template: { component: "LongTextViewComponent" }
      },
      {
        enabled: true,
        name: "label",
        label: "لیبل گزارش",
        template: { component: "ShortTextViewComponent" }
      },
      {
        enabled: true,
        name: "offline",
        label: "آفلاین",
        template: { component: "ShortTextViewComponent" }
      },
      {
        enabled: true,
        name: "entityName",
        label: "نام شی",
        template: { component: "ShortTextViewComponent" }
      }
    ]
  },
  {
    name: "entity-default",
    entityName: "entity",
    label: "",
    fields: [
      {
        enabled: true,
        name: "name",
        label: "نام شی",
        template: { component: "ShortTextViewComponent" }
      },
      {
        enabled: true,
        name: "access",
        label: "دسترسی",
        template: { component: "ShortTextViewComponent" }
      },
      {
        enabled: true,
        name: "icon",
        label: "آیکون",
        template: { component: "IconViewComponent" }
      }
    ]
  },
  {
    name: "trigger-default",
    entityName: "trigger",
    label: "",
    fields: [
      {
        enabled: true,
        name: "name",
        label: "نام تریگر",
        template: { component: "ShortTextViewComponent" }
      },
      {
        enabled: true,
        name: "entity",
        label: "نام شی",
        template: { component: "ShortTextViewComponent" }
      }
    ]
  },
  {
    name: "format-default",
    entityName: "format",
    label: "",
    fields: [
      {
        enabled: true,
        name: "label",
        label: "عنوان نتیجه‌گیری",
        template: { component: "LongTextViewComponent" }
      },
      {
        enabled: true,
        name: "entityName",
        label: "نام شی",
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
    name: "mail-default",
    entityName: "mail",
    label: "",
    fields: [
      {
        enabled: true,
        name: "from",
        label: "فرستنده ",
        template: { component: "LongTextViewComponent" }
      },
      {
        enabled: true,
        name: "to",
        label: "گیرنده ",
        template: { component: "LongTextViewComponent" }
      },
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
        name: "to",
        label: "گیرنده ",
        template: { component: "ShortTextViewComponent" }
      },
      {
        enabled: true,
        name: "message",
        label: "متن ",
        template: { component: "LongTextViewComponent" }
      }
    ]
  },
  {
    name: "telegram-user-default",
    entityName: "telegramUser",
    label: "",
    fields: [
      {
        enabled: true,
        name: "first_name",
        label: "نام ",
        template: { component: "ShortTextViewComponent" }
      },
      {
        enabled: true,
        name: "last_name",
        label: "نام خانوادگی ",
        template: { component: "ShortTextViewComponent" }
      },
      ,
      {
        enabled: true,
        name: "username",
        label: "شناسه کاربری ",
        template: { component: "ShortTextViewComponent" }
      }
    ]
  },
  {
    name: "telegram-request-default",
    entityName: "telegramRequest",
    label: "",
    fields: [
      {
        enabled: true,
        name: "type",
        label: "نوع ",
        template: { component: "ShortTextViewComponent" }
      },
      {
        enabled: true,
        name: "text",
        label: "متن",
        template: { component: "ShortTextViewComponent" }
      },
      ,
      {
        enabled: true,
        name: "username",
        label: "شناسه کاربری ",
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
