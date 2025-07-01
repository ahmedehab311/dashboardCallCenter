import { useState, useEffect } from "react";

function useApplyFiltersAndSort(array = []) {
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [filterOption, setFilterOption] = useState("");
  const [pageSize, setPageSize] = useState("10");

  const applyFiltersAndSort = () => {
    let updatedMenus = [...array];

    // search
    if (searchTerm) {
      updatedMenus = updatedMenus.filter(
        (menu) =>
          menu.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
          menu?.description?.toLowerCase()?.includes(searchTerm.toLowerCase())
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
  }, [searchTerm, sortOption, filterOption, pageSize, array]);
  return {
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
  };
}

export default useApplyFiltersAndSort;
