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
// import { sections } from "./apisSection";
// import useTranslate from "@/hooks/useTranslate";
// import useApplyFiltersAndSort from "./components/hooks/useApplyFiltersAndSort";
import CardGridRenderer from "./CardGridRenderer";
import {
  deleteItem,
  restoreItem,
} from "@/app/[lang]/dashboard/sections/apisSection";
import { useSubdomin } from "@/provider/SubdomainContext";
import { useToken } from "@/provider/TokenContext";
import { useSections } from "@/app/[lang]/dashboard/sections/apisSection";
import toast from "react-hot-toast";
function SectionList({
  lang,
  sections,
  isLoading,
  error,
  refetch,
  trans,
  subdomain,
  token,
  apiBaseUrl,
}) {
  const router = useRouter();
  const [filteredSections, setFilteredSections] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [arrangement, setArrangement] = useState([]);
  const [filterOption, setFilterOption] = useState("");
  const [pageSize, setPageSize] = useState("10");
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [isSettingLoading, setIsSettingDefaultLoading] = useState(false);
  const itemsCount = filteredSections?.length;
  const [isLoadingStatus, setIsLoadingStauts] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [localStatuses, setLocalStatuses] = useState({});

  const itemsPerPage =
    pageSize === "all" ? filteredSections.length : parseInt(pageSize);

  const applyFiltersAndSort = () => {
    // let updatedSections = [...Menus];
    if (!Array.isArray(sections)) return;

    let updatedSections = [...sections];

    // search
    if (searchTerm) {
      updatedSections = updatedSections.filter(
        (section) =>
          section.name_en?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
          section?.description_en
            ?.toLowerCase()
            ?.includes(searchTerm.toLowerCase())
      );
    }

    // filter
    if (filterOption === "active") {
      updatedSections = updatedSections.filter(
        (section) => section?.status === true
      );
    } else if (filterOption === "inactive") {
      updatedSections = updatedSections.filter(
        (section) => section?.status === false
      );
    } else if (filterOption === "have_image") {
      updatedSections = updatedSections.filter((section) => section.image);
    }

    // arang
    if (sortOption === "alphabetical") {
      updatedSections.sort((a, b) => a.name_en.localeCompare(b.name_en));
    } else if (sortOption === "recent") {
      updatedSections.sort((a, b) => b.id - a.id);
    } else if (sortOption === "old") {
      updatedSections.sort((a, b) => a.id - b.id);
    }
    // pagenation
    // if (pageSize !== "all") {
    //   const size = parseInt(pageSize, 10);
    //   updatedSections = updatedSections.slice(0, size);
    // }

    setFilteredSections(updatedSections);
  };

  useEffect(() => {
    applyFiltersAndSort();
  }, [searchTerm, sortOption, filterOption, pageSize, sections]);

  const handleEnter = (sectionId) => {
    router.push(`/${lang}/dashboard/section/${sectionId}`);
  };
  const handleViewEdit = (sectionId) => {
    router.push(`/${lang}/dashboard/section/${sectionId}/view`);
  };
  const handleDelete = async (id) => {
    try {
      setIsSettingDefaultLoading(true);
      const res = await deleteItem(token, apiBaseUrl, id, "section");
      if (res.messages?.[0]?.includes("so you can't delete")) {
        toast.error(res.messages[0]);
        return;
      }
      if (
        res?.responseStatus &&
        Array.isArray(res.messages) &&
        res.messages.length > 0
      ) {
        refetch();
        toast.success(res.messages[0]);
      }
    } catch (error) {
      toast.error("An error occurred while deleting the section.");
      console.error("Error default section:", error);
    } finally {
      setIsSettingDefaultLoading(false);
    }
  };
  const handleRestore = async (id) => {
    try {
      setIsSettingDefaultLoading(true);
      const res = await restoreItem(token, apiBaseUrl, id, "section");

      if (
        res?.responseStatus &&
        Array.isArray(res.messages) &&
        res.messages.length > 0
      ) {
        refetch();
        toast.success(res.messages[0]);
      }
    } catch (error) {
      toast.error("An error occurred while restoring the menu.");
      console.error("Error default menu:", error);
    } finally {
      setIsSettingDefaultLoading(false);
    }
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

      <CardGridRenderer
        currentItems={currentItems}
        isLoading={isLoading}
        error={error}
        localStatuses={localStatuses}
        setLocalStatuses={setLocalStatuses}
        trans={trans}
        isLoadingStatus={isLoadingStatus}
        isDefaultForMenu={false}
        labelLoading="section"
        handleRestore={handleRestore}
        handleEnter={handleEnter}
        handleViewEdit={handleViewEdit}
        handleDelete={handleDelete}
        isSettingLoading={isSettingLoading}
        subdomain={subdomain}
        offset={offset}
        setDraggedIndex={setDraggedIndex}
        filteredSections={filteredSections}
        setFilteredSections={setFilteredSections}
      />

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
}

export default SectionList;
