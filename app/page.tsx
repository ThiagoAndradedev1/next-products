"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Box, Text, Button, SimpleGrid, Flex, Input } from "@chakra-ui/react";
import { useProductStore } from "./useProductStore";
import { ZodError, z } from "zod";
import "./ProductList.css";
import Navbar from "./components/Navbar";
import ModalComponent from "./components/ModalComponent";
import ProductCardComponent from "./components/ProductCardComponent";
import Footer from "./components/Footer";
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

const ProductList = () => {
  const { products, loading, page, setProducts, setLoading, setPage } =
    useProductStore();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newTitle, setNewTitle] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newProductTitle, setNewProductTitle] = useState<string>("");
  const [newTitleError, setNewTitleError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [newProductTitleError, setNewProductTitleError] = useState("");
  const [userData, setUserData] = useState<{ username: string } | null>(null);

  const titleSchema = z.string().min(1);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserInfo(token);
    }
  }, []);

  const fetchUserInfo = async (token: string) => {
    try {
      const response = await fetch("https://dummyjson.com/auth/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Erro ao buscar informações do usuário:", error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "kminchelle",
          password: "0lelplR",
        }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        fetchUserInfo(data.token);
      } else {
        console.error("Erro ao fazer login");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserData(null);
  };

  const fetchData = useCallback(async () => {
    console.log(page);
    setLoading(true);
    const response = await fetch(
      `https://dummyjson.com/products?limit=10&skip=${
        page * 10
      }&select=title,price&search=${searchTerm}`
    );
    const data = await response.json();
    setProducts(data.products);
    setLoading(false);
  }, [page, searchTerm, setProducts, setLoading]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (searchTerm.length > 0) {
      const fetchData = async () => {
        setLoading(true);
        const response = await fetch(
          `https://dummyjson.com/products/search?q=${searchTerm}`
        );
        const data = await response.json();
        setProducts(data.products);
        setLoading(false);
      };

      fetchData();
    }
  }, [searchTerm]);

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePrevPage = () => {
    setPage(page - 1);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleOpenModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    setIsEditMode(true);
    setNewTitleError("");
    setNewProductTitleError("");
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
    setNewTitleError(null);
  };

  const handleUpdateProduct = async () => {
    try {
      titleSchema.parse(newTitle);
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        setNewTitleError(error.errors[0].message);
      }
      return;
    }

    if (!newTitle.trim()) {
      alert("Please enter a product title.");
      return;
    }

    if (!selectedProduct) return;

    const response = await fetch(
      `https://dummyjson.com/products/${selectedProduct.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
        }),
      }
    );

    if (response.ok) {
      const updatedProduct = { ...selectedProduct, title: newTitle };
      const updatedProducts = products.map((p) =>
        p.id === updatedProduct.id ? updatedProduct : p
      );
      setProducts(updatedProducts);
      setIsModalOpen(false);
      setNewTitle("");
    }
  };

  const handleCreateModalOpen = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
    setIsEditMode(false);
    setNewTitleError("");
    setNewProductTitleError("");
  };

  const handleCreateInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewProductTitle(event.target.value);
    setNewProductTitleError("");
  };

  const handleCreateProduct = async () => {
    try {
      titleSchema.parse(newProductTitle);
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        setNewProductTitleError(error.errors[0].message);
      }
      return;
    }

    if (!newProductTitle.trim()) {
      alert("Please enter a product title.");
      return;
    }

    const response = await fetch("https://dummyjson.com/products/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newProductTitle,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setProducts([...products, data]);
      setIsModalOpen(false);
      setNewProductTitle("");
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    const response = await fetch(
      `https://dummyjson.com/products/${productId}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      const updatedProducts = products.filter(
        (product) => product.id !== productId
      );
      setProducts(updatedProducts);
    }
  };

  return (
    <>
      <Navbar />
      <Flex direction="column" align="center" justify="center" mt={50}>
        <Button onClick={handleCreateModalOpen} mb={50}>
          Create Product
        </Button>
        <Text mb={5} fontSize="xl" textAlign="center">
          {userData ? `Logged in as: ${userData.username}` : "Not logged in"}
        </Text>
        {userData ? (
          <Button mb={20} onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <Button mb={20} onClick={handleLogin}>
            Login
          </Button>
        )}
        <Box>
          <Input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            mb={50}
          />
          {loading ? (
            <Text>Loading...</Text>
          ) : (
            <>
              {products.length > 0 ? (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                  {products.map((product) => (
                    <ProductCardComponent
                      key={product.id}
                      product={product}
                      handleOpenModal={handleOpenModal}
                      handleDeleteProduct={handleDeleteProduct}
                    />
                  ))}
                </SimpleGrid>
              ) : (
                <Text>No products found.</Text>
              )}
            </>
          )}
        </Box>
        <Flex justify="center" mt={4} mb={34}>
          <Button
            colorScheme="blue"
            onClick={handlePrevPage}
            disabled={page === 1}
            mr={2}
          >
            Previous
          </Button>
          <Button colorScheme="blue" onClick={handleNextPage} ml={2}>
            Next
          </Button>
        </Flex>
        <ModalComponent
          isOpen={isModalOpen}
          handleCloseModal={handleCloseModal}
          newTitle={newTitle}
          handleInputChange={handleInputChange}
          newTitleError={newTitleError}
          newProductTitleError={newProductTitleError}
          handleUpdateProduct={handleUpdateProduct}
          handleCreateProduct={handleCreateProduct}
          handleCreateInputChange={handleCreateInputChange}
          isEditMode={isEditMode}
        />
        {!loading && products.length > 5 && <Footer />}
      </Flex>
    </>
  );
};

export default ProductList;
