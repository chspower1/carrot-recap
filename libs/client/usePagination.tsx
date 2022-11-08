import { useEffect, useState } from "react";

export default function usePagination(countContents: number, contentsPerPage: number) {
  const [currentPage, setCurrentPage] = useState(1);
  const [plusPage, setPlusPage] = useState(0);
  const [isfirstPage, setIsFirstPage] = useState(true);
  const [isLastPage, setIsLastPage] = useState(false);
  const [maxPage, setMaxPage] = useState(contentsPerPage);
  const handleClickPage = (page: number) => {
    setCurrentPage(page);
  };
  const handleClickChangePageList = (type: string) => {
    if (type === "next") {
      setIsFirstPage(false);
      setPlusPage((prev) => prev + contentsPerPage);
    } else if (type === "prev") {
      setIsLastPage(false);
      setPlusPage((prev) => prev - contentsPerPage);
    }
  };
  useEffect(() => {
    if (plusPage === 0) {
      setIsFirstPage(true);
    }
    if (plusPage + 5 >= maxPage) {
      console.log(plusPage + contentsPerPage, maxPage);
      setIsLastPage(true);
    }
  }, [plusPage, maxPage]);
  useEffect(() => {
    const pageCount =
      countContents % contentsPerPage === 0
        ? parseInt(countContents / contentsPerPage + "")
        : parseInt(countContents / contentsPerPage + 1 + "");
    setMaxPage(pageCount);
  }, [countContents]);
  return {
    currentPage,
    isfirstPage,
    isLastPage,
    plusPage,
    maxPage,
    handleClickChangePageList,
    handleClickPage,
  };
}
