import React from "react";
import {
  Text,
  Button,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";

interface ModalUpdateProps {
  isOpen: boolean;
  handleCloseModal: () => void;
  newTitle: string;
  newProductTitleError: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleCreateInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  newTitleError: string | null;
  handleUpdateProduct: () => void;
  handleCreateProduct: () => void;
  isEditMode: boolean;
}

const ModalComponent: React.FC<ModalUpdateProps> = ({
  isOpen,
  handleCloseModal,
  handleInputChange,
  newTitleError,
  newProductTitleError,
  handleUpdateProduct,
  handleCreateInputChange,
  handleCreateProduct,
  isEditMode,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={handleCloseModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isEditMode ? "Update Product Title" : "Create Product"}
        </ModalHeader>
        <ModalBody>
          <Input
            type="text"
            placeholder={
              isEditMode ? "Enter new title..." : "Enter product title..."
            }
            onChange={isEditMode ? handleInputChange : handleCreateInputChange}
            isInvalid={isEditMode ? !!newTitleError : !!newProductTitleError}
          />
          {newTitleError && <Text color="red.500">{newTitleError}</Text>}
          {newProductTitleError && (
            <Text color="red.500">{newProductTitleError}</Text>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={isEditMode ? handleUpdateProduct : handleCreateProduct}
          >
            {isEditMode ? "Update" : "Create"}
          </Button>
          <Button onClick={handleCloseModal}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalComponent;
