import { DashboardSectionInterface } from "serendip-business-model";

export const DashboardSchema: DashboardSectionInterface[] = [
  {
    name: "dashboard",
    title: "داشبورد",
    icon: "dashboard-1",
    tabs: []
  },
  {
    name: "people",
    title: "اشخاص",
    icon: "people-users-customers-club-2",
    tabs: [
      {
        title: "فرم اطلاعات اشخاص",
        icon: "people-users-5",
        widgets: [
          {
            component: "FormComponent",
            inputs: {
              name: "crm-people-form",
              entityName: "people",
              entityLabel: "شخص",
              entityIcon: "people-users-5"
            }
          }
        ]
      },
      {
        title: "گزارش اطلاعات اشخاص",
        icon: "plus-add-2",
        widgets: [
          {
            component: "ReportComponent",
            inputs: {
              reportName: "people-default",
              entityName: "people",
              entityLabelSingular: "شخص",
              entityLabelPlural: "اشخاص",
              subtitle: "'گزارش، جست‌وجو و عمیات‌ها'",
              title: "اطلاعات اشخاص"
            }
          }
        ]
      }
    ]
  },
  {
    name: "company",
    title: "شرکت‌ها",
    icon: "building-corp",
    tabs: [
      {
        title: "فرم اطلاعات شرکت",
        icon: "building-company-1",
        widgets: [
          {
            component: "FormComponent",
            inputs: {
              name: "crm-company-form",
              entityName: "company",
              entityLabel: "شرکت",
              entityIcon: "building-company-1"
            }
          }
        ]
      },
      {
        title: "گزارش اطلاعات شرکت‌ها",
        icon: "building-corp",
        widgets: [
          {
            component: "ReportComponent",
            inputs: {
              icon: "building-corp",
              reportName: "company-default",
              entityName: "company",
              entityLabelSingular: "شرکت",
              entityLabelPlural: "شرکت‌ها",
              subtitle: "'گزارش، جست‌وجو و عمیات‌ها'",
              title: "اطلاعات شرکت‌ها"
            }
          }
        ]
      }
    ]
  },
  {
    name: "service",
    title: "خدمات",
    icon: "service",
    tabs: [
      {
        title: "فرم اطلاعات خدمت",
        icon: "service",
        widgets: [
          {
            component: "FormComponent",
            inputs: {
              name: "crm-service-form",
              entityIcon: "service",
              entityName: "service",
              entityLabel: "خدمت"
            }
          }
        ]
      },
      {
        title: "گزارش اطلاعات خدمات",
        icon: "settings-2",
        widgets: [
          {
            component: "ReportComponent",
            inputs: {
              reportName: "service-default",
              icon: "settings-2",
              entityName: "service",
              subtitle: "'گزارش، جست‌وجو و عمیات‌ها'",
              title: "اطلاعات خدمات",
              entityLabelSingular: "خدمت"
            }
          }
        ]
      }
    ]
  },
  {
    name: "complaint",
    title: "شکایات",
    icon: "complaints-customer-voice-2",
    tabs: [
      {
        title: "فرم اطلاعات شکایت",
        icon: "plus-add-2",
        widgets: [
          {
            component: "FormComponent",
            inputs: {
              name: "crm-complaint-form",
              entityIcon: "complaints-customer-voice-2",
              entityName: "complaint",
              entityLabel: "شکایت"
            }
          }
        ]
      },
      {
        title: "گزارش اطلاعات شکایات",
        icon: "complaints-customer-voice-2",
        widgets: [
          {
            component: "ReportComponent",
            inputs: {
              reportName: "complaint-default",
              icon: "complaints-customer-voice-1",
              entityName: "complaint",
              subtitle: "'گزارش، جست‌وجو و عمیات‌ها'",
              title: "اطلاعات شکایات",
              entityLabelSingular: "شکایت"
            }
          }
        ]
      }
    ]
  },
  {
    name: "funnel",
    title: "بازاریابی",
    icon: "filter-1",
    tabs: []
  },
  {
    name: "sale",
    title: "فروش",
    icon: "sell-money-expense-2",
    tabs: [
      {
        title: "فرم اطلاعات فروش",
        icon: "plus-add-2",
        widgets: [
          {
            component: "FormComponent",
            inputs: {
              name: "crm-sale-form",
              entityName: "sale",
              entityLabel: "فروش",
              entityIcon : 'sell-money-expense-7'
            }
          }
        ]
      },
      {
        title: "گزارش اطلاعات فروش",
        icon: "plus-add-2",
        widgets: [
          {
            component: "ReportComponent",
            inputs: {
              reportName: "sale-default",
              icon: "sell-money-expense-2",
              entityName: "sale",
              subtitle: "'گزارش، جست‌وجو و عمیات‌ها'",
              title: "اطلاعات فروش‌ها"
            }
          }
        ]
      }
    ]
  },
  {
    name: "inventory",
    title: "انبار",
    icon: "barcode-product-2",
    tabs: []
  },
  {
    name: "campaign",
    title: "کمپین‌ها",
    icon: "campaign-3",
    tabs: []
  },
  {
    name: "club",
    title: "باشگاه",
    icon: "club-2",
    tabs: []
  },

  {
    name: "email",
    title: "ایمیل",
    icon: "email-bold",
    tabs: [
      {
        title: "ارسال ایمیل",
        icon: "send",
        widgets: [
          {
            component: "FormComponent",
            inputs: {
              title: "ارسال ایمیل",
              minimal: true,
              saveButtonText: "ارسال",
              saveButtonIcon: "send",
              name: "email-form",
              entityName: "email",
              entityIcon: "send",
              entityLabel: "ایمیل"
            }
          }
        ]
      },
      {
        title: "صندوق ایمیل",
        icon: "email-reg",
        widgets: [
          {
            component: "ReportComponent",
            inputs: {
              minimal: true,
              reportName: "email-default",
              icon: "email-reg",
              entityName: "email",
              entityLabelSingular: "ایمیل",
              title: "صندوق ایمیل"
            }
          }
        ]
      }
    ]
  },
  {
    name: "sms",
    title: "پیامک",
    icon: "sms-bold-2",
    tabs: [
      {
        title: "ارسال پیامک",
        icon: "sms-bold-1",
        widgets: [
          {
            component: "FormComponent",
            inputs: {
              title: "ارسال پیامک",
              minimal: true,
              saveButtonText: "ارسال",
              saveButtonIcon: "send",
              name: "sms-form",
              entityName: "sms",
              entityIcon: "sms-bold-1",
              entityLabel: "ایمیل"
            }
          }
        ]
      },
      {
        title: "صندوق پیامک",
        icon: "sms-bold-2",
        widgets: [
          {
            component: "ReportComponent",
            inputs: {
              minimal: true,
              reportName: "sms-default",
              icon: "sms-bold-2",
              entityName: "sms",
              entityLabelSingular: "پیامک",
              title: "صندوق پیامک"
            }
          }
        ]
      }
    ]
  },
  {
    name: "fax",
    title: "فکس",
    icon: "fax",
    tabs: [
      {
        title: "ارسال فکس",
        icon: "send",
        widgets: [
          {
            component: "FormComponent",
            inputs: {
              title: "ارسال فکس",
              minimal: true,
              saveButtonText: "ارسال",
              saveButtonIcon: "send",
              name: "fax-form",
              entityName: "fax",
              entityIcon: "send",
              entityLabel: "فکس"
            }
          }
        ]
      },
      {
        title: "صندوق فکس",
        icon: "fax",
        widgets: [
          {
            component: "ReportComponent",
            inputs: {
              minimal: true,
              reportName: "fax-default",
              icon: "fax",
              entityName: "fax",
              entityLabelSingular: "فکس",
              title: "صندوق فکس"
            }
          }
        ]
      }
    ]
  },
  {
    name: "support",
    title: "پشتیبانی",
    icon: "support-1",
    tabs: [
      {
        title: "تیکت‌های پشتیبانی",
        icon: "service-customer-support-online-chat",
        widgets: [
          {
            component: "ReportComponent",
            inputs: {
              minimal: true,
              reportName: "support-ticket-default",
              icon: "service-customer-support-online-chat",
              entityName: "supportTicket",
              entityLabelSingular: "تیکت پشتیبانی",

              title: "تیکت‌های پشتیبانی"
            }
          }
        ]
      },
      {
        title: "فاکتورهای پشتیبانی",
        icon: "sell-buy-1",
        widgets: [
          {
            component: "ReportComponent",
            inputs: {
              minimal: true,
              reportName: "support-ticket-default",
              icon: "sell-buy-1",
              entityName: "supportInvoice",
              entityLabelSingular: "فاکتور پشتیبانی",
              title: "فاکتورهای پشتیبانی"
            }
          }
        ]
      }
    ]
  },
  {
    name: "settings",
    title: "تنظیمات",
    icon: "settings-1",
    tabs: [
      {
        title: "  انواع خدمات",
        icon: "settings-adjust-bold",
        widgets: [
          {
            component: "ReportComponent",
            inputs: {
              minimal: true,
              reportName: "service-type-default",
              icon: "settings-adjust-bold",
              entityName: "serviceType",
              entityLabelSingular: "  انواع خدمات",

              title: "تنظیم انواع خدمات"
            }
          }
        ]
      },
      {
        title: "  عناوین شغلی",
        icon: "settings-adjust-bold",
        widgets: [
          {
            component: "ReportComponent",
            inputs: {
              minimal: true,
              reportName: "job-title-default",
              icon: "settings-adjust-bold",
              entityName: "jobTitle",
              entityLabelSingular: "  عناوین شغلی",

              title: "تنظیم عناوین شغلی"
            }
          }
        ]
      },
      {
        title: "  عناوین ارتباطی با شرکت‌ها",
        icon: "settings-adjust-bold",
        widgets: [
          {
            component: "ReportComponent",
            inputs: {
              minimal: true,
              reportName: "company-relation-type-default",
              icon: "settings-adjust-bold",
              entityName: "companyRelationType",
              title: "تنظیم عناوین ارتباطی با شرکت‌ها",
              entityLabelSingular: "  عناوین ارتباطی با شرکت‌ها"
            }
          }
        ]
      },
      {
        title: "  عناوین ارتباطی با اشخاص",
        icon: "settings-adjust-bold",
        widgets: [
          {
            component: "ReportComponent",
            inputs: {
              minimal: true,
              reportName: "people-relation-type-default",
              icon: "settings-adjust-bold",
              entityName: "peopleRelationType",

              title: "تنظیم عناوین ارتباطی با شرکت‌ها",
              entityLabelSingular: "  عناوین ارتباطی با شرکت‌ها"
            }
          }
        ]
      },

      {
        title: "تنظیم روال کاری اطلاعات ",
        icon: "settings-adjust-bold",
        widgets: [
          {
            component: "TriggersComponent",
            inputs: {
              icon: "settings-adjust-bold"
            }
          }
        ]
      }
    ]
  }
];
