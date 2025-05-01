import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useState } from "react";

function Test() {
  const [search, setSearch] = useState("");
  const [userSelected, setUserSelect] = useState(null);
  const users = [
    {
      name: "Ahmed",
      phone: "010147665",
      ordersCount: 0,
      points: 0,
      addresses: [
        {
          type: "Home",
          details:
            "44, 123, - Elkhalifa Elmaamon - Cairo, building: 44 - floor: 46 - apartment: 446",
        },
        {
          type: "Work",
          details:
            "22, Street Name - Nasr City, building: 12 - floor: 3 - office: 5",
        },
      ],
    },
    {
      name: "alaa",
      phone: "1234",
      ordersCount: 3,
      points: 10,
      addresses: [
        {
          type: "Home",
          details: "50, Road X - Giza, building: 7 - floor: 2 - apartment: 8",
        },
        {
          type: "Home",
          details: "50, Road X - Giza, building: 7 - floor: 2 - apartment: 8",
        },
        {
          type: "Home",
          details: "50, Road X - Giza, building: 7 - floor: 2 - apartment: 8",
        },
        {
          type: "Home",
          details: "50, Road X - Giza, building: 7 - floor: 2 - apartment: 8",
        },
      ],
    },
    {
      name: "Omar",
      phone: "010987654",
      ordersCount: 3,
      points: 10,
      addresses: [
        {
          type: "Home",
          details: "50, Road X - Giza, building: 7 - floor: 2 - apartment: 8",
        },
      ],
    },
  ];
  const handleSearch = () => {
    const foundUser = users.find((user) => user.phone === search);
    setUserSelect(foundUser || null);
  };
  return (
    <div className="flex gap-1 items-center justify-between mb-3">
      <div className="relative flex-grow">
        <span className="absolute top-1/2 -translate-y-1/2 left-2">
          <Search className="w-4 h-4 text-gray-500" />
        </span>
        <Input
          type="text"
          placeholder="Enter phone number"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-7 w-full"
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={handleSearch}>Search</Button>
        <Button>Clear</Button>
      </div>

      {userSelected && (
        <div>
          <h3>{userSelected.name}</h3>
        </div>
      )}
    </div>
  );
}

export default Test;
