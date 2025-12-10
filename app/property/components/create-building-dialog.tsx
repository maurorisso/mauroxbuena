"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusIcon } from "lucide-react";
import { createBuilding } from "../actions";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Spinner className="size-4" /> : "Create Building"}
    </Button>
  );
}

type CreateBuildingDialogProps = {
  propertyId: string;
};

export function CreateBuildingDialog({
  propertyId,
}: CreateBuildingDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" /> Add Building
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Building</DialogTitle>
          <DialogDescription>
            Add a new building to this property.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-6"
          action={async (formData: FormData) => {
            await createBuilding(formData);
            window.location.reload();
          }}
        >
          <input type="hidden" name="propertyId" value={propertyId} />

          <div className="grid gap-2">
            <Label htmlFor="street">Street</Label>
            <Input
              id="street"
              name="street"
              placeholder="e.g. Main Street"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="houseNumber">House Number</Label>
            <Input
              id="houseNumber"
              name="houseNumber"
              placeholder="e.g. 12a"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="zipCode">Zip Code</Label>
            <Input
              id="zipCode"
              name="zipCode"
              placeholder="e.g. 12345"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              placeholder="e.g. Berlin"
            />
          </div>

          <DialogFooter className="flex justify-between w-full">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateBuildingDialog;

