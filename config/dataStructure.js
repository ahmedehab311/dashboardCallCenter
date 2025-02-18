const dataStructure = {
  admins: {
    title: "Admins",
    titleButton: "Admin",
    table: {
      columns: [
        {
          key: "name",
          label: "Name",
        },
        {
          key: "phone",
          label: "Phone",
        },

        {
          key: "status",
          label: "Status",
          render: (item) => item.status?.name || "N/A",
        },
        {
          key: "title",
          label: "Title",
          render: (item) => item.title?.name || "N/A",
        },
        {
          key: "gender",
          label: "Gender",
          render: (item) => item.gender?.name || "N/A",
        },

        {
          key: "onlineStatus",
          label: "Online Status",
          render: (item) => item.onlineStatus || "N/A",
        },
        {
          key: "action",
          label: "Action",
        },
      ],
    },
    form: {
      title: "Admin",
      fields: [
        { name: "email", placeholder: "Email", type: "email" },
        { name: "phone", placeholder: "Phone", type: "number" },
        { name: "note", placeholder: "Note", type: "text" },

        {
          name: "title",
          placeholder: "Select title",
          type: "select",
          api: `/general/titles`,
          inline: true,
        },
        {
          name: "gender",
          placeholder: "Select gender",
          type: "select",
          api: `/general/genders`,
          inline: true,
        },
        { name: "cover", placeholder: "Cover", type: "file" },
      ],
    },

    extraInfoFields: [{ key: "statusMessage", label: "Note" }],
  },
  restaurants: {
    title: "Restaurants",
    titleButton: "Restaurant",

    table: {
      columns: [
        { key: "name", label: "Name" },
        { key: "phone", label: "Phone" },
        {
          key: "status",
          label: "Status",
          render: (item) => item.status?.name || "N/A",
        },
        // { key: "open", label: "Open From - To" },
        // {
        //   key: "open",
        //   label: (
        //     <>
        //       Open <span style={{ marginRight: "8px" }}></span>(From - To)
        //     </>
        //   ),
        // },

        // { key: "close", label: "Close" },
        { key: "actions", label: "Actions" },
      ],
    },
    form: {
      title: "Restaurant",
      fields: [
        { name: "phone", placeholder: "phone", type: "text" },

        {
          name: "open",
          label: "Open",
          type: "time",
          placeholder: "Opening time",
        },
        {
          name: "close",
          label: "Close",
          type: "time",
          placeholder: "Opening time",
        },

        { name: "note", placeholder: "Note", type: "text" },
        {
          name: "daysOff",
          placeholder: "daysOff",
          type: "multiselect",
          options: [
            { value: "sa", label: "Saturday" },
            { value: "su", label: "Sunday" },
            { value: "mo", label: "Monday" },
            { value: "tu", label: "Tuesday" },
            { value: "we", label: "Wednesday" },
            { value: "th", label: "Thursday" },
            { value: "fr", label: "Friday" },
          ],
        },
        { name: "logo", placeholder: "Logo", type: "file" },
        { name: "coverrest", placeholder: "Cover", type: "file" },
      ],
    },

    extraInfoFields: [
      { key: "notes", label: "Note" },
      { key: "daysOff", label: "Days Off" },
      {
        key: "open",
        label: (
          <>
            Open <span style={{ marginRight: "2px" }}></span>(From - To)
          </>
        ),
      },
    ],
  },
  branches: {
    title: "Branches",
    titleButton: "Branch",

    table: {
      columns: [
        { key: "name", label: "Name" },
        { key: "phone", label: "Phone" },

        {
          key: "status",
          label: "Status",
          render: (item) => item.status?.name || "N/A",
        },
        {
          key: "updateStatus",
          label: "push-update",
        },
        // { key: "open", label: "Open  From - To" },
        { key: "currency", label: "Currency" },
        { key: "language", label: "Language" },
        // { key: "cover", label: "Cover Photo" },
        { key: "actions", label: "Actions" },

        // { key: "map_location", label: "Map Location" },
      ],
    },
    form: {
      title: "Branch",
      fields: [
        { name: "phone", placeholder: "Phone", type: "number" },
        {
          name: "open",
          label: "Open",
          type: "time",
          placeholder: "Opening time",
        },
        {
          name: "close",
          label: "Close",
          type: "time",
          placeholder: "Opening time",
        },

        {
          name: "daysOff",
          placeholder: "Days off",
          type: "multiselect",
          options: [
            { value: "sa", label: "sa" },
            { value: "su", label: "su" },
            { value: "mo", label: "mo" },
            { value: "tu", label: "tu" },
            { value: "we", label: "we" },
            { value: "th", label: "th" },
            { value: "fr", label: "fr" },
          ],
        },

        { name: "wifiName", placeholder: "wifi Name", type: "text" },
        {
          name: "wifiPassword",
          placeholder: "wifi Password",
          type: "text",
        },
        {
          name: "address",
          placeholder: "Address",
          type: "text",
        },
        // {
        //   name: "restaurantId",
        //   label: "restaurant",
        //   type: "select",
        //   options: [{ value: "2", label: "nisantasi" }],
        //   placeholder: "Select restaurant",
        //   defaultValue: 2,
        // },
        { name: "cover", placeholder: "Cover", type: "file" },
        // { name: "map_location", placeholder: "Map location", type: "map" },
      ],
    },

    extraInfoFields: [
      { key: "daysOff", label: "Days Off" },
      { key: "wifiName", label: "WiFi Name" },
      { key: "wifiPassword", label: "WiFi Password" },
      {
        key: "open",
        label: (
          <>
            Open <span style={{ marginRight: "2px" }}></span>(From - To)
          </>
        ),
      },
    ],
  },
  sections: {
    form: {
      title: "Section",
      fields: [
        {
          name: "preparationTime",
          label: "Preparation Time",
          type: "number",
          placeholder: "Preparation time in minutes",
        },
        {
          name: "servedFrom",
          label: "Served From",
          type: "time",
          placeholder: "Served from time",
        },
        {
          name: "servedTo",
          label: "Served To",
          type: "time",
          placeholder: "Served to time",
        },

        // {
        //   name: "status",
        //   label: "Status",
        //   type: "select",
        //   options: [
        //     { value: "2", label: "Active" },
        //     { value: "3", label: "Inactive" },
        //   ],
        //   placeholder: "Select status",
        //   defaultValue: "2",
        // },
        { name: "coverSection", placeholder: "Cover", type: "file" },
      ],
    },
  },
  items: {
    form: {
      title: "Item",
      fields: [
        {
          name: "preparationTime",
          label: "Preparation Time",
          type: "number",
          placeholder: "Preparation time in minutes",
        },
        {
          name: "servedFrom",
          label: "Served From",
          type: "time",
          placeholder: "Served from time",
        },
        {
          name: "servedTo",
          label: "Served To",
          type: "time",
          placeholder: "Served to time",
        },

        // {
        //   name: "status",
        //   label: "Status",
        //   type: "select",
        //   options: [
        //     { value: "2", label: "Active" },
        //     { value: "3", label: "Inactive" },
        //   ],
        //   placeholder: "Select status",
        //   defaultValue: "2",
        // },
        { name: "featured", placeholder: "Featured image", type: "file" },
        { name: "media", placeholder: "media", type: "file" },
        // { name: "videos", placeholder: "Videos", type: "file" },
      ],
    },
  },
  IngredientWarnings: {
    title: "Ingredient Warnings",
    titleButton: "ingredient-warning",

    table: {
      columns: [
        { key: "name", label: "Name" },
        { key: "phone", label: "Phone" },
        {
          key: "status",
          label: "Status",
          render: (item) => item.status?.name || "N/A",
        },

        { key: "open", label: "From - To" },
        // { key: "cover", label: "Cover Photo" },
        { key: "actions", label: "Actions" },
      ],
    },
    form: {
      title: "Ingredient Warnings",
      fields: [{ name: "cover", placeholder: "Add icon", type: "file" }],
    },

    extraInfoFields: [
      { key: "daysOff", label: "Days Off" },
      { key: "wifiName", label: "WiFi Name" },
      { key: "wifiPassword", label: "WiFi Password" },
    ],
  },
  languages: {
    title: "Languages",
    titleButton: "languages",

    table: {
      columns: [
        { key: "name", label: "Name" },
        { key: "code", label: "Code" },
        { key: "dir", label: "Direction" },
        // { key: "flag", label: "flag" },
        {
          key: "status",
          label: "Status",
          render: (item) => item.status?.name || "N/A",
        },
        { key: "actions", label: "Actions" },
      ],
    },
    form: {
      title: "Language",
      fields: [
        { name: "code", placeholder: "code", type: "text" },

        { name: "cover", placeholder: "Add icon", type: "file" },
      ],
    },

    extraInfoFields: [],
  },
  currencies: {
    title: "Currencies",
    titleButton: "currency",

    table: {
      columns: [
        { key: "name", label: "Name" },
        { key: "symbol", label: "Symbol" },
        { key: "code", label: "Code" },

        {
          key: "status",
          label: "Status",
          render: (item) => item.status?.name || "N/A",
        },
        { key: "actions", label: "Actions" },
      ],
    },
    form: {
      title: "currency",
      fields: [
        { name: "code", placeholder: "code", type: "text" },
        { name: "symbol", placeholder: "symbol", type: "text" },

        // { name: "cover", placeholder: "Add icon", type: "file" },
      ],
    },

    // extraInfoFields: [
    //   { key: "daysOff", label: "Days Off" },
    //   { key: "wifiName", label: "WiFi Name" },
    //   { key: "wifiPassword", label: "WiFi Password" },
    // ],
  },
};
export default dataStructure;
