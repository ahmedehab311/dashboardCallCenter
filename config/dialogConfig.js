// const dialogConfig = {
//   add: {
//     title: "Add Item/Section",
//     description: "Please fill in the details to add a new item or section.",
//     fields: [
//       { name: "name", label: "Name", type: "text", placeholder: "Enter name" },
//       {
//         name: "description",
//         label: "Description",
//         type: "textarea",
//         placeholder: "Enter description",
//       },
//     ],
//     actionText: "Add",
//   },
//   edit: {
//     title: "Edit Item/Section",
//     description: "You can modify the details of the selected item or section.",
//     fields: [
//       { name: "name", label: "Name", type: "text", placeholder: "Edit name" },
//       {
//         name: "description",
//         label: "Description",
//         type: "textarea",
//         placeholder: "Edit description",
//       },
//     ],
//     actionText: "Save",
//   },
//   delete: {
//     title: "Delete Item/Section",
//     description:
//       "Are you sure you want to delete this? This action cannot be undone.",
//     actionText: "Delete",
//   },
// };
// export default dialogConfig;
// dialogConfig.js

const dialogConfig = {
  sections: {
    title: "Add Section",
    description: "Please provide the details to add a new section.",
    actionText: "Add Section",
    fields: [
      {
        name: "name_en",
        label: "Section Name (English)",
        type: "text",
        placeholder: "Enter section name in English",
        required: true,
      },
      {
        name: "name_ar",
        label: "Section Name (Arabic)",
        type: "text",
        placeholder: "Enter section name in Arabic",
      },
      {
        name: "description_en",
        label: "Section Description (English)",
        type: "textarea",
        placeholder: "Enter section description in English",
      },
      {
        name: "description_ar",
        label: "Section Description (Arabic)",
        type: "textarea",
        placeholder: "Enter section description in Arabic",
      },
      {
        name: "preparationTime",
        label: "Preparation Time",
        type: "number",
        placeholder: "Enter preparation time in minutes",
        max: 60,
      },
      {
        name: "servedFrom",
        label: "Served From",
        type: "time",
        placeholder: "Enter served from time",
      },
      {
        name: "servedTo",
        label: "Served To",
        type: "time",
        placeholder: "Enter served to time",
      },
      {
        name: "servedText_en",
        label: "Served Text (English)",
        type: "text",
        placeholder: "Enter served text in English",
      },
      {
        name: "servedText_ar",
        label: "Served Text (Arabic)",
        type: "text",
        placeholder: "Enter served text in Arabic",
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: [
          { value: "2", label: "Active" },
          { value: "3", label: "Inactive" },
        ],
        placeholder: "Select status",
        defaultValue: "2", 
      },
    ],
  },
  items: {
    title: "Add Item",
    description: "Please provide the details to add a new item.",
    actionText: "Add Item",
    fields: [
      {
        name: "itemName",
        label: "Item Name",
        type: "text",
        placeholder: "Enter item name",
      },
      {
        name: "sectionDescription",
        label: "Section Description",
        type: "textarea",
        placeholder: "Enter description",
      },
      {
        name: "itemPhoto",
        label: "Item Photo",
        type: "file",
        placeholder: "Enter section Photo",
      },
      {
        name: "itemActive",
        label: "Item Active",
        type: "select",
        options: [
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
        ],
        placeholder: "Enter Item Active",
      },
    ],
  },
  delete: {
    title: "Delete Item/Section",
    description: "Are you sure you want to delete this item or section?",
    actionText: "Delete",
  },
};

export default dialogConfig;
