import { Button } from "@/components/ui/button";
import React from "react";

function EditAndViewButton({ label, onEditChange }) {
  return (
    <div className="flex items-end justify-end">
      <Button type="submit" onClick={onEditChange}>
        {label}
      </Button>
    </div>
  );
}

export default EditAndViewButton;
