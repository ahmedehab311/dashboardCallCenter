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
import useTranslate from "@/hooks/useTranslate";
import useApplyFiltersAndSort from "../../components/hooks/useApplyFiltersAndSort";
import { useReorderableList } from "@/hooks/useReorderableList";
import { usePagination } from "@/hooks/usePagination";
// import Dash from "@/app/[lang]/dashboard/DashboardPageView";
const Menu = ({ params: { lang } }) => {
  const router = useRouter();
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

  const { trans } = useTranslate(lang);
  const {
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
  } = useApplyFiltersAndSort(Menus);
  const itemsPerPage =
    pageSize === "all" ? filteredMenu.length : parseInt(pageSize);

  const [arrangement, setArrangement] = useState([]);
  // const [draggedIndex, setDraggedIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const itemsCount = filteredMenu?.length;
  const [isLoadingStatus, setIsLoadingStauts] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

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
  const {
    draggedIndex,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
  } = useReorderableList(filteredMenu, setFilteredMenu);
  const { offset, currentItems, pageCount, getVisiblePages } = usePagination(
    filteredMenu,
    itemsPerPage,
    currentPage
  );

  const handleDelete = () => {
    console.log("Delete clicked");
  };

  const handleToggleActive = (checked) => {
    console.log("Toggle active:", checked);
  };

  const handleEnter = () => {
    router.push(`/${lang}/dashboard/sections`);
  };

  //  edit & view
  const handleViewEdit = (menuId) => {
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
