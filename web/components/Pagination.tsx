import s from "./Pagination.scss";

const Pagination = ({ currentPage = 1, perPage = 10, total = 10, onClick }) => {
  const pageCount = Math.ceil(total / perPage);
  const pages = new Array(pageCount).fill(1).map((_, index) => index + 1);

  return (
    <ul className={s.list}>
      {pages.map(page => (
        <li>
          <button
            style={{
              background: page === currentPage ? "red" : "transparent"
            }}
            onClick={() => onClick(page)}
          >
            {page}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default Pagination;
