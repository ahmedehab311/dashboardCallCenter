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
import { fetchAllMenu, Menus, useMenus } from "./apisMenu";
// import { saveArrangement } from "./apiSections.jsx";
import ReactPaginate from "react-paginate";
import useTranslate from "@/hooks/useTranslate";
import useApplyFiltersAndSort from "../../components/hooks/useApplyFiltersAndSort";
import { useReorderableList } from "@/hooks/useReorderableList";
import { usePagination } from "@/hooks/usePagination";
import { useQuery } from "@tanstack/react-query";
import { useSubdomin } from "@/provider/SubdomainContext";
import { BASE_URL } from "@/api/BaseUrl";
// import Dash from "@/app/[lang]/dashboard/DashboardPageView";
const Menu = ({ params: { lang } }) => {
  const router = useRouter();
  const { apiBaseUrl, subdomain } = useSubdomin();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const {
    data: Menus,
    isLoading,
    error,
    refetch,
  } = useMenus(token, apiBaseUrl);
  if (process.env.NODE_ENV === "development") {
    console.log("apiBaseUrl", apiBaseUrl);
    console.log("Menus", Menus);
    console.log("token", token);
  }

  const { trans } = useTranslate(lang);
  const {
    filteredMenu,
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
  const itemsCount = filteredMenu?.length;
  const [isLoadingStatus, setIsLoadingStauts] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [localStatuses, setLocalStatuses] = useState({});
  const [localStatusesDefault, setLocalStatusesDefault] = useState({});

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
  } = useReorderableList(filteredMenu);
  const { offset, currentItems, pageCount, getVisiblePages } = usePagination(
    filteredMenu,
    itemsPerPage,
    currentPage
  );

  const handleDelete = () => {
    console.log("Delete clicked");
  };

  const handleToggleActive = (checked, menuId) => {
    setLocalStatuses((prev) => ({
      ...prev,
      [menuId]: checked,
    }));
  };
  const getStatus = (menu) => {
    // لو المستخدم غيّر السويتش، نستخدم القيمة اللي في localStatuses
    if (menu.id in localStatuses) return localStatuses[menu.id];
    // وإلا نرجع القيمة الأصلية من الـ API
    return !!menu.status;
  };
  const handleToggleDefaultActive = (checked, menuId) => {
    setLocalStatusesDefault((prev) => ({
      ...prev,
      [menuId]: checked,
    }));
  };
  const getStatusDefault = (menu) => {
    if (menu.id in localStatusesDefault) return localStatusesDefault[menu.id];
    return !!menu.default;
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
          pageType="Menus"
            pageTypeLabel="Menus"
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
            Error loading menus
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
                imageUrl={`${BASE_URL()}/${subdomain}/${menu.image}`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
              />

              <CardContent
                sectionName={menu?.name_en}
                description={truncateDescription(menu?.description_en, 80)}
                isActive={getStatus(menu)}
                onToggleActive={(checked) =>
                  handleToggleActive(checked, menu.id)
                }
                isSection={true}
                className="card-content"
                trans={trans}
                deletedAt={menu?.actions?.deletedAt}
                isLoading={isLoadingStatus}
              />
              <CardFooter
                sectionName={menu?.name}
                onViewEdit={() => handleViewEdit(menu.id)}
                onDelete={() => handleDelete(menu.id)}
                onEnter={() => handleEnter(menu.id)}
                // checked={getStatusDefault(menu)}

                isActiveDefault={getStatusDefault(menu)}
                onToggleDefaultActive={(checked) =>
                  handleToggleDefaultActive(checked, menu.id)
                }
                isDefault={true}
                isSection={true}
                trans={trans}
                isLoading={isLoadingStatus}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-center text-gray-500 py-10">No menus to display</p>
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
