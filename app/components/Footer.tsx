import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import "../ProductList.css";

const Footer = () => {
  return (
    <Flex
      justify="center"
      align="center"
      p={4}
      bg="blue.500"
      color="white"
      className="footer"
      bottom="0"
      left="0"
      width="100%"
    >
      <Text>© 2024 Your Company</Text>
    </Flex>
  );
};

export default Footer;
