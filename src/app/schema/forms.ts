import { FormInterface } from "serendip-business-model";
import { FormTextInputComponent } from "../base/form/form-text-input/form-text-input.component";

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
    name: "report-sync-field-query−date-range",
    parts: [
      {
        propertyName: "value",
        propertyType: "object",
        parts: [
          {
            componentName: "FormDateInputComponent",
            propertyName: "from",
            inputs: {
              label: "از تاریخ"
            }
          },
          {
            componentName: "FormDateInputComponent",
            propertyName: "to",
            inputs: {
              label: "تا تاریخ"
            }
          }
        ]
      }
    ]
  },
  {
    name: "report-sync-field-query-eq",

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
    name: "report-async-field-format-date",
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
    name: "dashboard-form",
    entityName: "_dashboard",
    parts: [
      {
        componentName: "FormTextInputComponent",
        propertyName: "name",
        inputs: {
          label: "نام داشبورد",
          type: "single-line",
          dir: "ltr"
        }
      },

      {
        componentName: "FormTextInputComponent",
        propertyName: "title",
        inputs: {
          label: "عنوان داشبورد",
          type: "single-line"
        }
      },
      {
        componentName: "FormIconInputComponent",
        propertyName: "icon",
        inputs: {
          label: "آیکون داشبورد"
        }
      },
      {
        propertyName: "tabs",
        propertyType: "array",
        label: "تب‌ها",
        parts: [
          {
            propertyType: "string",
            propertyName: "title",
            componentName: "FormTextInputComponent",
            inputs: {
              label: "عنوان تب",
              type: "single-line"
            }
          },
          {
            componentName: "FormIconInputComponent",
            propertyName: "icon",
            inputs: {
              label: "آیکون تب"
            }
          },
          {
            propertyName: "status",
            componentName: "FormRadioInputComponent",
            inputs: {
              display: "inline-block",
              label: "وضعیت",
              data: [
                {
                  label: "نمایش در صفحه",
                  value: "default"
                },
                {
                  label: "نمایش در منو کناری",
                  value: "menu"
                }
              ]
            }
          },
          {
            propertyName: "widget",
            propertyType: "object",
            label: "ویجت",
            parts: [
              {
                propertyName: "component",
                componentName: "FormSelectInputComponent",
                inputs: {
                  display: "inline-block",
                  label: "نام",
                  selectType: "single",
                  data: [
                    {
                      label: "ویجت گزارش‌",
                      value: "ReportComponent"
                    },
                    {
                      label: "ویجت فرم",
                      value: "FormComponent"
                    }
                  ]
                }
              },
              {
                if: "^form.component == 'ReportComponent'",
                propertyName: "inputs",
                propertyType: "object",
                label: "ورودی‌های ویجت",
                parts: [
                  {
                    componentName: "FormTextInputComponent",
                    propertyName: "title",
                    inputs: {
                      label: "عنوان ویجت",
                      type: "single-line"
                    }
                  },
                  {
                    componentName: "FormChipsInputComponent",
                    propertyName: "reportId",
                    propertyType: "string",
                    cssClass: "w-60",
                    inputs: {
                      entityName: "_report",
                      propertiesToSearch: ["name"],
                      propertiesSearchMode: "mix",
                      selectType: "single",
                      label: "گزارش مرتبط"
                    }
                  },
                  {
                    componentName: "FormChipsInputComponent",
                    propertyName: "formId",
                    propertyType: "string",
                    cssClass: "w-60",
                    inputs: {
                      entityName: "_form",
                      propertiesToSearch: ["name"],
                      propertiesSearchMode: "mix",
                      selectType: "single",
                      label: "فرم ثبت و ویرایش"
                    }
                  },
                  {
                    propertyName: "minimal",
                    componentName: "FormToggleInputComponent",
                    inputs: {
                      label: "حالت ساده"
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    name: "trigger-form",
    entityName: "_trigger",
    parts: [
      {
        componentName: "FormTextInputComponent",
        propertyName: "name",
        inputs: {
          label: "Trigger name",
          type: "single-line",
          dir: "ltr"
        }
      },
      {
        propertyName: "options",
        componentName: "FormTriggerInputComponent",
        inputs: {}
      }
    ],
    defaultModel: {
      options: {}
    }
  },
  {
    name: "entity-form",
    entityName: "_entity",
    parts: [
      {
        componentName: "FormTextInputComponent",
        propertyName: "name",
        inputs: {
          label: "Entity name",
          type: "single-line",
          dir: "ltr"
        }
      },
      {
        propertyName: "offline",
        componentName: "FormToggleInputComponent",
        inputs: {
          label: "offline"
        }
      },
      {
        componentName: "FormIconInputComponent",
        propertyName: "icon",
        inputs: {
          label: "Entity icon"
        }
      }
    ],
    defaultModel: {}
  },
  {
    name: "format-form",
    entityName: "_format",
    parts: [
      {
        propertyName: "label",
        componentName: "FormTextInputComponent",
        inputs: {
          label: "عنوان نتیجه‌گیری",
          type: "single-line"
        }
      },
      {
        propertyName: "entityName",
        componentName: "FormTextInputComponent",
        inputs: {
          label: "نام شی",
          type: "single-line",
          dir: "ltr"
        }
      },
      {
        propertyName: "dataType",
        componentName: "FormSelectInputComponent",
        inputs: {
          display: "inline-block",
          label: "مدل خروجی",
          selectType: "single",
          data: [
            {
              label: "نام و مقدار",
              value: "name-value"
            },
            {
              label: "نام و آرایه‌ای از نام و مقدار",
              value: "name-series"
            }
          ]
        }
      },
      {
        propertyName: "method",
        componentName: "FormSelectInputComponent",
        inputs: {
          display: "inline-block",
          label: "شیوه نتیجه‌گیری",
          selectType: "single",
          data: [
            {
              label: "شیوه نتیجه‌گیری را انتخاب کنید",
              value: ""
            },
            {
              label: "کد جاوااسکریپت",
              value: "javascript"
            }
          ]
        }
      },
      {
        propertyName: "options",
        propertyType: "object",
        if: "^form.method == 'javascript'",
        parts: [
          {
            propertyName: "code",
            componentName: "FormCodeInputComponent",
            inputs: {
              label: "کد",
              language: "js"
            }
          }
        ]
      }
    ]
  },
  {
    name: "add-widadd-widget-to-grid-form",
    entityName: "_gridWidget",
    parts: [
      {
        componentName: "FormChipsInputComponent",
        propertyName: "entity",
        propertyType: "string",
        cssClass: "w-60",
        inputs: {
          entityName: "_entity",
          propertiesToSearch: ["name"],
          propertiesSearchMode: "mix",
          selectType: "single",
          label: "Entity"
        }
      }
    ]
  },
  {
    name: "report-form",
    entityName: "_report",
    parts: [
      {
        propertyName: "name",
        componentName: "FormTextInputComponent",
        inputs: {
          label: "نام گزارش",
          type: "single-line"
        }
      },
      {
        propertyName: "entityName",
        componentName: "FormTextInputComponent",
        inputs: {
          label: "نام شی",
          type: "single-line",
          dir: "ltr"
        }
      },
      {
        propertyType: "array",
        propertyName: "fields",
        label: "فیلد‌ها",
        parts: [
          {
            propertyName: "name",
            componentName: "FormTextInputComponent",
            inputs: {
              label: "نام فیلد",
              type: "single-line",
              dir: "ltr"
            }
          },
          {
            propertyName: "label",
            componentName: "FormTextInputComponent",
            inputs: {
              label: "لیبل فیلد",
              type: "single-line"
            }
          },
          // {
          //   propertyName: "type",
          //   componentName: "FormTextInputComponent",
          //   inputs: {
          //     label: "نوع فیلد",
          //     type: "single-line",
          //     dir: "ltr"
          //   }
          // },
          {
            propertyName: "analytical",
            componentName: "FormToggleInputComponent",
            inputs: {
              label: "مناسب برای تحلیل"
            }
          },
          {
            propertyName: "indexing",
            componentName: "FormToggleInputComponent",
            inputs: {
              label: "ثبت در موتور جست‌وجو"
            }
          },
          {
            propertyName: "method",
            componentName: "FormSelectInputComponent",
            inputs: {
              display: "inline-block",
              label: "روش نمایش",
              selectType: "single",
              data: [
                {
                  label: "نمایش مستقیم از سند",
                  value: ""
                },
                {
                  label: "اتصال چند فیلد",
                  value: "joinFields"
                }
              ]
            }
          },
          {
            if: "^form.method === 'joinFields' ",
            propertyName: "methodOptions",
            propertyType: "object",
            parts: [
              {
                propertyName: "fields",
                componentName: "FormMultipleTextInputComponent",
                inputs: {
                  label: "نام فیلد برای اتصال"
                }
              },
              {
                propertyName: "separator",
                componentName: "FormTextInputComponent",
                inputs: {
                  label: "جدا کننده فیلدها"
                }
              }
            ]
          },
          {
            propertyName: "template",
            componentName: "FormSelectInputComponent",
            inputs: {
              display: "inline-block",
              label: "تمپلیت نمایش",
              selectType: "single",
              data: [
                {
                  label: "تاریخ",
                  value: {
                    component: "DateViewComponent",
                    inputs: {
                      format: "jYYYY/jMM/jDD HH:mm:ss"
                    },
                    formName: "report-async-field-format-date"
                  }
                },
                {
                  label: "متن کوتاه",
                  value: {
                    component: "ShortTextViewComponent"
                  }
                },
                {
                  label: "متن بلند",
                  value: {
                    component: "LongTextViewComponent"
                  }
                },
                {
                  label: "شناسه",
                  value: {
                    component: "ObjectidViewComponent"
                  }
                }
              ]
            }
          },
          {
            propertyName: "queries",
            componentName: "FormSelectInputComponent",
            inputs: {
              display: "inline-block",
              label: "فیلترها",
              selectType: "multiple",
              data: [
                {
                  label: "برابر باشد ",
                  value: {
                    label: "برابر باشد با",
                    method: "eq",
                    methodInputForm: "report-sync-field-query-eq"
                  }
                },
                {
                  label: "برابر نباشد ",
                  value: {
                    label: "برابر نباشد با",
                    method: "neq",
                    methodInputForm: "report-sync-field-query-eq"
                  }
                },
                {
                  label: "در بازه زمانی باشد",
                  value: {
                    label: "در این بازه زمانی باشد",
                    method: "range",
                    methodInputForm: "report-sync-field-query-range"
                  }
                },
                {
                  label: "در   بازه زمانی نباشد",
                  value: {
                    label: "در این بازه زمانی نباشد",
                    method: "range",
                    methodInputForm: "report-sync-field-query-range"
                  }
                }
              ]
            }
          },
          {
            propertyName: "enabled",
            componentName: "FormToggleInputComponent",
            inputs: {
              label: "فعال به صورت پیش‌فرض"
            }
          }
        ]
      }
    ],
    defaultModel: {}
  },
  {
    name: "form-form",
    entityName: "_form",
    parts: [
      {
        componentName: "FormTextInputComponent",
        propertyName: "name",
        inputs: {
          label: "نام فرم",
          type: "single-line"
        }
      },
      {
        componentName: "FormTextInputComponent",
        propertyName: "entityName",
        inputs: {
          label: "نام شی",
          type: "single-line",
          dir: "ltr"
        }
      },
      {
        propertyName: "parts",
        propertyType: "array",
        label: "اجزای فرم",
        parts: [
          {
            propertyType: "string",
            propertyName: "propertyName",
            componentName: "FormTextInputComponent",
            inputs: {
              label: "نام فیلد",
              type: "single-line",
              dir: "ltr"
            }
          },
          {
            propertyName: "propertyType",
            componentName: "FormRadioInputComponent",
            inputs: {
              display: "inline-block",
              label: "نوع فیلد",
              data: [
                {
                  label: "فیلد ورودی",
                  value: ""
                },
                {
                  label: "آبجکت",
                  value: "object"
                },
                {
                  label: "آرایه",
                  value: "array"
                }
              ]
            }
          },
          {
            if: "^form.propertyType == 'array'",
            propertyType: "string",
            propertyName: "label",
            componentName: "FormTextInputComponent",
            inputs: {
              label: "لیبل آرایه",
              type: "single-line"
            }
          },
          {
            if: "!^form.propertyType",
            propertyName: "componentName",
            componentName: "FormSelectInputComponent",
            inputs: {
              display: "inline-block",
              label: "ابزار ورود اطلاعات",
              selectType: "single",
              data: [
                {
                  label: "فیلد متنی",
                  value: "FormTextInputComponent"
                },
                {
                  label: "رادیو لیست",
                  value: "FormRadioInputComponent"
                },
                {
                  label: "چک لیست",
                  value: "FormCheckboxInputComponent"
                },
                {
                  label: "منو کشویی",
                  value: "FormSelectInputComponent"
                },
                {
                  label: "انتخاب از مدیریت فایل",
                  value: "FormStorageInputComponent"
                },
                {
                  label: "فایل ضمیمه سند",
                  value: "FormFileInputComponent"
                },
                {
                  label: "انتخاب موقعیت جغرافیایی",
                  value: "FormLatlngInputComponent"
                }
              ]
            }
          },
          {
            if:
              "!^form.propertyType && ^form.componentName == 'FormStorageInputComponent'",
            propertyType: "object",
            propertyName: "inputs",
            label: "تنظیمات فیلد انتخاب از فایل‌ها",
            parts: [
              {
                propertyType: "string",
                propertyName: "label",
                componentName: "FormTextInputComponent",
                inputs: {
                  label: "لیبل فیلد",
                  type: "single-line"
                }
              }
            ]
          },
          {
            if:
              "!^form.propertyType && ^form.componentName == 'FormTextInputComponent'",
            propertyType: "object",
            propertyName: "inputs",
            label: "تنظیمات فیلد متنی",
            parts: [
              {
                propertyType: "string",
                propertyName: "label",
                componentName: "FormTextInputComponent",
                inputs: {
                  label: "لیبل فیلد",
                  type: "single-line"
                }
              },
              {
                propertyName: "type",
                componentName: "FormRadioInputComponent",
                inputs: {
                  data: [
                    {
                      label: "تک خط",
                      value: "single-line"
                    },
                    {
                      label: "چند خط",
                      value: "multi-line"
                    }
                  ]
                }
              }
            ]
          },
          {
            if:
              "!^form.propertyType && ^form.componentName == 'FormRadioInputComponent'",
            propertyType: "object",
            propertyName: "inputs",
            label: "تنظیمات فیلد رادیو",
            parts: [
              {
                propertyType: "string",
                propertyName: "label",
                componentName: "FormTextInputComponent",
                inputs: {
                  label: "لیبل فیلد",
                  type: "single-line"
                }
              },
              {
                propertyName: "dataType",
                componentName: "FormRadioInputComponent",
                inputs: {
                  data: [
                    {
                      label: "ورود دستی مقادیر",
                      value: "manual-value-list"
                    },
                    {
                      label: "ورود دستی مقادیر + لیبل",
                      value: "manual-value-label-list"
                    }
                  ]
                }
              },
              {
                if: "^form.dataType ==  'manual-value-label-list'",
                propertyName: "data",
                propertyType: "array",
                label: "مقادیر قابل انتخاب",
                parts: [
                  {
                    propertyType: "string",
                    cssClass: "w-50",
                    propertyName: "label",
                    componentName: "FormTextInputComponent",
                    inputs: {
                      label: "لیبل",
                      type: "single-line"
                    }
                  },
                  {
                    propertyType: "string",
                    propertyName: "label",
                    cssClass: "w-50",
                    componentName: "FormTextInputComponent",
                    inputs: {
                      label: "مقدار",
                      type: "single-line"
                    }
                  }
                ]
              },
              {
                if: "^form.dataType ==  'manual-value-list'",
                propertyName: "data",
                componentName: "FormMultipleTextInputComponent",
                inputs: {
                  label: "مقادیر قابل انتخاب"
                }
              }
            ]
          },
          {
            if:
              "^form.propertyType === 'array' || ^form.propertyType === 'object'",
            propertyName: "parts",
            propertyType: "array",
            label: "اجزای فیلد",
            parts: "clone-top-parts"
          }
        ]
      }
    ],
    defaultModel: {
      parts: [
        {
          propertyType: "",
          parts: [{}]
        }
      ]
    }
  },
  {
    name: "sms-form",
    entityName: "sms",
    parts: [
      // {
      //   componentName: "FormChipsInputComponent",
      //   propertyName: "recipients",
      //   propertyType: "string",
      //   cssClass: "w-60",
      //   inputs: {
      //     entityName: "people",
      //     propertiesToSearch: ["firstName", "lastName", "emails"],
      //     propertiesSearchMode: "mix",
      //     selectType: "multiple",
      //     label: "دریافت کنندگان"
      //   }
      // },
      // {
      //   componentName: "FormChipsInputComponent",
      //   propertyName: "template",
      //   propertyType: "string",
      //   cssClass: "w-60",
      //   inputs: {
      //     entityName: "emailTemplate",
      //     propertiesToSearch: ["name"],
      //     propertiesSearchMode: "mix",
      //     selectType: "single",
      //     label: "قالب پیامک"
      //   }
      // },
      // {
      //   componentName: "FormDateInputComponent",
      //   propertyName: "jdate",
      //   propertyType: "string",
      //   inputs: {
      //     label: "ارسال در تاریخ"
      //   }
      // },
      {
        componentName: "FormTextInputComponent",
        propertyName: "to",
        inputs: {
          label: "گیرنده",
          dir: "ltr"
        }
      },
      {
        componentName: "FormTextInputComponent",
        propertyName: "message",
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
    name: "mail-form",
    entityName: "mail",
    parts: [
      {
        componentName: "FormTextInputComponent",
        propertyName: "subject",
        inputs: {
          label: "موضوع"
        }
      },
      {
        componentName: "FormTextInputComponent",
        propertyName: "from",
        inputs: {
          label: "ایمیل فرستنده",
          dir: "ltr"
        }
      },
      {
        componentName: "FormTextInputComponent",
        propertyName: "to",
        inputs: {
          label: "ایمیل گیرنده",
          dir: "ltr"
        }
      },
      // {
      //   componentName: "FormChipsInputComponent",
      //   propertyName: "recipients",
      //   propertyType: "string",
      //   cssClass: "w-60",
      //   inputs: {
      //     entityName: "people",
      //     propertiesToSearch: ["firstName", "lastName", "emails"],
      //     propertiesSearchMode: "mix",
      //     selectType: "multiple",
      //     label: "دریافت کنندگان"
      //   }
      // },
      // {
      //   componentName: "FormChipsInputComponent",
      //   propertyName: "template",
      //   propertyType: "string",
      //   cssClass: "w-60",
      //   inputs: {
      //     entityName: "emailTemplate",
      //     propertiesToSearch: ["name"],
      //     propertiesSearchMode: "mix",
      //     selectType: "single",
      //     label: "قالب ایمیل"
      //   }
      // },
      {
        componentName: "FormFileInputComponent",
        propertyName: "attachments",
        inputs: {
          type: "multiple",
          label: "فایل‌های ضمیمه"
        }
      },
      {
        if: "^form.sentDate",
        componentName: "FormDateInputComponent",
        propertyName: "sentDate",
        propertyType: "string",
        inputs: {
          label: "ارسال تاریخ"
        }
      },
      {
        componentName: "FormHtmlInputComponent",
        propertyName: "html",
        inputs: {}
      }
    ],
    defaultModel: {}
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
  },
  {
    name: "repository-form",
    entityName: "_repository",
    parts: [
      {
        componentName: "FormTextInputComponent",
        propertyName: "name",
        propertyType: "string",
        inputs: {
          label: "نام مخزن",
          dir: "ltr"
        }
      },
      {
        componentName: "FormTextInputComponent",
        propertyName: "address",
        propertyType: "string",
        inputs: {
          label: "آدرس مخزن",
          dir: "ltr"
        }
      },
      {
        componentName: "FormTextInputComponent",
        propertyName: "description",
        propertyType: "string",
        inputs: {
          label: "توضیحات",
          dir: "ltr"
        }
      },
      {
        componentName: "FormChipsInputComponent",
        propertyName: "services",
        propertyType: "string",
        cssClass: "w-40",
        inputs: {
          entityName: "_serverService",
          propertiesToSearch: ["name"],
          formName: "server-service-form",
          propertiesSearchMode: "mix",
          selectType: "multiple",
          label: "سرویس"
        }
      }
    ]
  },
  {
    name: "server-form",
    entityName: "_server",
    parts: [
      {
        componentName: "FormTextInputComponent",
        propertyName: "name",
        propertyType: "string",
        inputs: {
          label: "نام سرور",
          dir: "ltr"
        }
      },
      {
        componentName: "FormTextInputComponent",
        propertyName: "ip",
        propertyType: "string",
        inputs: {
          label: "آدرس IP",
          dir: "ltr"
        }
      },
      {
        componentName: "FormTextInputComponent",
        propertyName: "provider",
        propertyType: "string",
        inputs: {
          label: "تامین کننده",
          dir: "ltr"
        }
      },
      {
        componentName: "FormChipsInputComponent",
        propertyName: "services",
        propertyType: "string",
        cssClass: "w-40",
        inputs: {
          entityName: "_serverService",
          propertiesToSearch: ["name"],
          formName: "server-service-form",
          propertiesSearchMode: "mix",
          selectType: "multiple",
          label: "سرویس"
        }
      }
    ]
  },
  {
    name: "server-script-form",
    entityName: "_serverScript",
    parts: [
      {
        componentName: "FormTextInputComponent",
        propertyName: "name",
        propertyType: "string",
        inputs: {
          label: "نام اسکریپت",
          dir: "ltr"
        }
      },
      {
        componentName: "FormCodeInputComponent",
        propertyName: "script",
        propertyType: "string",
        inputs: {}
      }
    ]
  },
  {
    name: "server-service-form",
    entityName: "_serverService",
    parts: [
      {
        componentName: "FormTextInputComponent",
        propertyName: "name",
        propertyType: "string",
        inputs: {
          label: "نام سرویس",
          dir: "ltr"
        }
      },
      {
        componentName: "FormChipsInputComponent",
        propertyName: "script",
        propertyType: "string",
        inputs: {
          entityName: "_serverScript",
          propertiesToSearch: ["name"],
          propertiesSearchMode: "mix",
          formName: "server-script-form",
          selectType: "single",
          label: "اسکریپت"
        }
      }
    ]
  }
];
