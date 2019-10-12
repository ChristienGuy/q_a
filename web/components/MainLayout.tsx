import Navbar from "./Nav";

const MainLayout: React.FC = ({ children }) => (
  <div>
    <Navbar trueProp={true} />
    {children}
  </div>
);

export default MainLayout;
