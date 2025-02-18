"use client";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useTranslation } from "/provider/TranslationProvider";
import Image from "next/image";
import ReactPaginate from "react-paginate";
import { useState } from "react";
// import "@/app/[lang]/sections/index.css";
function DashboardPageView({ sections }) {
  const language = useSelector((state) => state.language.language);

  const trans = useTranslation();
  const items = [
    "Item 1",
    "Item 2",
    "Item 3",
    "Item 4",
    "Item 5",
    "Item 6",
    "Item 7",
    "Item 8",
    "Item 9",
    "Item 10",
  ];

  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(0);

  const pageCount = Math.ceil(sections?.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = sections?.slice(offset, offset + itemsPerPage);

  const handlePageClick = (event) => {
    // console.log(`User selected page ${event.selected}`);
    setCurrentPage(event.selected);
  };
  return (
    <>
      {/* <div>{trans?.dashboard || "Translation not available"}</div> */}
      <div>
        {/* <h1>Welcome, {admin?.name}</h1>
        <h1>email, {admin?.email}</h1>
        <Image src={admin?.profilePic} width={50} height={50} alt="img" /> */}
        {/* <p>Roles: {roles?.join(", ")}</p> */}
        {/* <p>Permissions: {permissions?.join(", ")}</p> */}
      </div>
      {/* <p>Current Language: {language}</p> */}
      {/* <div>
        <Link href={`/${language}/dashboard/create-admin`} prefetch={false}>
          creeate
        </Link>
      </div>
      <div>
        <Link href={`/${language}/dashboard/view-admin`} prefetch={false}>
          view
        </Link>
      </div>
      <Link href={`/${language}/dashboard/test`} prefetch={false}>
        test Page
      </Link> */}
   
   
   
      {/* <div style={{ textAlign: "center", padding: "20px" }}>
        <h2>Pagination Test</h2>
        <ul>
          {currentItems?.map((item, index) => (
            <li
              key={index}
              style={{ listStyle: "none", padding: "5px", fontSize: "18px" }}
            >
              {item}
            </li>
          ))}
        </ul>

        <ReactPaginate
          previousLabel={"< Previous"}
          nextLabel={"Next >"}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
          pageClassName={"page-item"}
          previousClassName={"prev-item"}
          nextClassName={"next-item"}
        />
      </div> */}
    </>
  );
}

export default DashboardPageView;
