import React from "react";
import { Flex, Box, Text } from "@chakra-ui/react";

const Navbar = () => {
  return (
    <Box bg="gray.100" color="black" p={4} width="100%">
      <Flex justifyContent="center" alignItems="center">
        <Text fontSize="xl" textAlign="center">
          🏪 Listagem de Produtos 🏪
        </Text>
      </Flex>
    </Box>
  );
};

export default Navbar;
