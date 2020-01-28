import Navbar from "./Navbar";

const MainLayout: React.FC = ({ children }) => (
  <div>
    <Navbar />
    {children}
  </div>
);

export default MainLayout;
