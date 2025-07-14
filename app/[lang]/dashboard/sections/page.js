"use client";
import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/CardSections";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "@/app/[lang]/dashboard/menus/index.css";
import { useSelector, useDispatch } from "react-redux";
// import { fetchSections, deleteSection } from "@/store/slices/sectionsSlice";
// import { updateStatus, deleteItem } from "@/api/apiService";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import TaskHeader from "@/app/[lang]/dashboard/menus/task-header.jsx";
import { getDictionary } from "@/app/dictionaries.js";
import "@/app/[lang]/dashboard/items/main.css";
// import { saveArrangement } from "./apiSections.jsx";
import ReactPaginate from "react-paginate";
// import Dash from "@/app/[lang]/dashboard/DashboardPageView";
import { sections } from "./sectionArray";
import useTranslate from "@/hooks/useTranslate";
import useApplyFiltersAndSort from "../../components/hooks/useApplyFiltersAndSort";
const Sections = ({ params: { lang } }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { trans } = useTranslate(lang);
  const {
    applyFiltersAndSort,
    filteredMenu,
    setFilteredMenu,
    searchTerm,
    setSearchTerm,
    sortOption,
    setSortOption,
    filterOption,
    setFilterOption,
    pageSize,
    setPageSize,
  } = useApplyFiltersAndSort(sections);
  const [filteredSections, setFilteredSections] = useState([]);
  // const [searchTerm, setSearchTerm] = useState("");
  // const [sortOption, setSortOption] = useState("");
  // const [arrangement, setArrangement] = useState([]);
  // const [filterOption, setFilterOption] = useState("");
  // const [pageSize, setPageSize] = useState("10");
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const itemsCount = filteredSections?.length;
  const [isLoadingStatus, setIsLoadingStauts] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [localStatuses, setLocalStatuses] = useState({});
  const language =
    typeof window !== "undefined" ? localStorage.getItem("language") : null;
  const itemsPerPage =
    pageSize === "all" ? filteredSections.length : parseInt(pageSize);

  const ACTIVE_STATUS_ID = 2;
  const INACTIVE_STATUS_ID = 3;

  useEffect(() => {
    let updatedSections = sections;

    if (filterOption === "active") {
      updatedSections = updatedSections.filter(
        (section) => section?.status?.id === ACTIVE_STATUS_ID
      );
    } else if (filterOption === "inactive") {
      updatedSections = updatedSections.filter(
        (section) => section?.status?.id === INACTIVE_STATUS_ID
      );
    }

    setFilteredSections(updatedSections);
  }, [sections, filterOption]);
  const truncateDescription = (description, maxLength = 50) => {
    // console.log("Description received:", description);
    if (!description) return "";
    return description.length > maxLength
      ? description.slice(0, maxLength) + "..."
      : description;
  };

  const handleViewEdit = () => {
    console.log("View/Edit clicked");
  };

  const handleDelete = () => {
    console.log("Delete clicked");
  };

  const handleToggleActive = (checked, sectionId) => {
    setLocalStatuses((prev) => ({
      ...prev,
      [sectionId]: checked,
    }));
  };
  const getStatus = (section) => {
    // لو المستخدم غيّر السويتش، نستخدم القيمة اللي في localStatuses
    if (section.id in localStatuses) return localStatuses[section.id];
    // وإلا نرجع القيمة الأصلية من الـ API
    return !!section.status;
  };
  const handleEnter = (sectionId) => {
    router.push(`/${lang}/dashboard/section/${sectionId}`);
  };

  const handleDragStart = (e, localIndex) => {
    const actualIndex = offset + localIndex; //  index الحقيقي من filteredSections
    setDraggedIndex(actualIndex);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === index) return;
  };
  const handleDrop = (e, dropIndex) => {
    e.preventDefault();

    // نسخ filteredSections لعدم التلاعب بالـ state مباشرة
    const reorderedSections = [...filteredSections];

    // سحب العنصر الذي تم سحبه من مكانه القديم
    const [draggedItem] = reorderedSections.splice(draggedIndex, 1);

    // إدخال العنصر في المكان الجديد
    reorderedSections.splice(dropIndex, 0, draggedItem);

    // تحديث filteredSections في الـ state
    setFilteredSections(reorderedSections);
    setDraggedIndex(null);

    // حساب الترتيب الجديد بناءً على filteredSections
    const arrangement = reorderedSections.map((_, index) => index + 1);

    // إظهار الترتيب الجديد في الكونسول
    // console.log("Updated Arrangement:", arrangement);

    // تعريف الـ ids بناءً على العناصر
    const ids = reorderedSections.map((section) => section.id); // هنا نحصل على الـ ids من العناصر المعدلة

    // إظهار الـ IDs في الترتيب الجديد
    const updatedIds = arrangement.map((index) => ids[index - 1]);

    // console.log("Updated IDs:", updatedIds);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };
  const pageCount = Math.ceil(filteredSections?.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredSections?.slice(offset, offset + itemsPerPage);

  const getVisiblePages = (currentPage, pageCount) => {
    const pages = [];

    if (pageCount <= 5) {
      return Array.from({ length: pageCount }, (_, i) => i);
    }

    pages.push(0); // always show first page

    if (currentPage > 2) {
      pages.push("start-ellipsis"); // ...
    }

    if (currentPage > 1 && currentPage < pageCount - 2) {
      pages.push(currentPage - 1);
      pages.push(currentPage);
      pages.push(currentPage + 1);
    } else if (currentPage <= 1) {
      pages.push(1);
      pages.push(2);
    } else if (currentPage >= pageCount - 2) {
      pages.push(pageCount - 3);
      pages.push(pageCount - 2);
    }

    if (currentPage < pageCount - 3) {
      pages.push("end-ellipsis"); // ...
    }

    pages.push(pageCount - 1); // always show last page

    return pages;
  };

  //  edit & view
  const handleNavigate = (sectionId) => {
    router.push(`/${lang}/dashboard/section/${sectionId}/view`);
  };
  const visiblePages = getVisiblePages(currentPage, pageCount);
  if (!filteredSections) {
    return <div>Loading...</div>;
  }
  return (
    <Card className="gap-6 p-4">
      <div>
        <TaskHeader
          onSearch={(term) => setSearchTerm(term)}
          onSort={(option) => setSortOption(option)}
          onFilterChange={(option) => setFilterOption(option)}
          onPageSizeChange={(value) => setPageSize(value)}
          pageSize={pageSize}
          createButtonText={trans?.button?.section}
          // searchPlaceholder={trans?.sectionsItems.searchSections}
          pageType="sections"
          createTargetName="Section"
          createTargetPath="section"
          filters={[
            { value: "active", label: trans?.sectionsItems?.active },
            { value: "inactive", label: trans?.sectionsItems?.inactive },
            { value: "have_image", label: trans?.sectionsItems?.haveImage },
            { value: "all", label: trans?.sectionsItems?.all },
          ]}
          trans={trans}
          // arrange={true}
          isLoading={isLoading}
          itemsCount={itemsCount}
        />
      </div>

      {/* Check for loading state first */}
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-center text-gray-500 py-10">Loading...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-center text-gray-500 py-10">
            Error loading sections
          </p>
        </div>
      ) : Array.isArray(currentItems) && currentItems.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {currentItems.map((section, index) => (
            <div
              key={section.id}
              className={`card bg-popover ${
                draggedIndex === index ? "opacity-50" : ""
              }`}
            >
              <CardHeader
                imageUrl={section.image}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
              />

              <CardContent
                sectionName={section?.name}
                description={truncateDescription(section?.description, 80)}
                isActive={getStatus(section)}
                onToggleActive={(checked) =>
                  handleToggleActive(checked, section.id)
                }
                isSection={true}
                className="card-content"
                trans={trans}
                deletedAt={section?.actions?.deletedAt}
              />
              <CardFooter
                sectionName={section?.name}
                onViewEdit={() => handleNavigate(section.id)}
                onDelete={() => handleDeleteSection(section.id)}
                onEnter={() => handleEnter(section.id)}
                isActive={section?.status?.id === ACTIVE_STATUS_ID}
                onToggleActive={(checked) =>
                  handleToggleActive(checked, section.id, section.status?.id)
                }
                isDefault={false}
                isSection={true}
                trans={trans}
                isLoading={isLoadingStatus}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-center text-gray-500 py-10">
            No sections to display
          </p>
        </div>
      )}
      {pageCount > 1 && currentItems && !isLoading && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage((prev) => Math.max(prev - 1, 0));
                }}
              />
            </PaginationItem>

            {visiblePages.map((page, index) => (
              <PaginationItem key={index}>
                {page === "start-ellipsis" || page === "end-ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href="#"
                    isActive={page === currentPage}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(page);
                    }}
                  >
                    {page + 1}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage((prev) => Math.min(prev + 1, pageCount - 1));
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </Card>
  );
};

export default Sections;
