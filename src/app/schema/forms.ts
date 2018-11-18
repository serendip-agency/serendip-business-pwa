import { FormInterface } from "serendip-business-model";

export const FormsSchema: FormInterface[] = [
  {
    name: "serendip-base-inputs",
    parts: [
      {
        componentName: "FormTextInputComponent",
        propertyName: "value",
        propertyType: "string",
        inputs: {
          label: "مقدار"
        }
      },
      {
        componentName: "FormDateInputComponent",
        propertyName: "jdate",
        propertyType: "string",
        inputs: {
          label: "تاریخ جلالی",
          calendarType : "persian"
        }
      },
      {
        componentName: "FormDateInputComponent",
        propertyName: "date",
        propertyType: "string",
        inputs: {
          label: "تاریخ میلادی",
        }
      }
    ]
  },
  {
    name: "report-query-eq",

    parts: [
      {
        componentName: "FormTextInputComponent",
        propertyName: "value",
        propertyType: "string",
        inputs: {
          label: "مقدار"
        }
      }
    ]
  },

  {
    name: "report-field-date",
    parts: [
      {
        componentName: "FormSelectInputComponent",
        propertyName: "format",
        inputs: {
          selectType: "single",
          label: "نحوه نمایش زمان",
          data: [
            {
              label: "روز/ماه/سال میلادی",
              value: "YYYY/MM/DD"
            },
            {
              label: "روز/ماه/سال جلالی",
              value: "jYYYY/jMM/jDD"
            },
            {
              label: "روز/ماه/سال جلالی ساعت:دقیقه:ثانیه",
              value: "jYYYY/jMM/jDD HH:mm:ss"
            }
          ]
        }
      }
    ]
  },
  {
    name: "crm-people-form",
    entityName: "people",
    parts: [
      {
        componentName: "FormTextInputComponent",
        propertyName: "firstName",
        inputs: {
          label: "نام"
        }
      },

      {
        propertyName: "contacts",
        componentName: "ContactInputComponent"
      }
    ],
    defaultModel: {
      firstName: "22",
      contacts: [
        {
          telephones: ["0912", "0935"],
          faxes: [""],
          address: {}
        }
      ]
    }
  },
  {
    name: "crm-service-form",
    entityName: "service",
    parts:[]
  },
  {
    name: "crm-complaint-form",
    entityName: "complaint",
    parts:[]
  },
  {
    name: "crm-sale-form",
    entityName: "company",
    parts:[]
  },
  {
    name: "crm-sale-form",
    entityName: "sale",
    parts:[]
  },
  {
    name: "crm-company-form",
    entityName: "company",
    parts: [
      {
        componentName: "FormTextInputComponent",
        propertyName: "name",
        propertyType: "string",
        inputs: {
          label: "نام شرکت"
        }
      },
      {
        componentName: "FormSelectInputComponent",
        propertyName: "type",
        propertyType: "string",
        inputs: {
          selectType: "multiple",
          label: "نوع شرکت",
          data: ["شریک تجاری", "شرکت پخش", "تامین کننده"]
        }
      },

      {
        propertyName: "contacts",
        propertyType: "array",
        componentName: "ContactInputComponent"
      }
    ],
    defaultModel: {
      name: "22",
      bad: ["تامین کننده"],
      contacts: [
        {
          telephones: ["dd"],
          faxes: [""],
          address: {}
        }
      ]
    }
  }
];
