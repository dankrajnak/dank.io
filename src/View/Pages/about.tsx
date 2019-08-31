import * as React from "react";
import styled from "styled-components";
import MenuLayout from "../Layout/MenuLayout";
import SEO from "../Utility/seo";

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Content = styled.div`
  width: 50%;
  line-height: 1.8rem;
`;

const About = () => (
  <MenuLayout color={"#222"}>
    <SEO title="About" />
    <Container>
      <Content>
        <h4>This is just stuff I like making.</h4>
        <p>
          My name's Daniel. This is a place that I put stuff I make. If you like
          my work, feel free to reach out. My last name's Krajnak. You can
          probably find me somewhere.
        </p>
      </Content>
    </Container>
  </MenuLayout>
);

export default About;
