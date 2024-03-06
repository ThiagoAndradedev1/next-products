import React from "react";
import { Box, Text, Button, Flex } from "@chakra-ui/react";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

interface ProductCardProps {
  product: Product;
  handleOpenModal: (product: Product) => void;
  handleDeleteProduct: (productId: number) => void;
}

const ProductCardComponent: React.FC<ProductCardProps> = ({
  product,
  handleOpenModal,
  handleDeleteProduct,
}) => {
  return (
    <Box
      bg="tomato"
      width={400}
      p={4}
      color="white"
      key={product.id}
      className="product-card"
      textAlign="center"
    >
      <Text>{product.title}</Text>
      <Text>{product.price}</Text>
      <Flex direction="column" mb={50}>
        <Button mt={5} onClick={() => handleOpenModal(product)}>
          Update Title
        </Button>
        <Button mt={5} onClick={() => handleDeleteProduct(product.id)}>
          Delete
        </Button>
      </Flex>
    </Box>
  );
};

export default ProductCardComponent;
