import { DashboardSectionInterface } from "serendip-business-model";

export const DashboardSchema: DashboardSectionInterface[] = [
  {
    name: "settings",
    title: "تنظیمات",
    icon: "settings-1",
    tabs: [
      {
        status: "default",
        title: "داشبورد‌ها",
        icon: "tab-3",
        widgets: [
          {
            component: "ReportComponent",
            inputs: {
              minimal: true,
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
              minimal: false,
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
              minimal: true,
              reportName: "report-default",
              formName: "report-form",
              icon: "filter-6",
              entityLabelSingular: "گرارش",
              title: "گزارشات"
            }
          }
        ]
      }
    ]
  }
];
