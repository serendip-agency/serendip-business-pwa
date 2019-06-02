import { DashboardSectionInterface } from "serendip-business-model";

export const DashboardSchema: DashboardSectionInterface[] = [
  {
    name: "start",
    title: "شروع",
    icon: "expand-1",
    tabs: []
  },
  {
    name: "peoples",
    title: "اشخاص",
    icon: "people-users-2",
    tabs: [
      {
        status: "default",
        title: "اشخاص",
        icon: "people-users-2",
        widgets: [
          {
            component: "ReportComponent",
            inputs: {
              reportName: "people-default",
              formName: "people-form",
              icon: "people-users-2",
              title: "اشخاص"
            }
          }
        ]
      }
    ]
  },
  {
    name: "companies",
    title: "شرکت‌ها",
    icon: "building-company-1",
    tabs: [
      {
        status: "default",
        title: "شرکت‌ها",
        icon: "building-company-1",
        widgets: [
          {
            component: "ReportComponent",
            inputs: {
              reportName: "company-default",
              formName: "company-form",
              icon: "building-company-1",
              title: "شرکت‌ها"
            }
          }
        ]
      }
    ]
  },
  {
    name: "services",
    title: "خدمات",
    icon: "service",
    tabs: [
      {
        status: "default",
        title: "خدمات",
        icon: "service",
        widgets: [
          {
            component: "ReportComponent",
            inputs: {
              reportName: "company-default",
              formName: "company-form",
              icon: "service",
              title: "خدمات"
            }
          }
        ]
      }
    ]
  },
  {
    name: "complaints",
    title: "شکایات",
    icon: "building-company-1",
    tabs: [
      {
        status: "default",
        title: "شکایات",
        icon: "building-company-1",
        widgets: [
          {
            component: "ReportComponent",
            inputs: {
              reportName: "company-default",
              formName: "company-form",
              icon: "building-company-1",
              title: "شکایات"
            }
          }
        ]
      }
    ]
  },
  {
    name: "invoices",
    title: "فاکتورها",
    icon: "sell-money-expense-10",
    tabs: [
      {
        status: "default",
        title: "فاکتورها",
        icon: "sell-money-expense-10",
        widgets: [
          {
            component: "ReportComponent",
            inputs: {
              reportName: "company-default",
              formName: "company-form",
              icon: "sell-money-expense-10",
              title: "فاکتورها"
            }
          }
        ]
      }
    ]
  },
  {
    name: "inventory",
    title: "انبار",
    icon: "barcode-product-1",
    tabs: [
      {
        status: "default",
        title: "انبار",
        icon: "barcode-product-1",
        widgets: [
          {
            component: "ReportComponent",
            inputs: {
              reportName: "company-default",
              formName: "company-form",
              icon: "barcode-product-1",
              title: "انبار"
            }
          }
        ]
      }
    ]
  },
  {
    name: "mail",
    title: "ایمیل",
    icon: "email-reg",
    tabs: [
      {
        status: "default",
        title: "گزارش‌ ایمیل‌ها",
        icon: "email-reg",
        widgets: [
          {
            component: "ReportComponent",
            inputs: {
              reportName: "mail-default",
              formName: "mail-form",
              icon: "email-reg",
              entityLabelSingular: "ایمیل",
              title: "ایمیل‌ها"
            }
          }
        ]
      }
    ]
  },
  {
    name: "sms",
    title: "پیامک",
    icon: "sms-bold-1",
    tabs: [
      {
        status: "default",
        title: "گزارش‌ پیامک‌ها",
        icon: "sms-bold-1",
        widgets: [
          {
            component: "ReportComponent",
            inputs: {
              reportName: "sms-default",
              formName: "sms-form",
              icon: "sms-bold-1",
              entityLabelSingular: "پیامک",
              title: "پیامک‌ها"
            }
          }
        ]
      }
    ]
  },
  {
    name: "telegram",
    title: "تلگرام",
    icon: "send",
    tabs: [
      {
        status: "default",
        title: "گزارش‌ کاربران بات تلگرام",
        icon: "send",
        widgets: [
          {
            component: "ReportComponent",
            inputs: {
              reportName: "telegram-user-default",
              icon: "send",
              entityLabelSingular: "کاربر",
              title: "کاربران بات تلگرام"
            }
          }
        ]
      },
      {
        status: "default",
        title: "گزارش‌ درخواست‌های بات تلگرام",
        icon: "send",
        widgets: [
          {
            component: "ReportComponent",
            inputs: {
              reportName: "telegram-request-default",
              icon: "send",
              entityLabelSingular: "درخواست",
              title: "درخواست‌های بات تلگرام"
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
        active: true,
        title: "کسب‌وکار",
        icon: "building-production-unit-1",
        status: "default",
        widget: {
          component: "BusinessComponent"
        }
      },
      {
        active: true,
        title: "پروفایل",
        icon: "account-profile-user-4",
        status: "default",
        widget: {
          component: "AccountProfileComponent"
        }
      },
      {
        active: true,
        title: "تغییر رمز",
        icon: "account-profile-user-4",
        status: "default",
        widget: {
          component: "AccountPasswordComponent"
        }
      }
    ]
  },
  {
    name: "configurations",
    title: "پیکربندی",
    icon: "dashboard-1",
    tabs: [
      {
        status: "default",
        title: "اشیا",
        icon: "tab-4",
        widgets: [
          {
            component: "ReportComponent",
            inputs: {
              reportName: "entity-default",
              formName: "entity-form",
              icon: "tab-4",
              entityLabelSingular: "شی",
              title: "اشیا"
            }
          }
        ]
      },
      {
        status: "default",
        title: "تاریخچه",
        icon: "tab-4",
        widgets: [
          {
            component: "ReportComponent",
            inputs: {
              reportName: "grid-default",
              formName: "grid-form",
              icon: "tab-4",
              entityLabelSingular: "گرید",
              title: "تاریخچه استفاده از گرید"
            }
          }
        ]
      },
      {
        status: "default",
        title: "داشبورد‌ها",
        icon: "tab-3",
        widgets: [
          {
            component: "ReportComponent",
            inputs: {
              reportName: "dashboard-default",
              formName: "dashboard-form",
              icon: "tab-3",
              entityLabelSingular: "داشبورد",
              title: "داشبورد‌ها"
            }
          }
        ]
      },
      {
        status: "default",
        title: "فرم‌ها",
        icon: "copy",
        widgets: [
          {
            component: "ReportComponent",
            inputs: {
              reportName: "form-default",
              formName: "form-form",
              icon: "copy",
              entityLabelSingular: "فرم",
              title: "فرم‌ها"
            }
          }
        ]
      },
      {
        status: "default",
        title: "گزارشات",
        icon: "filter-6",
        widgets: [
          {
            component: "ReportComponent",
            inputs: {
              reportName: "report-default",
              formName: "report-form",
              icon: "filter-6",
              entityLabelSingular: "گرارش",
              title: "گزارشات"
            }
          }
        ]
      },
      {
        status: "default",
        title: "تریگرها",
        icon: "complaints-customize-customer-voice-3",
        widgets: [
          {
            component: "ReportComponent",
            inputs: {
              reportName: "trigger-default",
              formName: "trigger-form",
              icon: "complaints-customize-customer-voice-3",
              entityLabelSingular: "تریگر",
              title: "تریگر‌ها"
            }
          }
        ]
      },
      {
        status: "default",
        title: "روش‌های نتیجه‌گیری",
        icon: "efficiency-chart-1",
        widgets: [
          {
            component: "ReportComponent",
            inputs: {
              reportName: "format-default",
              formName: "format-form",
              icon: "efficiency-chart-1",
              title: "روش‌های نتیجه‌گیری"
            }
          }
        ]
      }
    ]
  },
  {
    name: "infstructure",
    title: "زیرساخت",
    icon: "settings-1",
    tabs: [
      {
        status: "default",
        title: "سرورها",
        icon: "efficiency-chart-1",
        widgets: [
          {
            component: "ReportComponent",
            inputs: {
              reportName: "server-default",
              formName: "server-form",
              icon: "efficiency-chart-1",
              title: "سرورها"
            }
          }
        ]
      },
      {
        status: "default",
        title: "مخازن نرم‌افزاری",
        icon: "efficiency-chart-1",
        widgets: [
          {
            component: "ReportComponent",
            inputs: {
              reportName: "repository-default",
              formName: "repository-form",
              icon: "efficiency-chart-1",
              title: "مخازن نرم‌افزاری"
            }
          }
        ]
      },
      {
        status: "default",
        title: "اسکریپت‌ها",
        icon: "efficiency-chart-1",
        widgets: [
          {
            component: "ReportComponent",
            inputs: {
              reportName: "server-script-default",
              formName: "server-script-form",
              icon: "efficiency-chart-1",
              title: "اسکریپت‌ها"
            }
          }
        ]
      },
      {
        status: "default",
        title: "سرویس‌ها",
        icon: "efficiency-chart-1",
        widgets: [
          {
            component: "ReportComponent",
            inputs: {
              reportName: "server-service-default",
              formName: "server-service-form",
              icon: "efficiency-chart-1",
              title: "سرویس‌ها"
            }
          }
        ]
      }
    ]
  }
];
