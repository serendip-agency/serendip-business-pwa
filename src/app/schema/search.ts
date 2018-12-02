export const SearchSchema: {
  entityName: string;
  fields: {
    name: string;
    opts?: {
      /**
       * Getter is a function that will be used to get value for this field. If getter function isn't specified, field name
       * will be used to get value.
       */
      getter?: (doc: any) => string;

      /**
       * Score boosting factor.
       */
      boost?: number;
    };
  }[];
}[] = [
  {
    entityName: "people",
    fields: [
      {
        name: "firstName",
        opts: { getter: doc => doc.firstName || "" }
      },
      {
        name: "lastName",
        opts: { getter: doc => doc.lastName || "", boost: 1.1 }
      },
      {
        name: "mobiles",
        opts: {
          getter: doc => {
            if (doc.mobiles) {
              if (doc.mobiles.join) {
                return doc.mobiles.join(" ");
              }
            }
            return "";
          }
        }
      }
    ]
  },
  {
    entityName: "company",
    fields: [
      {
        name: "name",
        opts: { getter: doc => doc.name || "" }
      }
    ]
  }
];
