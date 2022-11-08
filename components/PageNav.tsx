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
    <div className="flex justify-center items-center w-full">
      <div className="relative flex h-full justify-center items-center gap-4 pt-3">
        {isfirstPage || (
          <button className="absolute left-44" onClick={() => handleClickChangePageList("prev")}>
            ⬅️
          </button>
        )}
        {[1, 2, 3, 4, 5].map(
          (index) =>
            index + plusPage <= maxPage && (
              <button
                onClick={() => handleClickPage(index)}
                className={cls(
                  "hover:text-orange-500 w-3",
                  currentPage === index ? "text-orange-400" : ""
                )}
                key={index}
              >
                {index + plusPage}
              </button>
            )
        )}
        {isLastPage || (
          <button className="absolute right-44" onClick={() => handleClickChangePageList("next")}>
            ➡️
          </button>
        )}
      </div>
    </div>
  );
}
