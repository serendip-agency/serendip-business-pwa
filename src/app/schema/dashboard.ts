import { DashboardSectionInterface } from "serendip-business-model";

export const DashboardSchema: DashboardSectionInterface[] = [
  {
    name: "dashboard",
    title: "داشبورد",
    icon: "dashboard-1",
    tabs: [
    ]
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
        icon: "plus-add-2",
        widgets: [
          {
            component: "ReportComponent",
            inputs: {
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
        icon: "plus-add-2",
        widgets: [
          {
            component: "FormComponent",
            inputs: {
              name: "crm-service-form",
              entityName: "service",
              entityLabel: "خدمت"
            }
          }
        ]
      },
      {
        title: "گزارش اطلاعات خدمات",
        icon: "plus-add-2",
        widgets: [
          {
            component: "ReportComponent",
            inputs: {
              reportName: "service-default",
              entityName: "service",
              subtitle: "'گزارش، جست‌وجو و عمیات‌ها'",
              title: "اطلاعات خدمات"
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
              entityName: "complaint",
              entityLabel: "شکایت"
            }
          }
        ]
      },
      {
        title: "گزارش اطلاعات شکایات",
        icon: "plus-add-2",
        widgets: [
          {
            component: "ReportComponent",
            inputs: {
              reportName: "complaint-default",
              entityName: "complaint",
              subtitle: "'گزارش، جست‌وجو و عمیات‌ها'",
              title: "اطلاعات شکایت‌ها"
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
    icon: "sell-money-expense-7",
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
              entityLabel: "فروش"
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
    tabs: []
  },
  {
    name: "sms",
    title: "پیامک",
    icon: "sms-bold-2",
    tabs: []
  },
  {
    name: "fax",
    title: "فکس",
    icon: "fax",
    tabs: []
  },
  {
    name: "support",
    title: "پشتیبانی",
    icon: "support-1",
    tabs: []
  },
  {
    name: "settings",
    title: "تنظیمات",
    icon: "settings-1",
    tabs: [{
      title: "تنظیم روال کاری اطلاعات فروش‌ها",
      icon: "plus-add-2",
      widgets: [
        {
          component: "TriggersComponent",
          inputs: {
            label: "اطلاعات فروش‌ها",
            entity: "sale"
          }
        }
      ]
    }]
  }
];
