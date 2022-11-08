import { cls } from "@libs/client/utils";

interface PageNavProps {
  isfirstPage: boolean;
  handleClickPage: (page: number) => void;
  handleClickChangePageList: (type: string) => void;
  currentPage: number;
  plusPage: number;
  maxPage: number;
  isLastPage: boolean;
}
export default function PageNav({
  isfirstPage,
  handleClickPage,
  handleClickChangePageList,
  currentPage,
  plusPage,
  maxPage,
  isLastPage,
}: PageNavProps) {
  return (
    <>
      {isfirstPage || (
        <button className="absolute left-44" onClick={() => handleClickChangePageList("prev")}>
          ⬅️
        </button>
      )}
      {[1, 2, 3, 4, 5].map((index) => (
        <button
          onClick={() => handleClickPage(index)}
          className={cls(
            "hover:text-orange-500 w-3",
            currentPage === index ? "text-orange-400" : ""
          )}
          key={index}
        >
          {index + plusPage <= maxPage ? index + plusPage : null}
        </button>
      ))}
      {isLastPage || (
        <button className="absolute right-44" onClick={() => handleClickChangePageList("next")}>
          ➡️
        </button>
      )}
    </>
  );
}
