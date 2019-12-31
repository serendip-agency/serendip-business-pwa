import { ReportInterface } from "serendip-business-model";

export const ReportsSchema: ReportInterface[] = [
  {
    name: "primary",
    fields: [
      {
        enabled: true,
        indexing: true,
        type: "string",
        name: "_id",
        label: "ID",
        template: { component: "ObjectidViewComponent" }
      },
      {
        enabled: false,
        name: "_cdate",
        label: "created at",
        type: "date"
      },
      {
        enabled: false,
        name: "_vdate",
        label: "last change",
        type: "date"
      },
      {
        enabled: false,
        name: "_udate",
        label: "last update",
        type: "date"
      },
      {
        enabled: false,
        name: "_cuser",
        label: "creator"
      },
      {
        enabled: false,
        name: "_vuser",
        label: "last user"
      }
    ]
  },
  {
    name: "dashboard-default",
    entityName: "_dashboard",
    label: "",
    fields: [
      {
        enabled: true,
        name: "name",
        label: "Name",
        template: { component: "ShortTextViewComponent" }
      },
      {
        enabled: true,
        name: "title",
        label: "Title  ",
        template: { component: "ShortTextViewComponent" }
      }
    ]
  },
  {
    name: "grid-default",
    entityName: "_grid",
    label: "",
    fields: [
      {
        enabled: true,
        name: "section",
        analytical: true,
        label: "بخش",
        type: "string",
        method: "javascript",
        methodOptions: { code: "(doc,field)=> doc.data.section" },
        template: { component: "ShortTextViewComponent" }
      }
    ]
  },
  {
    name: "report-default",
    entityName: "_report",
    label: "",
    fields: [
      {
        enabled: true,
        name: "name",
        label: "Report name",
        template: { component: "LongTextViewComponent" }
      },
      {
        enabled: true,
        name: "label",
        label: "Report label",
        template: { component: "ShortTextViewComponent" }
      },
      {
        enabled: true,
        name: "offline",
        label: "Default offline",
        template: { component: "ShortTextViewComponent" }
      },
      {
        enabled: true,
        name: "entityName",
        label: "Entity name",
        template: { component: "ShortTextViewComponent" }
      }
    ]
  },
  {
    name: "entity-default",
    entityName: "_entity",
    label: "",
    fields: [
      {
        enabled: true,
        name: "name",
        label: "Entity name",
        template: { component: "ShortTextViewComponent" }
      },
      {
        enabled: true,
        name: "access",
        label: "Access",
        template: { component: "ShortTextViewComponent" }
      },
      {
        enabled: true,
        name: "icon",
        label: "Icon",
        template: { component: "IconViewComponent" }
      },
      {
        enabled: true,
        name: "webhook",
        label: "Web Hook",
        template: { component: "EntityWebhookViewComponent" }
      }
    ]
  },
  {
    name: "trigger-default",
    entityName: "_trigger",
    label: "",
    fields: []
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
    entityName: "_form",
    label: "",
    fields: [
      {
        enabled: true,
        name: "name",
        label: "Form name",
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
    name: "company-default",
    entityName: "company",
    label: "",
    fields: [
      {
        enabled: true,
        name: "name",
        label: "نام ",
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
  },
  {
    name: "server-default",
    entityName: "_server",
    label: "",
    fields: [
      {
        enabled: true,
        name: "name",
        label: "نام ",
        template: { component: "ShortTextViewComponent" }
      },
      {
        enabled: true,
        name: "ip",
        label: "IP",
        template: { component: "ShortTextViewComponent" }
      },
      {
        enabled: true,
        name: "provider",
        label: "تامین‌کننده ",
        template: { component: "ShortTextViewComponent" }
      },
      {
        enabled: true,
        name: "datacenter",
        label: "دیتاسنتر ",
        template: { component: "ShortTextViewComponent" }
      },
      {
        enabled: true,
        name: "services",
        label: "سرویس‌ها ",
        template: { component: "ShortTextViewComponent" }
      }
    ]
  },
  {
    name: "repository-default",
    entityName: "_repository",
    label: "",
    fields: [
      {
        enabled: true,
        name: "name",
        label: "نام ",
        template: { component: "ShortTextViewComponent" }
      },
      {
        enabled: true,
        name: "description",
        label: "توضیحات ",
        template: { component: "LongTextViewComponent" }
      }
    ]
  },
  {
    name: "server-script-default",
    entityName: "_serverScript",
    label: "",
    fields: [
      {
        enabled: true,
        name: "name",
        label: "نام ",
        template: { component: "ShortTextViewComponent" }
      }
    ]
  },
  {
    name: "server-service-default",
    entityName: "_serverService",
    label: "",
    fields: [
      {
        enabled: true,
        name: "name",
        label: "نام ",
        template: { component: "ShortTextViewComponent" }
      }
    ]
  }
];
