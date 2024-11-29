import { Container, Heading, Button, DropdownMenu, Badge } from "@medusajs/ui";
import { useEffect, useState } from "react";
import { defineRouteConfig } from "@medusajs/admin-sdk";
import {
  Gift,
  EllipsisHorizontal,
  EllipseGreenSolid,
  EllipseRedSolid,
  PencilSquare,
  Trash,
  EyeSlash,
} from "@medusajs/icons";

const BrandsPage = () => {
  const [products, setProducts] = useState<Record<string, string>[]>([]);

  useEffect(() => {
    fetch(`/admin/products?is_giftcard=true`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(({ products: giftCards }) => {
        setProducts(giftCards);
      });
  }, []);

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
        <Button variant="secondary">Create Gift Card</Button>
      </Container>
      {products.map((product) => {
        console.log("====================================");
        console.log("product", product.variants);
        console.log("====================================");

        return (
          <Container className="p-8 grid grid-cols-[8%_1fr_8%] gap-4">
            <div className="shadow-elevation-card-rest hover:shadow-elevation-card-hover transition-fg group relative aspect-square size-full cursor-pointer overflow-hidden rounded-[8px]">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="size-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-between">
              <div>
                <Heading level="h1" className="font-bold">
                  {product.title}
                </Heading>
                <p className="line-clamp-1">{product.description}</p>
              </div>
              <div className="flex flex-row gap-4">
                {product?.variants?.length > 0 &&
                  product?.variants?.map((variant) => {
                    console.log("====================================");
                    console.log("variant", variant);
                    console.log("====================================");
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
                    // onClick={() => {
                    //   setOpenedVariant(variant);
                    //   setOpenedDialogType("thumbnail");
                    // }}
                    className="gap-x-2"
                  >
                    <PencilSquare className="text-ui-fg-subtle" />
                    Edit
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    // onClick={() => {
                    //   setOpenedVariant(variant);
                    //   setOpenedDialogType("media");
                    // }}
                    className="gap-x-2"
                  >
                    <EyeSlash className="text-ui-fg-subtle" />
                    {product.status === "published" ? "Unpublish" : "Publish"}
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    // onClick={() => {
                    //   setOpenedVariant(variant);
                    //   setOpenedDialogType("media");
                    // }}
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
                  <EllipseRedSolid />
                )}
                <p className="capitalize">{product.status}</p>
              </div>
            </div>
          </Container>
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
