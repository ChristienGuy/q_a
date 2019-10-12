import Link from "next/link";

const Navbar: React.FC<{ trueProp: boolean }> = ({ trueProp }) => (
  <nav>
    <ul
      style={{
        display: "flex",
        flexDirection: "row",
        listStyle: "none",
        margin: 0,
        padding: 0
      }}
    >
      <li style={{ padding: "0 16px" }}>
        <Link href="/">
          <a>Home</a>
        </Link>
      </li>
      <li>
        <Link href="/questions">
          <a>Questions</a>
        </Link>
      </li>
    </ul>
  </nav>
);

export default Navbar;
