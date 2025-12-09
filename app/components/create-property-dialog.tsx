import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@/db/schemas/users";
import { PlusIcon } from "lucide-react";
import { createProperty } from "../actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CreatePropertyDialogProps = {
  managers: User[];
  accountants: User[];
};

export function CreatePropertyDialog({
  managers,
  accountants,
}: CreatePropertyDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" /> Create Property
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Property</DialogTitle>
          <DialogDescription>
            Create a new property to get started.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-6" action={createProperty}>
          <div className="grid gap-2">
            <Label htmlFor="type">Management type</Label>
            <Select name="type" required>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WEG">WEG</SelectItem>
                <SelectItem value="MV">MV</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="propertyName">Property name</Label>
            <Input
              id="propertyName"
              name="propertyName"
              placeholder="e.g. Main Street 12"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="propertyManager">Property manager</Label>
            <Select name="propertyManager">
              <SelectTrigger id="propertyManager">
                <SelectValue
                  placeholder={
                    managers.length ? "Select manager" : "No managers available"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {managers.length ? (
                  managers.map((manager) => (
                    <SelectItem key={manager.id} value={manager.id}>
                      {manager.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-manager" disabled>
                    No managers available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="accountant">Accountant</Label>
            <Select name="accountant">
              <SelectTrigger id="accountant">
                <SelectValue
                  placeholder={
                    accountants.length
                      ? "Select accountant"
                      : "No accountants available"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {accountants.length ? (
                  accountants.map((accountant) => (
                    <SelectItem key={accountant.id} value={accountant.id}>
                      {accountant.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-accountant" disabled>
                    No accountants available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="divisionDeclaration">
              Declaration of division (Teilungserklärung)
            </Label>
            <Input
              id="divisionDeclaration"
              name="divisionDeclaration"
              type="file"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            />
          </div>

          <DialogFooter className="flex justify-between w-full">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Create Property</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreatePropertyDialog;
