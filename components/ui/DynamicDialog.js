import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import dialogConfig from "@/config/dialogConfig";

const DynamicDialog = ({ type, data, onConfirm, onCancel }) => {
  const config = dialogConfig[type];

  // console.log("config", config);

  if (!config) {
    return <p>Error: Invalid dialog type</p>;
  }

  return (
    <AlertDialog id="alertDialog">
      <AlertDialogTrigger asChild>
        <button style={{ display: "none" }}></button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{config.title}</AlertDialogTitle>
          {config.description && (
            <AlertDialogDescription>
              {config.description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>

        {type !== "delete" && (
          <form>
            {config.fields?.map((field) => (
              <div key={field.name} className="mb-4">
                <label htmlFor={field.name} className="block font-medium">
                  {field.label}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    id={field.name}
                    placeholder={field.placeholder}
                    defaultValue={data?.[field.name]}
                    className="w-full border rounded p-2"
                  />
                ) : (
                  <input
                    id={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    defaultValue={data?.[field.name]}
                    className="w-full border rounded p-2"
                  />
                )}
              </div>
            ))}
          </form>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={`bg-${
              type === "delete" ? "red" : "blue"
            }-500 text-white`}
            onClick={onConfirm}
          >
            {config.actionText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DynamicDialog;
