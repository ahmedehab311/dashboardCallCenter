// import { useState, useEffect } from "react";

// function useApplyFiltersAndSort(array = []) {
//   // const [filteredMenu, setFilteredMenu] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortOption, setSortOption] = useState("");
//   const [filterOption, setFilterOption] = useState("");
//   const [pageSize, setPageSize] = useState("10");
// const filteredMenu = useMemo(() => {
//   let updatedMenus = [...array];

//   if (searchTerm) {
//     updatedMenus = updatedMenus.filter(
//       (menu) =>
//         menu.name_en?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
//         menu?.description_en?.toLowerCase()?.includes(searchTerm.toLowerCase())
//     );
//   }

//   if (filterOption === "active") {
//     updatedMenus = updatedMenus.filter((menu) => menu.status === true);
//   } else if (filterOption === "inactive") {
//     updatedMenus = updatedMenus.filter((menu) => menu.status === false);
//   }

//   if (sortOption === "alphabetical") {
//     updatedMenus.sort((a, b) => a.name_en.localeCompare(b.name_en));
//   } else if (sortOption === "recent") {
//     updatedMenus.sort((a, b) => b.id - a.id);
//   } else if (sortOption === "old") {
//     updatedMenus.sort((a, b) => a.id - b.id);
//   }

//   return updatedMenus;
// }, [array, searchTerm, sortOption, filterOption, pageSize]);

//   const applyFiltersAndSort = () => {
//     let updatedMenus = [...array];

//     // search
//     if (searchTerm) {
//       updatedMenus = updatedMenus.filter(
//         (menu) =>
//           menu.name_en?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
//           menu?.description_en?.toLowerCase()?.includes(searchTerm.toLowerCase())
//       );
//     }

//     // filter
//     if (filterOption === "active") {
//       updatedMenus = updatedMenus.filter(
//         (menu) => menu?.status?.name_en === "active"
//       );
//     } else if (filterOption === "inactive") {
//       updatedMenus = updatedMenus.filter(
//         (menu) => menu?.status?.name_en === "inactive"
//       );
//     } else if (filterOption === "have_image") {
//       updatedMenus = updatedMenus.filter((menu) => menu.imageUrl);
//     }

//     // arang
//     if (sortOption === "alphabetical") {
//       updatedMenus.sort((a, b) => a.name.localeCompare(b.name));
//     } else if (sortOption === "recent") {
//       updatedMenus.sort((a, b) => b.id - a.id);
//     } else if (sortOption === "old") {
//       updatedMenus.sort((a, b) => a.id - b.id);
//     }
//     // pagenation
//     // if (pageSize !== "all") {
//     //   const size = parseInt(pageSize, 10);
//     //   updatedMenus = updatedMenus.slice(0, size);
//     // }

//     setFilteredMenu(updatedMenus);
//   };

//   useEffect(() => {
//     applyFiltersAndSort();
//   }, [searchTerm, sortOption, filterOption, pageSize, array]);
//   return {
//     filteredMenu,
//     searchTerm,
//     setSearchTerm,
//     sortOption,
//     setSortOption,
//     filterOption,
//     setFilterOption,
//     pageSize,
//     setPageSize,
//   };
// }

// export default useApplyFiltersAndSort;
import { useState, useMemo } from "react";

function useApplyFiltersAndSort(array = []) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [filterOption, setFilterOption] = useState("");
  const [pageSize, setPageSize] = useState("10");

  const filteredMenu = useMemo(() => {
    let updatedMenus = [...array];

    // search
    if (searchTerm) {
      updatedMenus = updatedMenus.filter(
        (menu) =>
          menu.name_en?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
          menu?.description_en?.toLowerCase()?.includes(searchTerm.toLowerCase())
      );
    }

    // filter
    if (filterOption === "active") {
      updatedMenus = updatedMenus.filter((menu) => menu.status === true);
    } else if (filterOption === "inactive") {
      updatedMenus = updatedMenus.filter((menu) => menu.status === false);
    } else if (filterOption === "have_image") {
      updatedMenus = updatedMenus.filter((menu) => !!menu.image);
    }

    // sort
    if (sortOption === "alphabetical") {
      updatedMenus.sort((a, b) => a.name_en.localeCompare(b.name_en));
    } else if (sortOption === "recent") {
      updatedMenus.sort((a, b) => b.id - a.id);
    } else if (sortOption === "old") {
      updatedMenus.sort((a, b) => a.id - b.id);
    }

    // pagination
    if (pageSize !== "all") {
      const size = parseInt(pageSize, 10);
      updatedMenus = updatedMenus.slice(0, size);
    }

    return updatedMenus;
  }, [array, searchTerm, sortOption, filterOption, pageSize]);

  return {
    filteredMenu,
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
