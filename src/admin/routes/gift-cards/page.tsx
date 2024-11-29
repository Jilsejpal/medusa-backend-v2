import {
  Container,
  Heading,
  Button,
  DropdownMenu,
  Badge,
  FocusModal,
  Text,
} from "@medusajs/ui";
import { useEffect, useState } from "react";
import { defineRouteConfig } from "@medusajs/admin-sdk";
import {
  Gift,
  EllipsisHorizontal,
  EllipseGreenSolid,
  PencilSquare,
  Trash,
  EyeSlash,
  EllipseGreySolid,
  Eye,
} from "@medusajs/icons";
import DynamicForm from "../../components/form/DynamicForm";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const BrandsPage = () => {
  const [products, setProducts] = useState<Record<string, string>[]>([]);
  const formMethods = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/admin/products?is_giftcard=true`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(({ products: giftCards }) => {
        setProducts(giftCards);
      });
  }, []);

  const setProductStatus = async (product: Record<string, string>) => {
    const raw = {
      status: product.status === "published" ? "draft" : "published",
    };
    try {
      const res = await fetch(`/admin/products/${product.id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(raw),
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Failed to update product status:", errorData);
      }
      const { product: updatedProduct } = await res.json();
      console.log("Product updated successfully:", updatedProduct);
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.id === updatedProduct.id ? updatedProduct : p
        )
      );
    } catch (error) {
      console.error("Error updating product status:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/admin/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Failed to delete product:", errorData);
      }
      setProducts((prevProducts) => prevProducts.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const formSchema = {
    title: {
      label: "Name",
      fieldType: "input",
      props: {
        placeholder: "The Best Gift Card",
      },
      validation: {},
    },
    description: {
      label: "Description",
      fieldType: "textarea",
      props: {
        placeholder: "The best gift card of all time",
      },
      validation: {},
    },
    thumbnail: {
      label: "Thumbnail",
      fieldType: "file-upload",
      props: {
        placeholder: "1200 x 1600 (3:4) recommended, up to 10MB each",
        filetypes: ["image/gif", "image/jpeg", "image/png", "image/webp"],
        preview: false,
        multiple: true,
      },
      validation: {},
    },
    // price: {
    //   label: "Price",
    //   fieldType: "currency-input",
    //   props: {
    //     placeholder: "Enter price",
    //     preview: false,
    //     multiple: true,
    //     symbol: "MURs",
    //     code: "MUR",
    //   },
    //   validation: {},
    // },
    denominations: {
      fieldType: "add-denomination",
      props: {
        placeholder: "add",
        preview: false,
        multiple: true,
      },
      validation: {},
    },
  };

  const onSubmit = (data: any) => {
    console.log("data", data);
  };

  return (
    <div className="p-0 flex flex-col gap-4">
      <Container className="flex flex-col gap-2 p-8">
        <Heading level="h1" className="font-bold">
          Gift Cards
        </Heading>
        <p className="text-sm">Manage the Gift Cards of your medusa store</p>
      </Container>
      <Container className="flex flex-col gap-6 p-8">
        <div className="flex flex-col gap-2">
          <Heading level="h2" className="font-bold">
            Are you ready to sell your first Gift Card?
          </Heading>
          <p className="text-sm">No Gift Card has been added yet.</p>
        </div>
        <FocusModal>
          <FocusModal.Trigger asChild>
            <Button variant="secondary">Create Gift Card</Button>
          </FocusModal.Trigger>
          <FocusModal.Content>
            <FocusModal.Header />
            <FocusModal.Body className="flex flex-col items-center py-16 overflow-y-scroll">
              <div className="flex w-full max-w-lg flex-col gap-y-8">
                <div className="flex flex-col gap-y-1">
                  <Heading level="h2" className="font-bold">
                    Create Gift Card
                  </Heading>
                  <Text className="text-ui-fg-subtle">Gift Card Details</Text>
                </div>
                <DynamicForm
                  form={formMethods}
                  onSubmit={onSubmit}
                  schema={formSchema}
                />
              </div>
            </FocusModal.Body>
          </FocusModal.Content>
        </FocusModal>
      </Container>
      {products.map((product) => {
        return (
          <>
            <Container className="p-8 grid grid-cols-[auto_1fr_auto] gap-4">
              <div className="shadow-elevation-card-rest hover:shadow-elevation-card-hover transition-fg group relative aspect-square size-full cursor-pointer overflow-hidden rounded-[8px]">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-36 aspect-square object-cover"
                />
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <Heading level="h1" className="font-bold line-clamp-2">
                    {product.title}
                  </Heading>
                  <p className="line-clamp-1">{product.description}</p>
                </div>
                <div className="flex flex-row gap-4">
                  {product?.variants?.length > 0 &&
                    product?.variants?.map((variant) => {
                      return (
                        <Badge>
                          {variant?.prices[0]?.amount}{" "}
                          {variant?.prices[0]?.currency_code}
                        </Badge>
                      );
                    })}
                </div>
              </div>

              <div className="flex flex-col justify-between items-end">
                <DropdownMenu>
                  <DropdownMenu.Trigger asChild>
                    <Button
                      variant="secondary"
                      size="small"
                      className="w-6 h-6 p-0"
                    >
                      <EllipsisHorizontal />
                    </Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    <DropdownMenu.Item
                      onClick={() => {
                        navigate(`/products/${product.id}`);
                      }}
                      className="gap-x-2"
                    >
                      <PencilSquare className="text-ui-fg-subtle" />
                      Edit
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      onClick={() => {
                        setProductStatus(product);
                      }}
                      className="gap-x-2"
                    >
                      {product.status === "published" ? (
                        <EyeSlash className="text-ui-fg-subtle" />
                      ) : (
                        <Eye className="text-ui-fg-subtle" />
                      )}
                      {product.status === "published" ? "Unpublish" : "Publish"}
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      onClick={() => {
                        handleDelete(product.id);
                      }}
                      className="gap-x-2"
                    >
                      <Trash className="text-ui-fg-subtle" />
                      Delete
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu>
                <div className="flex items-center gap-2">
                  {product.status === "published" ? (
                    <EllipseGreenSolid />
                  ) : (
                    <EllipseGreySolid />
                  )}
                  <p className="capitalize">{product.status}</p>
                </div>
              </div>
            </Container>
          </>
        );
      })}
    </div>
  );
};

export default BrandsPage;

// TODO export configuration

export const config = defineRouteConfig({
  label: "Gift Cards",
  icon: Gift,
});
