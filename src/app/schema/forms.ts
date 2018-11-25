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
          calendarType: "persian"
        }
      },
      {
        componentName: "FormDateInputComponent",
        propertyName: "date",
        propertyType: "string",
        inputs: {
          label: "تاریخ میلادی"
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
        componentName: "FormTextInputComponent",
        propertyName: "lastName",
        inputs: {
          label: "نام خانوادگی"
        }
      },
      {
        componentName: "FormSelectInputComponent",
        propertyName: "gender",
        inputs: {
          selectType: "single",
          label: "جنسیت",
          data: [
            {
              label: "خانم",
              value: "female"
            },
            {
              label: "آقا",
              value: "male"
            }
          ]
        }
      },
      {
        componentName: "FormMultipleTextInputComponent",
        propertyName: "emails",
        inputs: {
          label: "آدرس ایمیل"
        }
      },
      {
        componentName: "FormMultipleTextInputComponent",
        propertyName: "mobiles",
        inputs: {
          label: "شماره موبایل"
        }
      },
      {
        propertyName: "contacts",
        componentName: "ContactInputComponent"
      }
    ],
    defaultModel: {
      firstName: "",
      lastName: "",
      contacts: [
        {
          name: "اطلاعات تماس اصلی",
          telephones: [""],
          faxes: [""],
          address: {}
        }
      ]
    }
  },
  {
    name: "crm-service-form",
    entityName: "service",
    parts: []
  },
  {
    name: "crm-complaint-form",
    entityName: "complaint",
    parts: []
  },
  {
    name: "crm-sale-form",
    entityName: "company",
    parts: []
  },
  {
    name: "crm-sale-form",
    entityName: "sale",
    parts: []
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
          data: ["شریک تجاری", "شرکت پخش", "شرکت رقیب", "تامین کننده"]
        }
      },
      {
        propertyName: "peoples",
        propertyType: "array",
        cssClass: "double-field",
        parts: [
          {
            componentName: "FormChipsInputComponent",
            propertyName: "value",
            propertyType: "string",
            cssClass: "w-60",
            inputs: {
              entityName: "people",
              selectType: "single",
              label: "نام شخص",
              propertiesToSearch: ["firstName", "lastName", "mobiles"]
            }
          },
          {
            componentName: "FormTextInputComponent",
            propertyName: "type",
            propertyType: "string",
            cssClass: "w-40",

            inputs: {
              label: "عنوان شغلی"
            }
          }
        ]
      },
      {
        propertyName: "contacts",
        componentName: "ContactInputComponent"
      }
    ],
    defaultModel: {
      name: "",
      peoples: [{ value: "", type: "" }],
      contacts: [
        {
          name: "اطلاعات تماس اصلی",
          emails: [""],
          telephones: [""],
          faxes: [""],
          address: {}
        }
      ]
    }
  }
];
