export interface DashboardContainerInterface {
  showTabs?: boolean;
  tabs: DashboardTabInterface[];
}

export interface DashboardGridInterface {
  containers: DashboardContainerInterface[];
  version?: number;
}

export interface DashboardWidgetInterface {
  component?: string;
  inputs?: any;
}

export interface DashboardTabInterface {
  title?: string;
  icon?: string;
  active?: boolean;
  widgets?: DashboardWidgetInterface[];
}

export interface DashboardSectionInterface {
  name?: string;
  title?: string;
  icon?: string;
  tabs?: DashboardTabInterface[];
  toggleUl?: boolean;
}

export const DashboardSchema: DashboardSectionInterface[] = [
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
              entityLabel: "شرکت"
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
      },
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
              entityName: "company",
              listId: "company-default",
              pageSize: 10
            }
          }
        ]
      }
    ]
  }
];
