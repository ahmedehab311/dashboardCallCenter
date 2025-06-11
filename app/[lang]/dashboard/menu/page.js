"use client";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/CardSections";
import Image from "next/image";
import { useRouter } from "next/navigation";
const Menu = () => {
    const router = useRouter();
      const language =
    typeof window !== "undefined" ? localStorage.getItem("language") : null;
  const mockSection = {
    id: 1,
    imageUrl: "/placeholder-image.jpg",
    sectionName: "Happyjoes",
    description: "Happyjoes",
    isActive: true,
    sectionItems: [],
  };

  const handleViewEdit = () => {
    console.log("View/Edit clicked");
  };

  const handleDelete = () => {
    console.log("Delete clicked");
  };

  const handleToggleActive = (checked) => {
    console.log("Toggle active:", checked);
  };

  const handleEnterSection = (itemId) => {
    router.push(`/${language}/dashboard/sections`);
  };
  const trans = {
    delete: "حذف",
    viewEdit: "عرض/تعديل",
    view: "الدخول",
    active: "نشط",
    inactive: "غير نشط",
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <Card className="border rounded-lg overflow-hidden shadow-md">
        <CardHeader
          imageUrl={mockSection.imageUrl}
          title={mockSection.sectionName}
        />

        <CardContent
          sectionName={mockSection.sectionName}
          description={mockSection.description}
          isActive={mockSection.isActive}
          trans={trans}
          isSection={true}
        />

        <CardFooter
          sectionName={mockSection.sectionName}
          sectionItems={mockSection.sectionItems}
          onViewEdit={handleViewEdit}
          onDelete={handleDelete}
          onEnter={handleEnterSection}
          isSection={true}
          isActive={mockSection.isActive}
          onToggleActive={handleToggleActive}
          trans={trans}
        />
      </Card>
    </div>
  );
};

export default Menu;
