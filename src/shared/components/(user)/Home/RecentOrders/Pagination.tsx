import React, { FC } from "react";

interface PaginationProps {
  countPerPage: number;
  totalItems: number;
  current: number;
  setCurrent: (value: number) => void;
}

const Pagination: FC<PaginationProps> = ({
  countPerPage,
  totalItems,
  current,
  setCurrent,
}) => {
  const decrease = () => {
    if (current > 1) setCurrent(current - 1);
  };
  const increase = () => {
    if (current < totalItems / countPerPage) setCurrent(current + 1);
  };

  // @todo: to refactor
  const createPageList = (
    totalPages: number,
    currentPage: number,
  ): number[] => {
    let startPage, endPage;

    if (totalPages <= countPerPage) {
      startPage = 1;
      endPage = totalPages;
    } else if (currentPage <= Math.ceil(countPerPage / 2)) {
      startPage = 1;
      endPage = countPerPage;
    } else if (currentPage + Math.floor(countPerPage / 2) >= totalPages) {
      startPage = totalPages - countPerPage + 1;
      endPage = totalPages;
    } else {
      startPage = currentPage - Math.floor(countPerPage / 2);
      endPage = currentPage + Math.floor(countPerPage / 2);
    }
    const pages = [];

    for (let i = startPage; i <= endPage; i += 1) {
      pages.push(i);
    }

    return pages;
  };

  if (!totalItems) return null;

  return (
    <div className="pt-[15px] text-center">
      <ul className="inline-flex items-center justify-center rounded-[50px] border border-stroke bg-white overflow-hidden">
        <li>
          <button
            className="flex h-[36px] items-center justify-center border border-transparent px-[15px] text-base font-medium text-dark hover:bg-gray-2"
            onClick={decrease}
          >
            <svg
              fill="none"
              height="12"
              viewBox="0 0 7 12"
              width="7"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.99981 12C5.94067 12 5.88211 11.9884 5.82747 11.9658C5.77283 11.9432 5.72318 11.91 5.68135 11.8682L0.131821 6.31841C0.0474156 6.23398 -5.34982e-07 6.11948 -5.24545e-07 6.00009C-5.14108e-07 5.88071 0.0474157 5.76621 0.131821 5.68178L5.68135 0.131956C5.72315 0.0901348 5.77278 0.0569566 5.8274 0.0343157C5.88203 0.0116748 5.94057 1.44691e-05 5.9997 5.3702e-07C6.05883 -1.33951e-05 6.11739 0.0116194 6.17202 0.0342346C6.22666 0.0568497 6.2763 0.0900046 6.31812 0.131806C6.35994 0.173607 6.39312 0.223236 6.41576 0.27786C6.4384 0.332484 6.45006 0.391032 6.45008 0.450162C6.45009 0.509292 6.43846 0.567846 6.41584 0.62248C6.39323 0.677114 6.36007 0.726759 6.31827 0.76858L1.08691 5.99994L6.31827 11.2313C6.38128 11.2943 6.42419 11.3745 6.44158 11.4619C6.45897 11.5492 6.45005 11.6398 6.41596 11.7221C6.38187 11.8044 6.32413 11.8747 6.25005 11.9242C6.17597 11.9737 6.08889 12 5.99981 12Z"
                fill="#74788D"
              />
            </svg>
          </button>
        </li>

        {createPageList(Math.ceil(totalItems / countPerPage), current).map(
          (item) => (
            <li key={item}>
              <button
                className={`flex h-[36px] items-center justify-center border-l border-r border-transparent px-2 text-base font-medium text-[#74788D] hover:bg-gray-2 ${
                  item === current
                    ? "min-w-10 bg-[#EBEBEB] border-[#CED4DA]"
                    : "min-w-[36px]"
                }`}
                onClick={() => setCurrent(item)}
              >
                {item}
              </button>
            </li>
          ),
        )}

        <li>
          <button
            className="flex h-[36px] items-center justify-center border border-transparent px-[15px] text-base font-medium text-dark hover:bg-gray-2"
            onClick={increase}
          >
            <svg
              fill="none"
              height="12"
              viewBox="0 0 7 12"
              width="7"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.599801 12C0.658936 12 0.717497 11.9884 0.772139 11.9658C0.826782 11.9432 0.876434 11.91 0.918262 11.8682L6.46779 6.31841C6.55219 6.23398 6.59961 6.11948 6.59961 6.00009C6.59961 5.88071 6.55219 5.76621 6.46779 5.68178L0.918261 0.131956C0.87646 0.0901348 0.826831 0.0569566 0.772208 0.0343157C0.717584 0.0116748 0.659036 1.44691e-05 0.599905 5.3702e-07C0.540776 -1.33951e-05 0.482222 0.0116194 0.427588 0.0342346C0.372954 0.0568497 0.323308 0.0900046 0.281487 0.131806C0.239666 0.173607 0.206489 0.223236 0.183847 0.27786C0.161207 0.332484 0.149546 0.391032 0.149532 0.450162C0.149518 0.509292 0.161151 0.567846 0.183766 0.62248C0.206381 0.677114 0.239536 0.726759 0.281338 0.76858L5.5127 5.99994L0.281339 11.2313C0.218332 11.2943 0.175418 11.3745 0.15803 11.4619C0.14064 11.5492 0.149556 11.6398 0.18365 11.7221C0.217743 11.8044 0.275483 11.8747 0.34956 11.9242C0.423637 11.9737 0.510724 12 0.599801 12Z"
                fill="#74788D"
              />
            </svg>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
