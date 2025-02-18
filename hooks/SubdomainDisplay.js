// SubdomainDisplay.js
import { useSubdomin } from "@/provider/SubdomainContext";

const SubdomainDisplay = () => {
  const subdomain = useSubdomin();

  return <div>Subdomain: {subdomain || "No subdomain"}</div>;
};

export default SubdomainDisplay;
