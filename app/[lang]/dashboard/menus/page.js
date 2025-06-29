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
import "./index.css";
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
import TaskHeader from "./task-header.jsx";
import { getDictionary } from "@/app/dictionaries.js";
import "../items/main.css";
import { Menus } from "./apisMenu";
// import { saveArrangement } from "./apiSections.jsx";
import ReactPaginate from "react-paginate";
// import Dash from "@/app/[lang]/dashboard/DashboardPageView";
const Menu = ({ params: { lang } }) => {
  const router = useRouter();
  // const {menuId} = router.query

  const dispatch = useDispatch();
  const [trans, setTrans] = useState(null);
  // console.log("trans", trans);

  const [filteredMenu, setFilteredMenu] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [arrangement, setArrangement] = useState([]);
  const [filterOption, setFilterOption] = useState("");
  const [pageSize, setPageSize] = useState("10");
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const itemsCount = filteredMenu?.length;
  const [isLoadingStatus, setIsLoadingStauts] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const language =
    typeof window !== "undefined" ? localStorage.getItem("language") : null;
  const itemsPerPage =
    pageSize === "all" ? filteredMenu.length : parseInt(pageSize);

  const Menus = useMemo(
    () => [
      {
        id: "1",
        name: "happy joys",
        description: "happy joys",
        image: "",
      },
    ],
    []
  );
  // console.log("sections", filteredMenu);
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
    let updatedMenus = [...Menus];

    // search
    if (searchTerm) {
      updatedMenus = updatedMenus.filter(
        (menu) =>
          menu.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
          menu?.description
            ?.toLowerCase()
            ?.includes(searchTerm.toLowerCase())
      );
    }

    // filter
    if (filterOption === "active") {
      updatedMenus = updatedMenus.filter(
        (menu) => menu?.status?.name === "active"
      );
    } else if (filterOption === "inactive") {
      updatedMenus = updatedMenus.filter(
        (menu) => menu?.status?.name === "inactive"
      );
    } else if (filterOption === "have_image") {
      updatedMenus = updatedMenus.filter((menu) => menu.imageUrl);
    }

    // arang
    if (sortOption === "alphabetical") {
      updatedMenus.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "recent") {
      updatedMenus.sort((a, b) => b.id - a.id);
    } else if (sortOption === "old") {
      updatedMenus.sort((a, b) => a.id - b.id);
    }
    // pagenation
    // if (pageSize !== "all") {
    //   const size = parseInt(pageSize, 10);
    //   updatedMenus = updatedMenus.slice(0, size);
    // }

    setFilteredMenu(updatedMenus);
  };

  useEffect(() => {
    applyFiltersAndSort();
  }, [searchTerm, sortOption, filterOption, pageSize, Menus]);
  const ACTIVE_STATUS_ID = 2;
  const INACTIVE_STATUS_ID = 3;

  useEffect(() => {
    let updatedSections = Menus;

    if (filterOption === "active") {
      updatedSections = updatedSections.filter(
        (section) => section?.status?.id === ACTIVE_STATUS_ID
      );
    } else if (filterOption === "inactive") {
      updatedSections = updatedSections.filter(
        (section) => section?.status?.id === INACTIVE_STATUS_ID
      );
    }

    setFilteredMenu(updatedSections);
  }, [Menus, filterOption]);
  const truncateDescription = (description, maxLength = 50) => {
    // console.log("Description received:", description);
    if (!description) return "";
    return description.length > maxLength
      ? description.slice(0, maxLength) + "..."
      : description;
  };

  const handleViewEdit = (menuId) => {
       router.push(`/${lang}/dashboard/section/${menuId}/view`);
  };

  const handleDelete = () => {
    console.log("Delete clicked");
  };

  const handleToggleActive = (checked) => {
    console.log("Toggle active:", checked);
  };

  const handleEnter = (menuId) => {
    router.push(`/${lang}/dashboard/sections`);
  };

  const handleDragStart = (e, localIndex) => {
    const actualIndex = offset + localIndex; //  index الحقيقي من filteredMenu
    setDraggedIndex(actualIndex);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === index) return;
  };
  const handleDrop = (e, dropIndex) => {
    e.preventDefault();

    // نسخ filteredMenu لعدم التلاعب بالـ state مباشرة
    const reorderedSections = [...filteredMenu];

    // سحب العنصر الذي تم سحبه من مكانه القديم
    const [draggedItem] = reorderedSections.splice(draggedIndex, 1);

    // إدخال العنصر في المكان الجديد
    reorderedSections.splice(dropIndex, 0, draggedItem);

    // تحديث filteredMenu في الـ state
    setFilteredMenu(reorderedSections);
    setDraggedIndex(null);

    // حساب الترتيب الجديد بناءً على filteredMenu
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
  const pageCount = Math.ceil(filteredMenu?.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredMenu?.slice(offset, offset + itemsPerPage);

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
  const handleNavigate = (menuId) => {
    router.push(`/${lang}/dashboard/menu/${menuId}/view`);
  };
  const visiblePages = getVisiblePages(currentPage, pageCount);
  if (!filteredMenu) {
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
         createTargetName="Menu"
          createTargetPath="menu"
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
          {currentItems.map((menu, index) => (
            <div
              key={menu.id}
              className={`card bg-popover ${
                draggedIndex === index ? "opacity-50" : ""
              }`}
            >
              <CardHeader
                imageUrl={menu.image}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
              />

              <CardContent
                sectionName={menu?.name}
                description={truncateDescription(menu?.description, 80)}
                isActive={menu?.status?.id === ACTIVE_STATUS_ID}
                onToggleActive={(checked) =>
                  handleToggleActive(checked, menu.id, menu.status?.id)
                }
                isSection={true}
                className="card-content"
                trans={trans}
                deletedAt={menu?.actions?.deletedAt}
              />
              <CardFooter
                sectionName={menu?.name}
                onViewEdit={() => handleNavigate(menu.id)}
                onDelete={() => handleDeleteSection(menu.id)}
                onEnter={() => handleEnter(menu.id)}
                isActive={menu?.status?.id === ACTIVE_STATUS_ID}
                onToggleActive={(checked) =>
                  handleToggleActive(checked, menu.id, menu.status?.id)
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

export default Menu;
