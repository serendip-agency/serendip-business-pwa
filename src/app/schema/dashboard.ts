import { DashboardSectionInterface } from "serendip-business-model";

export const DashboardSchema: DashboardSectionInterface[] = [
  {
    name: "start",
    title: "شروع",
    icon: "expand-1",
    tabs: []
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
  }
];
