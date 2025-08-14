import React, { FC } from "react";
import { Link } from "react-router-dom";

const Breadcrumbs: FC<{ items: { name: string; link: string }[] }> = ({
  items,
}) => {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
        {items.map((i, index) => (
          <li>
            <div className="flex items-center">
              {index !== 0 && <svg
                className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>}
              {index === items.length - 1 ? (
                <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">
                  {i.name}
                </span>
              ) : (
                <Link
                  to={i.link}
                  className="ms-1 text-sm font-medium text-gray-700 hover:text-green-800 md:ms-2 dark:text-gray-400 dark:hover:text-white"
                >
                  {i.name}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
