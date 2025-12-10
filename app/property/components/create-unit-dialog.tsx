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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusIcon } from "lucide-react";
import { createUnit } from "../actions";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Spinner className="size-4" /> : "Create Unit"}
    </Button>
  );
}

type CreateUnitDialogProps = {
  buildingId: string;
};

export function CreateUnitDialog({ buildingId }: CreateUnitDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 rounded-md"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Add Unit</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Unit</DialogTitle>
          <DialogDescription>
            Add a new unit to this building.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          action={async (formData: FormData) => {
            await createUnit(formData);
            window.location.reload();
          }}
        >
          <input type="hidden" name="buildingId" value={buildingId} />

          <div className="grid gap-2">
            <Label htmlFor="unitNumber">Unit Number *</Label>
            <Input
              id="unitNumber"
              name="unitNumber"
              placeholder="e.g. 1A, 2B"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="type">Type *</Label>
            <Select name="type" required>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select unit type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Apartment">Apartment</SelectItem>
                <SelectItem value="Office">Office</SelectItem>
                <SelectItem value="Garden">Garden</SelectItem>
                <SelectItem value="Parking">Parking</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="size">Size (m²) *</Label>
            <Input
              id="size"
              name="size"
              type="number"
              step="0.01"
              placeholder="e.g. 75.50"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="floor">Floor</Label>
            <Input id="floor" name="floor" type="number" placeholder="e.g. 2" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="entrance">Entrance</Label>
            <Input id="entrance" name="entrance" placeholder="e.g. A, B" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="rooms">Rooms</Label>
            <Input
              id="rooms"
              name="rooms"
              type="number"
              step="0.5"
              placeholder="e.g. 2.5"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="coOwnershipShare">Co-ownership Share</Label>
            <Input
              id="coOwnershipShare"
              name="coOwnershipShare"
              type="number"
              step="0.0001"
              placeholder="e.g. 0.1234"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="constructionYear">Construction Year</Label>
            <Input
              id="constructionYear"
              name="constructionYear"
              type="number"
              placeholder="e.g. 2020"
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

export default CreateUnitDialog;
