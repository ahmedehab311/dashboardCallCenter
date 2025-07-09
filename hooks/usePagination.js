// hooks/usePagination.js
export const usePagination = (list, itemsPerPage, currentPage) => {
  const offset = currentPage * itemsPerPage;
  const currentItems = list?.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(list?.length / itemsPerPage);

  const getVisiblePages = () => {
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

  return { offset, currentItems, pageCount, getVisiblePages };
};
