import Navbar from "./Navbar";
import s from "./MainLAyout.scss";

const MainLayout: React.FC = ({ children }) => (
  <div className={s.wrapper}>
    <Navbar />
    {children}
  </div>
);

export default MainLayout;
