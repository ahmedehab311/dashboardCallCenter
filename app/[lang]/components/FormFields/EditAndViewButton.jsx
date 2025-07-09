import { Button } from "@/components/ui/button";
import React from "react";

function EditAndViewButton({ label, onEditChange, isEditing }) {
  return (
    <div className="flex items-end justify-end">
      <Button type="submit" onClick={onEditChange}>
        {isEditing ? "Edit" : "View"}
      </Button>
    </div>
  );
}

export default EditAndViewButton;
