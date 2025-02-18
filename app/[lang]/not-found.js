import React from "react";
import Link from "next/link";
//import ErrorBlock from "@/components/error-block";

const PageNotFound = () => {
  return (
    <div>
      Page not found. <Link href="/">Go back to Home</Link>
    </div>
  );
};

export default PageNotFound;
