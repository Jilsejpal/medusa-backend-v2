import { useEffect, useState } from "react";
import { IconButton, CurrencyInput, Label, Button, Select } from "@medusajs/ui";
import { Plus, Trash } from "@medusajs/icons";
import axios from "axios";

type Props = {
  onChange: (value: { amount: number; currency: string }[]) => void;
};

const AddDenomination = (props: Props) => {
  const [inputs, setInputs] = useState<
    { id: number; amount: number; currency: string }[]
  >([]);
  const [region, setRegion] = useState<
    { currency_code: string; value: string }[]
  >([]);

  const handleAddInput = () => {
    const defaultCurrency = region.length > 0 ? region[0].currency_code : "USD"; // Default to the first currency or fallback to "USD"
    setInputs([
      ...inputs,
      { id: Date.now(), amount: 0, currency: defaultCurrency },
    ]);
  };

  const handleRemoveInput = (id: number) => {
    const updatedInputs = inputs.filter((input) => input.id !== id);
    setInputs(updatedInputs);
    props.onChange(
      updatedInputs.map((input) => ({
        amount: input.amount,
        currency: input.currency,
      }))
    );
  };

  const handleAmountChange = (index: number, value: string) => {
    const amount = parseFloat(value) || 0;
    const updatedInputs = inputs.map((input, i) =>
      i === index ? { ...input, amount } : input
    );
    setInputs(updatedInputs);
    props.onChange(
      updatedInputs.map(({ amount, currency }) => ({ amount, currency }))
    );
  };

  const handleCurrencyChange = (index: number, currency: string) => {
    const updatedInputs = inputs.map((input, i) =>
      i === index ? { ...input, currency } : input
    );
    setInputs(updatedInputs);
    props.onChange(
      updatedInputs.map(({ amount, currency }) => ({ amount, currency }))
    );
  };

  const getCurrency = async () => {
    const res = await axios.get("/admin/regions", {
      withCredentials: true,
    });
    setRegion(res?.data?.regions);
  };

  useEffect(() => {
    getCurrency();
  }, []);

  useEffect(() => {
    // Set a default input when regions are fetched
    if (region?.length > 0 && inputs?.length === 0) {
      handleAddInput();
    }
  }, [region]);

  return (
    <div>
      {inputs.map((input, index) => (
        <div key={input.id} className="flex flex-col gap-2">
          <Label className="font-medium font-sans">Amount</Label>
          <div className="flex items-center mb-4 gap-4">
            <div className="w-[250px]">
              <Select
                value={input.currency}
                onValueChange={(value) => handleCurrencyChange(index, value)}
              >
                <Select.Trigger>
                  <Select.Value
                    placeholder="Select a currency"
                    value={input?.currency}
                  />
                </Select.Trigger>
                <Select.Content>
                  {region?.map((item) => (
                    <Select.Item
                      key={item.value}
                      value={item.currency_code}
                      className="uppercase"
                    >
                      {item.currency_code}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
            </div>
            <div className="w-[400px]">
              <CurrencyInput
                symbol={input?.currency}
                code={input?.currency}
                onChange={(event) =>
                  handleAmountChange(index, event.target.value)
                }
              />
            </div>
            <IconButton onClick={() => handleRemoveInput(input.id)}>
              <Trash className="text-rose-600" />
            </IconButton>
          </div>
        </div>
      ))}

      <Button
        onClick={handleAddInput}
        variant="transparent"
        className="flex items-center gap-2"
        type="button"
      >
        <Plus />
        <Label className="font-medium font-sans">Add Denomination</Label>
      </Button>
    </div>
  );
};

export default AddDenomination;
