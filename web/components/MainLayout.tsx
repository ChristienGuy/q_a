import Navbar from "./Navbar";
import s from "./MainLayout.scss";

const MainLayout: React.FC = ({ children }) => (
  <div className={s.wrapper}>
    <Navbar />
    {children}
  </div>
);

export default MainLayout;
