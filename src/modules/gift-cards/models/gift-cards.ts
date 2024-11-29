import { model } from "@medusajs/framework/utils";

export const GiftCards = model.define("gift-cards", {
  id: model.id().primaryKey(),
  name: model.text(),
});
