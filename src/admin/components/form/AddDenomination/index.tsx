import { useState } from "react";
import { IconButton, CurrencyInput, Label, Button } from "@medusajs/ui";
import { Plus, Trash } from "@medusajs/icons";

type Props = {
  onChange: (value: { amount: number }[]) => void;
};

const AddDenomination = (props: Props) => {
  const [inputs, setInputs] = useState<{ id: number; amount: number }[]>([]);

  const handleAddInput = () => {
    setInputs([...inputs, { id: Date.now(), amount: 0 }]);
  };

  const handleRemoveInput = (id: number) => {
    setInputs(inputs.filter((input) => input.id !== id));
    props.onChange(
      inputs
        .filter((input) => input.id !== id)
        .map((input) => ({ amount: input.amount }))
    );
  };

  const handleonChange = (index: number, value: string) => {
    const amount = parseFloat(value) || 0;
    const updatedInputs = inputs.map((input, i) =>
      i === index ? { ...input, amount } : input
    );
    setInputs(updatedInputs);
    props.onChange(updatedInputs.map((input) => ({ amount: input.amount })));
  };

  return (
    <div>
      {inputs.map((input, index) => (
        <div key={input.id} className="flex flex-col gap-2">
          <Label className="font-medium font-sans">Amount</Label>
          <div className="flex items-center mb-4 gap-4">
            <CurrencyInput
              symbol="MURs"
              code="MUR"
              onChange={(event) => handleonChange(index, event.target.value)}
            />
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
