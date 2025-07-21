"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/CardSections";
import { useRouter } from "next/navigation";
import "./index.css";
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
import "../items/main.css";
import { setAsDefaultMenu } from "./apisMenu";
import {
  changeItemStatus,
  deleteItem,
  restoreItem,
} from "@/app/[lang]/dashboard/sections/apisSection";
import useTranslate from "@/hooks/useTranslate";
import { useReorderableList } from "@/hooks/useReorderableList";
import { useSubdomin } from "@/provider/SubdomainContext";
import toast from "react-hot-toast";
import CardGridRenderer from "../../components/CardGridRenderer";
import { useToken } from "@/provider/TokenContext";
import { fetchAllSections, useSections } from "../sections/apisSection";
// import { TokenProvider } from "@/context/TokenContext";
const Menu = ({ params: { lang } }) => {
  const router = useRouter();
  // const { token } = useToken();
    const token = localStorage.getItem("token")
  const { apiBaseUrl, subdomain } = useSubdomin();
  const [filteredMenus, setFilteredMenus] = useState();
  const [pageSize, setPageSize] = useState("10");
  const {
    data: Menus,
    isLoading,
    error,
    refetch,
  } = useSections(token && apiBaseUrl ? token : null, apiBaseUrl, "menus");
  // if (process.env.NODE_ENV === "development") {
  //   console.log("apiBaseUrl", apiBaseUrl);
  //   console.log("Menus", Menus);
  //   console.log("token", token);
  // }

  const { trans } = useTranslate(lang);

  const itemsPerPage =
    pageSize === "all" ? filteredMenus.length : parseInt(pageSize);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [filterOption, setFilterOption] = useState("");
  const [arrangement, setArrangement] = useState([]);
  // const [draggedIndex, setDraggedIndex] = useState(null);
  const itemsCount = filteredMenus?.length;
  const [isLoadingStatus, setIsLoadingStauts] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [localStatuses, setLocalStatuses] = useState({});
  const [isSettingLoading, setIsSettingDefaultLoading] = useState(false);

  const {
    draggedIndex,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    setDraggedIndex,
  } = useReorderableList(filteredMenus);
  // const { offset, currentItems, pageCount, getVisiblePages } = usePagination(
  //   filteredMenu,
  //   itemsPerPage,
  //   currentPage
  // );
  const applyFiltersAndSort = () => {
    // let updatedSections = [...Menus];
    if (!Array.isArray(Menus)) return;

    let updatedSections = [...Menus];

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

    setFilteredMenus(updatedSections);
  };

  useEffect(() => {
    applyFiltersAndSort();
  }, [searchTerm, sortOption, filterOption, pageSize, Menus]);

  const handleEnter = (menuId) => {
    router.push(`/${lang}/dashboard/sections/${menuId}`);
  };

  const handleDelete = async (id) => {
    try {
      setIsSettingDefaultLoading(true);
      const res = await deleteItem(token, apiBaseUrl, id, "menu");
      if (res.messages?.[0]?.includes("so you can't delete")) {
        toast.error(res.messages[0]);
        return;
      }
      if (res.messages?.[0]?.includes("is deleted")) {
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
      toast.error("An error occurred while deleting the menu.");
      console.error("Error default menu:", error);
    } finally {
      setIsSettingDefaultLoading(false);
    }
  };
  const handleRestore = async (id) => {
    try {
      setIsSettingDefaultLoading(true);
      const res = await restoreItem(token, apiBaseUrl, id, "menu");

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
  const handlechangeStatus = async (id) => {
    try {
      setIsSettingDefaultLoading(true);
      const res = await changeItemStatus(token, apiBaseUrl, id, "menu");

      if (
        res?.responseStatus &&
        Array.isArray(res.messages) &&
        res.messages.length > 0
      ) {
        refetch();
        toast.success(res.messages[0]);
      }
    } catch (error) {
      toast.error("An error occurred while changing status the menu.");
      console.error("Error changing status menu:", error);
    } finally {
      setIsSettingDefaultLoading(false);
    }
  };
  const handleDefault = async (id) => {
    try {
      setIsSettingDefaultLoading(true);
      const res = await setAsDefaultMenu(token, apiBaseUrl, id);

      if (
        res?.responseStatus &&
        Array.isArray(res.messages) &&
        res.messages.length > 0
      ) {
        refetch();
        toast.success(res.messages[0]);
      }
    } catch (error) {
      toast.success("An error occurred while setting the menu as default.");
      console.error("Error default menu:", error);
    } finally {
      setIsSettingDefaultLoading(false);
    }
  };

  //  edit & view
  const handleViewEdit = (menuId) => {
    router.push(`/${lang}/dashboard/menu/${menuId}/view`);
  };
  const pageCount = Math.ceil(filteredMenus?.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredMenus?.slice(offset, offset + itemsPerPage);

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

  return (
    <Card className="gap-6 p-4">
      <div>
        <TaskHeader
          onSearch={(term) => setSearchTerm(term)}
          onSort={(option) => setSortOption(option)}
          onFilterChange={(option) => setFilterOption(option)}
          onPageSizeChange={(value) => setPageSize(value)}
          pageSize={pageSize}
          pageType="menus"
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
          isSettingLoading={isSettingLoading}
        />
      </div>
      <CardGridRenderer
        labelLoading="menus"
        currentItems={currentItems}
        isLoading={isLoading}
        error={error}
        localStatuses={localStatuses}
        setLocalStatuses={setLocalStatuses}
        trans={trans}
        isDefaultForMenu={true}
        isLoadingStatus={isLoadingStatus}
        handleDefault={handleDefault}
        handleRestore={handleRestore}
        handleEnter={handleEnter}
        handleViewEdit={handleViewEdit}
        handleDelete={handleDelete}
        handlechangeStatus={handlechangeStatus}
        isSettingLoading={isSettingLoading}
        subdomain={subdomain}
        offset={offset}
        setDraggedIndex={setDraggedIndex}
        filteredSections={filteredMenus}
        setFilteredSections={setFilteredMenus}
         
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
};

export default Menu;
