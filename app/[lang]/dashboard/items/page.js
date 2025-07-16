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
import { sections } from "../sections/apisSection";
const Items = ({ params: { lang } }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [trans, setTrans] = useState(null);
  const [filteredItem, setFilteredItem] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [arrangement, setArrangement] = useState([]);
  const [filterOption, setFilterOption] = useState("");
  const [pageSize, setPageSize] = useState("10");
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const itemsCount = filteredItem?.length;
  const [isLoadingStatus, setIsLoadingStauts] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const language =
    typeof window !== "undefined" ? localStorage.getItem("language") : null;
  const itemsPerPage =
    pageSize === "all" ? filteredItem.length : parseInt(pageSize);

  const [allItems, setAllItems] = useState([]);
  console.log("allItems", allItems);
  console.log("filteredItem", filteredItem);

  useEffect(() => {
    const items = sections.flatMap(
      (section) =>
        section.items?.map((item) => ({
          ...item,
          sectionName: section.name, // لو عايز تحتفظ باسم القسم مع كل item
        })) || []
    );
    setAllItems(items);
    setFilteredItem(items); // أول تحميل فقط
  }, []);
  // console.log("sections", filteredItem);
  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const dictionary = await getDictionary(lang);
        setTrans(dictionary);
      } catch (error) {
        console.error("Error fetching dictionary:", error);
      }
    };

    fetchTranslations();
  }, [lang]);
  const applyFiltersAndSort = () => {
    let updatedItem = [...allItems];

    // search
    if (searchTerm) {
      updatedItem = updatedItem.filter(
        (section) =>
          section.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
          section?.description
            ?.toLowerCase()
            ?.includes(searchTerm.toLowerCase())
      );
    }

    // filter
    if (filterOption === "active") {
      updatedItem = updatedItem.filter(
        (section) => section?.status?.name === "active"
      );
    } else if (filterOption === "inactive") {
      updatedItem = updatedItem.filter(
        (section) => section?.status?.name === "inactive"
      );
    } else if (filterOption === "have_image") {
      updatedItem = updatedItem.filter((section) => section.imageUrl);
    }

    // arang
    if (sortOption === "alphabetical") {
      updatedItem.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "recent") {
      updatedItem.sort((a, b) => b.id - a.id);
    } else if (sortOption === "old") {
      updatedItem.sort((a, b) => a.id - b.id);
    }
    // pagenation
    // if (pageSize !== "all") {
    //   const size = parseInt(pageSize, 10);
    //   updatedItem = updatedItem.slice(0, size);
    // }

    setFilteredItem(updatedItem);
  };

  useEffect(() => {
    applyFiltersAndSort();
  }, [searchTerm, sortOption, filterOption, pageSize, allItems]);
  const ACTIVE_STATUS_ID = 2;
  const INACTIVE_STATUS_ID = 3;

  useEffect(() => {
    let updatedItems = filteredItem;

    if (filterOption === "active") {
      updatedItems = updatedItems.filter(
        (item) => item?.status?.id === ACTIVE_STATUS_ID
      );
    } else if (filterOption === "inactive") {
      updatedItems = updatedItems.filter(
        (item) => item?.status?.id === INACTIVE_STATUS_ID
      );
    }

    setFilteredItem(updatedItems);
  }, [filteredItem, filterOption]);
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

  const handleToggleActive = (checked) => {
    console.log("Toggle active:", checked);
  };

  const handleEnter = (sectionId) => {
    router.push(`/${lang}/dashboard/items`);
  };

  const handleDragStart = (e, localIndex) => {
    const actualIndex = offset + localIndex; //  index الحقيقي من filteredItem
    setDraggedIndex(actualIndex);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === index) return;
  };
  const handleDrop = (e, dropIndex) => {
    e.preventDefault();

    // نسخ filteredItem لعدم التلاعب بالـ state مباشرة
    const reorderedItems = [...filteredItem];

    // سحب العنصر الذي تم سحبه من مكانه القديم
    const [draggedItem] = reorderedItems.splice(draggedIndex, 1);

    // إدخال العنصر في المكان الجديد
    reorderedItems.splice(dropIndex, 0, draggedItem);

    // تحديث filteredItem في الـ state
    setFilteredItem(reorderedItems);
    setDraggedIndex(null);

    // حساب الترتيب الجديد بناءً على filteredItem
    const arrangement = reorderedItems.map((_, index) => index + 1);

    // إظهار الترتيب الجديد في الكونسول
    // console.log("Updated Arrangement:", arrangement);

    // تعريف الـ ids بناءً على العناصر
    const ids = reorderedItems.map((section) => section.id); // هنا نحصل على الـ ids من العناصر المعدلة

    // إظهار الـ IDs في الترتيب الجديد
    const updatedIds = arrangement.map((index) => ids[index - 1]);

    // console.log("Updated IDs:", updatedIds);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };
  const pageCount = Math.ceil(filteredItem?.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredItem?.slice(offset, offset + itemsPerPage);

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
  const handleNavigate = (itemId) => {
    router.push(`/${lang}/dashboard/item/${itemId}/view`);
  };
  const visiblePages = getVisiblePages(currentPage, pageCount);
  if (!filteredItem) {
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
          createButtonText={trans?.button?.item}
          // searchPlaceholder={trans?.sectionsItems.searchSections}
          pageType="items"
          pageTypeLabel="items"
          createTargetName="Item"
          createTargetPath="item"
          // itemsCount={itemsCount}
          // filters={[
          //   { value: "active", label: "Active" },
          //   { value: "inactive", label: "Inactive" },
          //   { value: "have_image", label: "Have Image" },
          //   { value: "all", label: "All" },
          // ]}
          filters={[
            { value: "active", label: trans?.sectionsItems?.active },
            { value: "inactive", label: trans?.sectionsItems?.inactive },
            { value: "have_image", label: trans?.sectionsItems?.haveImage },
            { value: "all", label: trans?.sectionsItems?.all },
          ]}
          // handleSaveArrange={handleSaveArrange}
          trans={trans}
          arrange={true}
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
          <p className="text-center text-gray-500 py-10">Error loading items</p>
        </div>
      ) : Array.isArray(currentItems) && currentItems.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {currentItems.map((item, index) => (
            <div
              key={item.id}
              className={`card bg-popover ${
                draggedIndex === index ? "opacity-50" : ""
              }`}
            >
              <CardHeader
                imageUrl={item.image}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
              />

              <CardContent
                sectionName={item?.name}
                description={truncateDescription(item?.description, 80)}
                isActive={item?.status?.id === ACTIVE_STATUS_ID}
                onToggleActive={(checked) =>
                  handleToggleActive(checked, item.id, item.status?.id)
                }
                isSection={true}
                className="card-content"
                trans={trans}
                deletedAt={item?.actions?.deletedAt}
              />
              <CardFooter
                sectionName={item?.name}
                onViewEdit={() => handleNavigate(item.id)}
                // onDelete={() => handleDeleteItem(item.id)}
                onEnter={() => handleEnter(item.id)}
                isActive={item?.status?.id === ACTIVE_STATUS_ID}
                onToggleActive={(checked) =>
                  handleToggleActive(checked, item.id, item.status?.id)
                }
                isSection={true}
                trans={trans}
                isLoading={isLoadingStatus}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-center text-gray-500 py-10">No items to display</p>
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

export default Items;
