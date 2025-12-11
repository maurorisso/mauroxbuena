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
import { useFormStatus } from "react-dom";
import { useState } from "react";

function SubmitButton({ hasFile }: { hasFile: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Spinner className=" size-4" />
          {hasFile ? "Analyzing file..." : "Creating..."}
        </>
      ) : (
        "Create Property"
      )}
    </Button>
  );
}

function LoadingStatus({ hasFile }: { hasFile: boolean }) {
  const { pending } = useFormStatus();

  if (!pending) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Spinner className="size-4" />
      <span>
        {hasFile
          ? "Uploading and analyzing document. This may take a moment..."
          : "Creating property..."}
      </span>
    </div>
  );
}

function CancelButton() {
  const { pending } = useFormStatus();

  return (
    <DialogClose asChild>
      <Button variant="outline" type="button" disabled={pending}>
        Cancel
      </Button>
    </DialogClose>
  );
}

function FormFields({
  managers,
  accountants,
  setHasFile,
}: {
  managers: User[];
  accountants: User[];
  setHasFile: (hasFile: boolean) => void;
}) {
  const { pending } = useFormStatus();

  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="type">Management type</Label>
        <Select name="type" required disabled={pending}>
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
        <div className="flex flex-col gap-1">
          <Label htmlFor="propertyName">Property name</Label>
          <p className="text-xs text-muted-foreground">
            (This will be overwritten if you upload a declaration of division)
          </p>
        </div>
        <Input
          id="propertyName"
          name="propertyName"
          placeholder="e.g. Main Street 12"
          required
          disabled={pending}
        />
      </div>

      <div className="flex w-full gap-2">
        <div className="grid gap-2 w-full">
          <Label htmlFor="propertyManager">Property manager</Label>
          <Select name="propertyManager" disabled={pending}>
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

        <div className="grid gap-2 w-full">
          <Label htmlFor="accountant">Accountant</Label>
          <Select name="accountant" disabled={pending}>
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
          onChange={(e) => setHasFile((e.target.files?.length ?? 0) > 0)}
          disabled={pending}
        />
        <p className="text-xs text-muted-foreground">
          This will take a moment to process.
        </p>
      </div>
    </>
  );
}

type CreatePropertyDialogProps = {
  managers: User[];
  accountants: User[];
};

export function CreatePropertyDialog({
  managers,
  accountants,
}: CreatePropertyDialogProps) {
  const [hasFile, setHasFile] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className=" h-4 w-4" /> Create Property
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
          <FormFields
            managers={managers}
            accountants={accountants}
            setHasFile={setHasFile}
          />

          <LoadingStatus hasFile={hasFile} />

          <DialogFooter className="flex justify-between w-full">
            <CancelButton />
            <SubmitButton hasFile={hasFile} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreatePropertyDialog;
