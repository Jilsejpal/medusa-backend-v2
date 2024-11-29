import { MedusaService } from "@medusajs/framework/utils";
import { GiftCards } from "./models/gift-cards";

class GiftCardsModuleService extends MedusaService({
  GiftCards,
}) {}

export default GiftCardsModuleService;
