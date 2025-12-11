"use client";

import { Property } from "@/db/schemas/properties";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  UserCog,
  Calculator,
  Calendar,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { deleteProperty } from "../actions";
import { useState } from "react";

type PropertyItemProps = {
  property: Property & {
    managerName: string;
    accountantName: string;
  };
};

const formatDate = (date: Date) => format(date, "dd.MM.yyyy");

const PropertyItem = ({ property }: PropertyItemProps) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProperty(property.id);
      setShowDeleteDialog(false);
      router.refresh();
    } catch (error) {
      // Check if this is a Next.js redirect error - if so, let it propagate
      if (
        error &&
        typeof error === "object" &&
        "digest" in error &&
        typeof error.digest === "string" &&
        error.digest.startsWith("NEXT_REDIRECT")
      ) {
        throw error;
      }
      console.error("Failed to delete property:", error);
      alert("Failed to delete property. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="hover:shadow-sm transition-shadow shadow-none relative">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/property/${property.id}`}
            className="flex-1 min-w-0 flex items-center gap-2"
          >
            <CardTitle className="text-lg font-semibold leading-tight mb-1 truncate">
              {property.name}
            </CardTitle>
            <Badge className="text-xs" variant="outline">
              {property.type}
            </Badge>
          </Link>
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  disabled={isDeleting}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialog
              open={showDeleteDialog}
              onOpenChange={setShowDeleteDialog}
            >
              <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Property</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete &quot;{property.name}&quot;?
                    This action cannot be undone. This will also delete all
                    associated buildings and units.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <Link href={`/property/${property.id}`} className="block">
        <CardContent className="pt-0 flex gap-2">
          <div className="flex items-center gap-2.5 text-sm">
            <UserCog className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-muted-foreground mb-0.5">
                Manager
              </div>
              <div className="font-medium truncate">{property.managerName}</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-sm">
            <Calculator className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-muted-foreground mb-0.5">
                Accountant
              </div>
              <div className="font-medium truncate">
                {property.accountantName}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex items-center gap-2.5 text-sm w-full">
            <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="text-xs text-muted-foreground">
              Created{" "}
              <span className="font-medium text-foreground">
                {formatDate(property.createdAt ?? new Date())}
              </span>
            </div>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default PropertyItem;
