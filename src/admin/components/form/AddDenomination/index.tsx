import React, { useState } from "react";
import { Button, CurrencyInput, Label } from "@medusajs/ui";
import { Plus, Trash } from "@medusajs/icons";

type Props = {};

const AddDenomination = (props: Props) => {
  const [inputs, setInputs] = useState<{ id: number }[]>([]);

  const handleAddInput = () => {
    setInputs([...inputs, { id: Date.now() }]);
  };

  const handleRemoveInput = (id: number) => {
    setInputs(inputs.filter((input) => input.id !== id));
  };

  return (
    <div>
      {inputs.map((input) => (
        <div key={input.id} className="flex flex-col gap-2">
          <Label className="font-medium font-sans">Amount</Label>
          <div className="flex items-center mb-4 gap-10">
            <CurrencyInput symbol="MURs" code="MUR" />
            <Button
              variant="transparent"
              onClick={() => handleRemoveInput(input.id)}
            >
              <Trash />
            </Button>
          </div>
        </div>
      ))}

      <Button
        onClick={handleAddInput}
        variant="transparent"
        className="flex items-center gap-2"
      >
        <Plus />
        <Label className="font-medium font-sans">Add Denomination</Label>
      </Button>
    </div>
  );
};

export default AddDenomination;
