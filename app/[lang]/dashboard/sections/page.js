"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/CardSections";
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

const Sections = () => {
  const router = useRouter();
  const language =
    typeof window !== "undefined" ? localStorage.getItem("language") : null;
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;


  const mockSections = [
    {
      id: 1,
      imageUrl: "/section1.jpg",
      sectionName: "111",
      description: "وصف القسم الأول هنا",
      isActive: true,
      sectionItems: [],
    },
    {
      id: 2,
      imageUrl: "/section2.jpg",
      sectionName: "2222",
      description: "وصف القسم الثاني هنا",
      isActive: false,
      sectionItems: [],
    },
    {
      id: 3,
      imageUrl: "/section3.jpg",
      sectionName: "3333",
      description: "وصف القسم الثالث هنا",
      isActive: true,
      sectionItems: [],
    },
    {
      id: 114,
      imageUrl: "/section3.jpg",
      sectionName: "4444",
      description: "وصف القسم الأول هنا",
      isActive: true,
      sectionItems: [],
    },
    {
      id: 214,
      imageUrl: "/section2.jpg",
      sectionName: "555",
      description: "وصف القسم الثاني هنا",
      isActive: false,
      sectionItems: [],
    },
    {
      id: 3144,
      imageUrl: "/section3.jpg",
      sectionName: "666",
      description: "وصف القسم الثالث هنا",
      isActive: true,
      sectionItems: [],
    },
    {
      id: 141,
      imageUrl: "/section1.jpg",
      sectionName: "777",
      description: "وصف القسم الأول هنا",
      isActive: true,
      sectionItems: [],
    },
    {
      id: 142,
      imageUrl: "/section2.jpg",
      sectionName: "8888",
      description: "وصف القسم الثاني هنا",
      isActive: false,
      sectionItems: [],
    },
    {
      id: 1431,
      imageUrl: "/section3.jpg",
      sectionName: "999",
      description: "وصف القسم الثالث هنا",
      isActive: true,
      sectionItems: [],
    },
    {
      id: 10143,
      imageUrl: "/section3.jpg",
      sectionName: "القسم الثالث",
      description: "وصف القسم الثالث هنا",
      isActive: true,
      sectionItems: [],
    },
    {
      id: 1413,
      imageUrl: "/section3.jpg",
      sectionName: "القسم الثالث",
      description: "وصف القسم الثالث هنا",
      isActive: true,
      sectionItems: [],
    },
    {
      id: 1,
      imageUrl: "/section1.jpg",
      sectionName: "القسم الأول",
      description: "وصف القسم الأول هنا",
      isActive: true,
      sectionItems: [],
    },
    {
      id: 2,
      imageUrl: "/section2.jpg",
      sectionName: "القسم الثاني",
      description: "وصف القسم الثاني هنا",
      isActive: false,
      sectionItems: [],
    },
    {
      id: 3,
      imageUrl: "/section3.jpg",
      sectionName: "القسم الثالث",
      description: "وصف القسم الثالث هنا",
      isActive: true,
      sectionItems: [],
    },
    {
      id: 4,
      imageUrl: "/section4.jpg",
      sectionName: "القسم الرابع",
      description: "وصف القسم الرابع هنا",
      isActive: true,
      sectionItems: [],
    },
    {
      id: 5,
      imageUrl: "/section5.jpg",
      sectionName: "القسم الخامس",
      description: "وصف القسم الخامس هنا",
      isActive: false,
      sectionItems: [],
    },
    {
      id: 6,
      imageUrl: "/section6.jpg",
      sectionName: "القسم السادس",
      description: "وصف القسم السادس هنا",
      isActive: true,
      sectionItems: [],
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
  const currentItems = mockSections.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(mockSections.length / itemsPerPage);

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
    router.push(`/sections/edit/${id}`);
  };

  const handleDelete = (id) => {
    console.log("Delete section with id:", id);
    // هنا سيتم استدعاء API للحذف
  };

  const handleToggleActive = (id, checked) => {
    console.log(`Toggle section ${id} to ${checked}`);
    // هنا سيتم استدعاء API لتحديث الحالة
  };

  const handleEnterSection = (items) => {
    router.push(`/${language}/dashboard/items`);
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
      <h1 className="text-2xl font-bold mb-6 text-center">sections</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentItems.map((section) => (
          <Card
            key={section.id}
            className="border rounded-lg overflow-hidden shadow-md"
          >
            <CardHeader
              imageUrl={section.imageUrl}
              title={section.sectionName}
            />

            <CardContent
              sectionName={section.sectionName}
              description={section.description}
              isActive={section.isActive}
              trans={trans}
              isSection={true}
            />

            <CardFooter
              sectionName={section.sectionName}
              sectionItems={section.sectionItems}
              onViewEdit={() => handleViewEdit(section.id)}
              onDelete={() => handleDelete(section.id)}
              onEnter={handleEnterSection}
              isSection={true}
              isActive={section.isActive}
              onToggleActive={(checked) =>
                handleToggleActive(section.id, checked)
              }
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

export default Sections;
