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
    name: "sms-form",
    entityName: "sms",
    parts: [
      {
        componentName: "FormChipsInputComponent",
        propertyName: "recipients",
        propertyType: "string",
        cssClass: "w-60",
        inputs: {
          entityName: "people",
          propertiesToSearch: ["firstName", "lastName", "emails"],
          propertiesSearchMode: "mix",
          selectType: "multiple",
          label: "دریافت کنندگان"
        }
      },
      {
        componentName: "FormChipsInputComponent",
        propertyName: "template",
        propertyType: "string",
        cssClass: "w-60",
        inputs: {
          entityName: "emailTemplate",
          propertiesToSearch: ["name"],
          propertiesSearchMode: "mix",
          selectType: "single",
          label: "قالب پیامک"
        }
      },
      {
        componentName: "FormDateInputComponent",
        propertyName: "jdate",
        propertyType: "string",
        inputs: {
          label: "ارسال در تاریخ"
        }
      },
      {
        componentName: "FormTextInputComponent",
        propertyName: "firstName",
        inputs: {
          label: "متن پیامک",
          type: "multi-line"
        }
      }
    ]
  },
  {
    name: "serviceType-form",
    entityName: "serviceType",
    parts: [
      {
        componentName: "FormTextInputComponent",
        propertyName: "name",
        inputs: {
          label: "نام دسته‌بندی خدمات"
        }
      },
      {
        templateName: "price"
      },
      {
        templateName: "serviceTiming",
        propertyName: "timing",
        inputs: {
          display: "inline"
        }
      }
    ],
    defaultModel: {
      name: "",
      timing: "none",
      price: { type: "toman", value: null }
    }
  },
  {
    name: "fax-form",
    entityName: "fax",
    parts: [
      {
        componentName: "FormTextInputComponent",
        propertyName: "subject",
        inputs: {
          label: "موضوع"
        }
      },
      {
        componentName: "FormChipsInputComponent",
        propertyName: "recipients",
        propertyType: "string",
        cssClass: "w-60",
        inputs: {
          entityName: "people",
          propertiesToSearch: ["firstName", "lastName", "emails"],
          propertiesSearchMode: "mix",
          selectType: "multiple",
          label: "دریافت کنندگان"
        }
      },
      {
        componentName: "FormDateInputComponent",
        propertyName: "jdate",
        propertyType: "string",
        inputs: {
          label: "ارسال در تاریخ"
        }
      },
      {
        componentName: "FormFileInputComponent",
        propertyName: "pages",
        inputs: {
          type: "multiple",
          label: "فایل‌های PDF یا تصاویر"
        }
      }
    ]
  },
  {
    name: "email-form",
    entityName: "email",
    parts: [
      {
        componentName: "FormTextInputComponent",
        propertyName: "subject",
        inputs: {
          label: "موضوع"
        }
      },
      {
        componentName: "FormChipsInputComponent",
        propertyName: "recipients",
        propertyType: "string",
        cssClass: "w-60",
        inputs: {
          entityName: "people",
          propertiesToSearch: ["firstName", "lastName", "emails"],
          propertiesSearchMode: "mix",
          selectType: "multiple",
          label: "دریافت کنندگان"
        }
      },
      {
        componentName: "FormChipsInputComponent",
        propertyName: "template",
        propertyType: "string",
        cssClass: "w-60",
        inputs: {
          entityName: "emailTemplate",
          propertiesToSearch: ["name"],
          propertiesSearchMode: "mix",
          selectType: "single",
          label: "قالب ایمیل"
        }
      },
      {
        componentName: "FormDateInputComponent",
        propertyName: "jdate",
        propertyType: "string",
        inputs: {
          label: "ارسال در تاریخ"
        }
      },
      {
        componentName: "FormTextInputComponent",
        propertyName: "firstName",
        inputs: {
          label: "متن ایمیل",
          type: "multi-line"
        }
      },
      {
        componentName: "FormFileInputComponent",
        propertyName: "attachments",
        inputs: {
          type: "multiple",
          label: "فایل‌های ضمیمه"
        }
      }
    ]
  },
  {
    name: "people-form",
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
    name: "service-form",
    entityName: "service",
    parts: [
      {
        componentName: "FormChipsInputComponent",
        propertyName: "value",
        propertyType: "string",
        inputs: {
          entityName: "people",
          propertiesToSearch: ["firstName", "lastName", "mobiles"],
          propertiesSearchMode: "mix",
          selectType: "single",
          label: "شخص مرتبط"
        }
      },
      {
        componentName: "FormChipsInputComponent",
        propertyName: "value",
        propertyType: "string",
        inputs: {
          entityName: "company",
          propertiesToSearch: ["company"],
          propertiesSearchMode: "mix",
          selectType: "single",
          label: "شرکت مرتبط"
        }
      },
      {
        componentName: "FormChipsInputComponent",
        propertyName: "serviceType",
        propertyType: "string",
        inputs: {
          entityName: "serviceType",
          propertiesToSearch: ["name"],
          propertiesSearchMode: "mix",
          selectType: "single",
          label: "نوع خدمت"
        }
      },
      {
        componentName: "FormDateInputComponent",
        propertyName: "receiveTime",
        propertyType: "string",
        inputs: {
          label: "تاریخ درخواست خدمت"
        }
      },
      {
        componentName: "FormDateInputComponent",
        propertyName: "receiveTime",
        propertyType: "string",
        inputs: {
          label: "مهلت انجام خدمت"
        }
      },

      {
        propertyName: "products",
        propertyType: "array",
        cssClass: "double-field",
        parts: [
          {
            componentName: "FormChipsInputComponent",
            propertyName: "value",
            propertyType: "string",
            cssClass: "w-60",
            inputs: {
              entityName: "product",
              propertiesToSearch: ["name"],
              propertiesSearchMode: "mix",
              selectType: "single",
              label: "محصول مرتبط"
            }
          },
          {
            componentName: "FormAutoCompleteInputComponent",
            propertyName: "lotNumber",
            propertyType: "string",
            cssClass: "w-40",
            inputs: {
              label: "سری ساخت",
              strict: true,
              data: []
            }
          }
        ]
      },
      {
        componentName: "FormTextInputComponent",
        propertyName: "firstName",
        inputs: {
          label: "توضیحات درخواست کننده",
          type: "multi-line"
        }
      },
      {
        componentName: "FormTextInputComponent",
        propertyName: "firstName",
        inputs: {
          label: "توضیحات ثبت کننده",
          type: "multi-line"
        }
      },
      {
        propertyName: "contacts",
        componentName: "ContactInputComponent"
      }
    ],
    defaultModel: {
      name: "",
      products: [{ product: "", lotNumber: "" }]
    }
  },
  {
    name: "complaint-form",
    entityName: "complaint",
    parts: [
      {
        componentName: "FormChipsInputComponent",
        propertyName: "value",
        propertyType: "string",
        inputs: {
          entityName: "people",
          propertiesToSearch: ["firstName", "lastName", "mobiles"],
          propertiesSearchMode: "mix",
          selectType: "single",
          label: "شخص مرتبط"
        }
      },
      {
        componentName: "FormChipsInputComponent",
        propertyName: "value",
        propertyType: "string",
        inputs: {
          entityName: "company",
          propertiesToSearch: ["company"],
          propertiesSearchMode: "mix",
          selectType: "single",
          label: "شرکت مرتبط"
        }
      },
      {
        componentName: "FormAutoCompleteInputComponent",
        propertyName: "subject",
        propertyType: "string",
        inputs: {
          label: "موضوع شکایت",
          strict: true,
          data: []
        }
      },
      {
        componentName: "FormDateInputComponent",
        propertyName: "receiveTime",
        propertyType: "string",
        inputs: {
          label: "تاریخ دریافت شکایت"
        }
      },

      {
        propertyName: "products",
        propertyType: "array",
        cssClass: "double-field",
        parts: [
          {
            componentName: "FormChipsInputComponent",
            propertyName: "value",
            propertyType: "string",
            cssClass: "w-60",
            inputs: {
              entityName: "product",
              propertiesToSearch: ["name"],
              propertiesSearchMode: "mix",
              selectType: "single",
              label: "محصول"
            }
          },
          {
            componentName: "FormAutoCompleteInputComponent",
            propertyName: "lotNumber",
            propertyType: "string",
            cssClass: "w-40",
            inputs: {
              label: "سری ساخت",
              strict: true,
              data: []
            }
          }
        ]
      },
      {
        componentName: "FormTextInputComponent",
        propertyName: "firstName",
        inputs: {
          label: "توضیحات شکایت کننده",
          type: "multi-line"
        }
      },
      {
        componentName: "FormTextInputComponent",
        propertyName: "firstName",
        inputs: {
          label: "جمع بندی دریافت کننده",
          type: "multi-line"
        }
      },
      {
        propertyName: "contacts",
        componentName: "ContactInputComponent"
      }
    ],
    defaultModel: {
      name: "",
      products: [{ product: "", lotNumber: "" }]
    }
  },
  {
    name: "sale-form",
    entityName: "company",
    parts: [
      {
        componentName: "FormChipsInputComponent",
        propertyName: "value",
        propertyType: "string",
        inputs: {
          entityName: "people",
          propertiesToSearch: ["firstName", "lastName", "mobiles"],
          propertiesSearchMode: "mix",
          selectType: "single",
          label: "شخص مرتبط"
        }
      },
      {
        componentName: "FormChipsInputComponent",
        propertyName: "value",
        propertyType: "string",
        inputs: {
          entityName: "company",
          propertiesToSearch: ["company"],
          propertiesSearchMode: "mix",
          selectType: "single",
          label: "شرکت مرتبط"
        }
      },
      {
        componentName: "FormTextInputComponent",
        propertyName: "subject",
        propertyType: "string",
        inputs: {
          label: "عنوان فاکتور یا قرارداد"
        }
      },
      {
        propertyName: "products",
        propertyType: "array",
        cssClass: "double-field",
        parts: [
          {
            componentName: "FormChipsInputComponent",
            propertyName: "value",
            propertyType: "string",
            cssClass: "w-40",
            inputs: {
              entityName: "product",
              propertiesToSearch: ["name"],
              propertiesSearchMode: "mix",
              selectType: "single",
              label: "محصول"
            }
          },
          {
            componentName: "FormPriceInputComponent",
            propertyName: "price",
            cssClass: "w-60",
            inputs: {
              label: "هزینه"
            }
          }
        ]
      },
      {
        propertyName: "services",
        propertyType: "array",
        cssClass: "double-field",
        parts: [
          {
            componentName: "FormChipsInputComponent",
            propertyName: "serviceType",
            propertyType: "string",
            cssClass: "w-40",
            inputs: {
              entityName: "product",
              propertiesToSearch: ["name"],
              propertiesSearchMode: "mix",
              selectType: "single",
              label: "نوع خدمت"
            }
          },
          {
            componentName: "FormPriceInputComponent",
            propertyName: "price",
            cssClass: "w-60",
            inputs: {
              label: "هزینه"
            }
          },
          {
            componentName: "FormDateInputComponent",
            propertyName: "dueDate",
            propertyType: "string",
            cssClass: "w-100",
            inputs: {
              label: "مهلت",
              calendarType: "persian"
            }
          },
          {
            componentName: "FormTextInputComponent",
            propertyName: "description",
            propertyType: "string",
            inputs: {
              type: "multi-line",
              label: "توضیحت سرویس"
            }
          }
        ]
      }
    ],
    defaultModel: {
      services: [{}],
      products: [{}]
    }
  },
  {
    name: "sale-form",
    entityName: "sale",
    parts: []
  },
  {
    name: "company-form",
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
              propertiesToSearch: ["firstName", "lastName", "mobiles"],
              propertiesSearchMode: "mix",
              selectType: "single",
              label: "شخص مرتبط"
            }
          },
          {
            componentName: "FormAutoCompleteInputComponent",
            propertyName: "type",
            propertyType: "string",
            cssClass: "w-40",
            inputs: {
              label: "نوع ارتباط",
              strict: true,
              data: [
                "مدیر عامل",
                "مدیر فنی",
                "کارشناس فنی",
                "سوپروایزر",
                "حسابدار",
                "کارمند",
                "مشاور"
              ]
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
