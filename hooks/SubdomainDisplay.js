// SubdomainDisplay.js
import { useSubdomin } from "@/provider/SubdomainContext";

const SubdomainDisplay = () => {
  const { subdomain, apiBaseUrl } = useSubdomin(); 
  return (
<>
<div className="bg-black text-white">
     subdomain: {subdomain}
    </div>
    <div>
    apiBaseUrl: {apiBaseUrl}
    </div>
</>
  )

};

export default SubdomainDisplay;
