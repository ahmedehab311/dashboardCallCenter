"use client";
import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/CardSections";
import Image from "next/image";
import { useRouter, useParams, usePathname } from "next/navigation";
import "@/app/[lang]/dashboard/menus/index.css";
import { useSelector, useDispatch } from "react-redux";
import TaskHeader from "@/app/[lang]/dashboard/menus/task-header.jsx";
import { getDictionary } from "@/app/dictionaries.js";
import "@/app/[lang]/dashboard/items/main.css";
// import { saveArrangement } from "./apiSections.jsx";
import ReactPaginate from "react-paginate";
import { sections } from "../../sections/sectionArray";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

const SubSectionView = ({lang,filteredSubSection}) => {
  const router = useRouter();
  const dispatch = useDispatch();
const pathname =  usePathname()

  const [trans, setTrans] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [filterOption, setFilterOption] = useState("");
  const [pageSize, setPageSize] = useState("10");
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerPage =
    pageSize === "all" ? filteredSubSection.length : parseInt(pageSize);

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


  const truncateDescription = (desc, maxLength = 50) => {
    if (!desc) return "";
    return desc.length > maxLength ? desc.slice(0, maxLength) + "..." : desc;
  };
 const handleEnter = (sectionId) => {
    if (!pathname) {
      console.error("Pathname is undefined");
      return;
    }

    const newPath = pathname.replace(/\/\d+$/, `/${sectionId}`);

    router.push(newPath);
  };

  //  edit & view
  const handleNavigate = (itemId) => {
    router.push(`/${lang}/dashboard/item/${itemId}/view`);
  };
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredSubSection.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredSubSection.length / itemsPerPage);

  const getVisiblePages = (currentPage, pageCount) => {
    const pages = [];
    if (pageCount <= 5) return Array.from({ length: pageCount }, (_, i) => i);

    pages.push(0);
    if (currentPage > 2) pages.push("start-ellipsis");
    if (currentPage > 1 && currentPage < pageCount - 2) {
      pages.push(currentPage - 1, currentPage, currentPage + 1);
    } else if (currentPage <= 1) {
      pages.push(1, 2);
    } else if (currentPage >= pageCount - 2) {
      pages.push(pageCount - 3, pageCount - 2);
    }
    if (currentPage < pageCount - 3) pages.push("end-ellipsis");
    pages.push(pageCount - 1);
    return pages;
  };

  const visiblePages = getVisiblePages(currentPage, pageCount);
  return (
    <Card className="gap-6 p-4 mb-4">
      <TaskHeader
        onSearch={(term) => setSearchTerm(term)}
        onPageSizeChange={(value) => setPageSize(value)}
        pageSize={pageSize}
        createButtonText={trans?.button?.item}
        pageType="sections"
        pageTypeLabel="sections"
        createTargetName="section"
        createTargetPath="section"
        filters={[
          { value: "active", label: trans?.sectionsItems?.active },
          { value: "inactive", label: trans?.sectionsItems?.inactive },
          { value: "have_image", label: trans?.sectionsItems?.haveImage },
          { value: "all", label: trans?.sectionsItems?.all },
        ]}
        trans={trans}
        isLoading={isLoading}
        itemsCount={filteredSubSection.length}
      />

      {isLoading ? (
        <p className="text-center text-gray-500 py-10">Loading...</p>
      ) : error ? (
        <p className="text-center text-gray-500 py-10">Error loading sections</p>
      ) : Array.isArray(currentItems) && currentItems.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {currentItems.map((item, index) => (
            <div key={item.id} className="card bg-popover">
              <CardHeader imageUrl={item.image} />
              <CardContent
                sectionName={item.name}
                description={truncateDescription(item.description, 80)}
                isSection={false}
                trans={trans}
              />
              <CardFooter
                sectionName={item?.name}
                onViewEdit={() => handleNavigate(item.id)}
                // onDelete={() => handleDeleteitem(item.id)}
                onEnter={() => handleEnter(item.id)}
                // isActive={item?.status?.id === ACTIVE_STATUS_ID}
                onToggleActive={(checked) =>
                  handleToggleActive(checked, item.id, item.status?.id)
                }
                isSection={true}
                trans={trans}
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-10">No sections to display</p>
      )}

      {pageCount > 1 && (
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
            {visiblePages.map((page, i) => (
              <PaginationItem key={i}>
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

export default SubSectionView;
