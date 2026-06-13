import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import ReactPaginate from "react-paginate";

const PaginatedGrid = ({
  data = [],
  entriesPerPage = 6,
  columns = "grid-cols-1",
  renderItem,
  allowScroll = true,
  persistPage = false, // NEW PROP
  persistKey = "paginatedGridPage", // optional custom key
  resetPageKey, // number that increments on reset
  emptyMessage, // NEW PROP
}) => {
  const formData = useSelector((state) => state.location.formValues);
  const location = useLocation();

  // Initial page: restore from localStorage if persistPage=true
  const [currentPage, setCurrentPage] = useState(() => {
    if (persistPage) {
      const saved = localStorage.getItem(persistKey);
      return saved ? Number(saved) : 0;
    }
    return 0;
  });

  // Save to localStorage when persistPage is true
  useEffect(() => {
    if (persistPage) {
      localStorage.setItem(persistKey, currentPage);
    }
  }, [currentPage, persistPage, persistKey]);

  // Reset page when category changes
  const prevCategoryRef = useRef(formData?.category || "");
  useEffect(() => {
    const currentCategory = formData?.category || "";
    if (prevCategoryRef.current !== currentCategory) {
      setCurrentPage(0);
      prevCategoryRef.current = currentCategory;
      if (persistPage) {
        localStorage.setItem(persistKey, 0);
      }
    }
  }, [formData?.category, persistPage, persistKey]);

  const totalPages = Math.ceil(data.length / entriesPerPage);
  const currentData = data.slice(
    currentPage * entriesPerPage,
    (currentPage + 1) * entriesPerPage
  );

  useEffect(() => {
    if (resetPageKey !== 0) {
      setCurrentPage(0);
      if (persistPage) {
        localStorage.setItem(persistKey, "0");
      }
    }
  }, [resetPageKey, persistPage, persistKey]);

  return (
    <div className="flex justify-between flex-col rounded-xl">
      <div className="flex flex-col gap-4 h-full justify-between custom-scrollbar-hide">
        <div className={`grid ${columns} gap-2`}>
          {currentData.length ? (
            currentData.map((item, i) => renderItem(item, i))
          ) : (
            <div className="col-span-full text-center text-sm text-gray-500 border border-dotted rounded-lg p-4">
              {emptyMessage || "No items found."}
            </div>
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="overflow-x-auto">
          <ReactPaginate
            pageCount={totalPages}
            forcePage={currentPage}
            onPageChange={({ selected }) => setCurrentPage(selected)}
            pageRangeDisplayed={3}
            marginPagesDisplayed={1}
            previousLabel="‹"
            nextLabel="›"
            breakLabel="..."
            renderOnZeroPageCount={null}
            containerClassName="flex justify-center gap-4 mt-10 w-full px-2"
            pageClassName="h-8 w-8 flex justify-center items-center rounded-full text-sm border border-gray-500 bg-white text-black transition shrink-0"
            pageLinkClassName="flex justify-center items-center w-full h-full"
            activeClassName="bg-black text-black border-black"
            activeLinkClassName="text-white bg-black rounded-full"
            previousClassName="h-8 w-8 flex justify-center items-center rounded-full text-sm border border-gray-500 bg-white text-black"
            nextClassName="h-8 w-8 flex justify-center items-center rounded-full text-sm border border-gray-500 bg-white text-black"
            previousLinkClassName="flex justify-center items-center w-full h-full"
            nextLinkClassName="flex justify-center items-center w-full h-full"
            breakClassName="h-8 w-8 flex justify-center items-center rounded-full text-sm border border-gray-300 bg-white text-black"
            breakLinkClassName="flex justify-center items-center w-full h-full"
            disabledClassName="opacity-50 cursor-not-allowed"
          />
        </div>
      )}
    </div>
  );
};

export default PaginatedGrid;
