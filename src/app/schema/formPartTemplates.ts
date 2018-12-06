import { FormPartInterface } from "serendip-business-model";

export const formPartTemplates = {
  serviceTiming: <FormPartInterface>{
    componentName: "FormRadioInputComponent",
    propertyName: "serviceTiming",
    inputs: {
      display: "block",
      data: [
        { value: "periodic", label: "دوره‌های مشخص" },
        { value: "absolute", label: "زمان مشخص" },
        { value: "relative", label: "زمان نسبی" }
      ],
      label: "زمان‌بندی انجام خدمت"
    }
  },
  price: <FormPartInterface>{
    componentName: "FormPriceInputComponent",
    propertyName: "price",
    inputs: {
      label: "قیمت"
    }
  }
};
