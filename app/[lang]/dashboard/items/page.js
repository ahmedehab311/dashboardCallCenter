"use client";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardFooter } from  "@/components/ui/CardSections";
import { useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Items = () => {
 const router = useRouter();
  const language =
    typeof window !== "undefined" ? localStorage.getItem("language") : null;
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;

  // بيانات وهمية
  const mockItems = [
      {
      id: 1,
      imageUrl: "/item1.jpg",
      itemName: "111",
      description: "وصف القسم الأول هنا",
      isActive: true,
      itemItems: [],
    },
    {
      id: 2,
      imageUrl: "/item2.jpg",
      itemName:"2222",
      description: "وصف القسم الثاني هنا",
      isActive: false,
      itemItems: [],
    },
    {
      id: 3,
      imageUrl: "/item3.jpg",
      itemName: "3333",
      description: "وصف القسم الثالث هنا",
      isActive: true,
      itemItems: [],
    },
    {
        id: 114,
        imageUrl: "/item3.jpg",
      itemName: "4444",
      description: "وصف القسم الأول هنا",
      isActive: true,
      itemItems: [],
    },
    {
      id: 214,
      imageUrl: "/item2.jpg",
      itemName:"555",
      description: "وصف القسم الثاني هنا",
      isActive: false,
      itemItems: [],
    },
    {
      id: 3144,
      imageUrl: "/item3.jpg",
      itemName: "666",
      description: "وصف القسم الثالث هنا",
      isActive: true,
      itemItems: [],
    },
      {
      id: 141,
      imageUrl: "/item1.jpg",
      itemName:"777",
      description: "وصف القسم الأول هنا",
      isActive: true,
      itemItems: [],
    },
    {
      id: 142,
      imageUrl: "/item2.jpg",
      itemName: "8888",
      description: "وصف القسم الثاني هنا",
      isActive: false,
      itemItems: [],
    },
    {
      id: 1431,
      imageUrl: "/item3.jpg",
      itemName: "999",
      description: "وصف القسم الثالث هنا",
      isActive: true,
      itemItems: [],
    },
    {
      id: 10143,
      imageUrl: "/item3.jpg",
      itemName: "القسم الثالث",
      description: "وصف القسم الثالث هنا",
      isActive: true,
      itemItems: [],
    },
    {
      id: 1413,
      imageUrl: "/item3.jpg",
      itemName: "القسم الثالث",
      description: "وصف القسم الثالث هنا",
      isActive: true,
      itemItems: [],
    },
      {
      id: 1,
      imageUrl: "/item1.jpg",
      itemName: "القسم الأول",
      description: "وصف القسم الأول هنا",
      isActive: true,
      itemItems: [],
    },
    {
      id: 2,
      imageUrl: "/item2.jpg",
      itemName: "القسم الثاني",
      description: "وصف القسم الثاني هنا",
      isActive: false,
      itemItems: [],
    },
    {
      id: 3,
      imageUrl: "/item3.jpg",
      itemName: "القسم الثالث",
      description: "وصف القسم الثالث هنا",
      isActive: true,
      itemItems: [],
    },
    {
      id: 4,
      imageUrl: "/item4.jpg",
      itemName: "القسم الرابع",
      description: "وصف القسم الرابع هنا",
      isActive: true,
      itemItems: [],
    },
    {
      id: 5,
      imageUrl: "/item5.jpg",
      itemName: "القسم الخامس",
      description: "وصف القسم الخامس هنا",
      isActive: false,
      itemItems: [],
    },
    {
      id: 6,
      imageUrl: "/item6.jpg",
      itemName: "القسم السادس",
      description: "وصف القسم السادس هنا",
      isActive: true,
      itemItems: [],
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // حساب البيانات للصفحة الحالية
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = mockItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(mockItems.length / itemsPerPage);

  // دوال معالجة الأحداث
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // دوال معالجة الأحداث
  const handleViewEdit = (id) => {
    router.push(`/items/edit/${id}`);
  };

  const handleDelete = (id) => {
    console.log("Delete item with id:", id);
    // هنا سيتم استدعاء API للحذف
  };

  const handleToggleActive = (id, checked) => {
    console.log(`Toggle section ${id} to ${checked}`);
    // هنا سيتم استدعاء API لتحديث الحالة
  };

  const handleEnterItem = (itemId) => {
   router.push(`/${language}/dashboard/condiments`);
    // للتنقل للقسم الفرعي
  };

  const trans = {
    delete: "حذف",
    viewEdit: "عرض/تعديل",
    view: "الدخول",
    active: "نشط",
    inactive: "غير نشط",
  };
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Items</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentItems.map((item) => (
       <Card key={item.id} className="border rounded-lg overflow-hidden shadow-md">
            <CardHeader
              imageUrl={item.imageUrl}
              title={item.itemName}
            />
            
            <CardContent
              sectionName={item.itemName}
              description={item.description}
              isActive={item.isActive}
              trans={trans}
              isitem={true}
            />
            
            <CardFooter
              sectionNamev={item.itemName}
              itemItems={item.itemItems}
              onViewEdit={() => handleViewEdit(item.id)}
              onDelete={() => handleDelete(item.id)}
              onEnter={handleEnterItem}
              isitem={true}
              isActive={item.isActive}
              onToggleActive={(checked) => handleToggleActive(item.id, checked)}
              trans={trans}
            />
          </Card>
        ))}
      </div>

      {/* Pagination باستخدام المكون الجاهز */}
      <div className="mt-8 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={handlePrev}
                isActive={currentPage > 1}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => handlePageChange(page)}
                  isActive={page === currentPage}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={handleNext}
                isActive={currentPage < totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default Items;
