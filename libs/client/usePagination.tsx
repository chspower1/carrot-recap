import { useEffect, useState } from "react";

export default function usePagination(countContents: number) {
  const [currentPage, setCurrentPage] = useState(1);
  const [plusPage, setPlusPage] = useState(0);
  const [isfirstPage, setIsFirstPage] = useState(true);
  const [isLastPage, setIsLastPage] = useState(false);
  const [maxPage, setMaxPage] = useState(5);
  const handleClickPage = (page: number) => {
    setCurrentPage(page);
  };
  const handleClickChangePageList = (type: string) => {
    if (type === "next") {
      setIsFirstPage(false);
      setPlusPage((prev) => prev + 5);
    } else if (type === "prev") {
      setIsLastPage(false);
      setPlusPage((prev) => prev - 5);
    }
  };
  useEffect(() => {
    if (plusPage === 0) {
      setIsFirstPage(true);
    }
    if (plusPage + 5 >= maxPage) {
      console.log(plusPage + 5, maxPage);
      setIsLastPage(true);
    }
  }, [plusPage, maxPage]);
  useEffect(() => {
    const pageCount =
      countContents % 5 === 0
        ? parseInt(countContents / 5 + "")
        : parseInt(countContents / 5 + 1 + "");
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
