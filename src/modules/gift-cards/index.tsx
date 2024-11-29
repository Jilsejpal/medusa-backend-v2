import { Module } from "@medusajs/framework/utils";
import GiftCardsModuleService from "./services";

export const GIFT_CARD_MODULE = "giftCardsModuleService";

export default Module(GIFT_CARD_MODULE, {
  service: GiftCardsModuleService,
});
