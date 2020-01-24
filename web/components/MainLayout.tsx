import Navbar from "./Navbar";
import styled from "styled-components";

const S = {
  Wrapper: styled.div`
    max-width: 1024px;
    margin: 0 auto;
    padding: 48px;
  `
};

const MainLayout: React.FC = ({ children }) => (
  <S.Wrapper>
    <Navbar />
    {children}
  </S.Wrapper>
);

export default MainLayout;
