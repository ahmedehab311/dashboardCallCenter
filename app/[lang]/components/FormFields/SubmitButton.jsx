import { Button } from "@/components/ui/button";
import React from "react";

function SubmitButton({ label, isEditing }) {
  return (
    <Button type="submit" disabled={isEditing}>
      {label}
    </Button>
  );
}

export default SubmitButton;
