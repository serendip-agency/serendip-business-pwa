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
        icon: "settings-adjust-bold",
        widgets: [
          {
            component: "ReportComponent",
            inputs: {
              minimal: true,
              reportName: "dashboard-default",
              formName: "dashboard-form",
              icon: "settings-adjust-bold",
              entityName: "dashboard",
              entityLabelSingular: "داشبورد",
              title: "داشبورد‌ها"
            }
          }
        ]
      },
      {
        status: "default",
        title: "فرم‌ها",
        icon: "settings-adjust-bold",
        widgets: [
          {
            component: "FormComponent",
            inputs: {
              icon: "settings-adjust-bold",
              name: "form-form",
              entityName: "form"
            }
          }
        ]
      },
      {
        status: "default",
        title: "فرم‌ها",
        icon: "settings-adjust-bold",
        widgets: [
          {
            component: "FormComponent",
            inputs: {
              formId: "5c3b8d576f84d45d1ed17f44"
            }
          }
        ]
      },
      {
        status: "default",
        title: "فرم‌ها",
        icon: "settings-adjust-bold",
        widgets: [
          {
            component: "ReportComponent",
            inputs: {
              minimal: true,
              reportName: "form-default",
              formName: "form-form",
              icon: "settings-adjust-bold",
              entityName: "form",
              entityLabelSingular: "فرم",
              title: "فرم‌ها"
            }
          }
        ]
      }
    ]
  }
];
