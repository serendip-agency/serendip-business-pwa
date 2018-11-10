import { DashboardSectionInterface } from "serendip-business-model";

export const DashboardSchema: DashboardSectionInterface[] = [
  {
    name: "dashboard",
    title: "داشبورد",
    icon: "people-users-customers-club-2",
    tabs: [
      {
        title: "اطلاعات شرکت ها",
        icon: "plus-add-2",
        widgets: [
          {
            component: "ReportComponent",
            inputs: {
              entityLabelSingular: "شرکت",
              entityLabelPlural: "شرکت ها",
              title: "اطلاعات شرکت ها",
              subtitle: "گزارش, جست و جو و عملیات ها  ",
              reportName: "company-default",
              entityName: "company",
              pageSize: 10
            }
          }
        ]
      }
    ]
  },
  {
    name: "people",
    title: "اشخاص",
    icon: "people-users-customers-club-2",
    tabs: [
      {
        title: "فرم اطلاعات اشخاص",
        icon: "plus-add-2",
        widgets: [
          {
            component: "FormComponent",
            inputs: {
              name: "crm-people-form",
              entityName: "people",
              entityLabel: "شخص"
            }
          }
        ]
      }
    ]
  },
  {
    name: "company",
    title: "داشبورد",
    icon: "dashboard-1",
    tabs: [
      {
        title: "فرم اطلاعات شرکت",
        icon: "plus-add-2",
        widgets: [
          {
            component: "FormComponent",
            inputs: {
              name: "crm-company-form",
              entityName: "company",
              entityLabel: "شرکت",
              mode: "triggers"
            }
          }
        ]
      },
      {
        title: "تنظیم روال کاری اطلاعات شرکت‌ها",
        icon: "plus-add-2",
        widgets: [
          {
            component: "TriggersComponent",
            inputs: {
              label: "اطلاعات شرکت‌ها",
              entity: "company"
            }
          }
        ]
      }
    ]
  }
];
