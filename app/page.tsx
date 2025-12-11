import { Suspense } from "react";
import { Building2 } from "lucide-react";
import { fetchManagersAndAccountants, fetchProperties } from "./actions";
import PropertiesList from "./components/properties-list";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { HouseHeart } from "lucide-react";
import CreatePropertyDialog from "./components/create-property-dialog";
import { Skeleton } from "@/components/ui/skeleton";

async function PropertiesContent() {
  const properties = await fetchProperties();

  return (
    <div className="w-full rounded-xl shadow-none border-zinc-200  p-6  dark:border-zinc-800 dark:bg-zinc-900">
      {properties.length > 0 ? (
        <PropertiesList properties={properties} />
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HouseHeart size={24} />
            </EmptyMedia>
            <EmptyTitle>No Properties Yet</EmptyTitle>
            <EmptyDescription>
              You haven&apos;t created any properties yet. Get started by
              creating your first property.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <CreatePropertyDialogWrapper />
          </EmptyContent>
        </Empty>
      )}
    </div>
  );
}

async function CreatePropertyDialogWrapper() {
  const staff = await fetchManagersAndAccountants();

  return (
    <CreatePropertyDialog
      managers={staff.managers}
      accountants={staff.accountants}
    />
  );
}

function PropertiesContentSkeleton() {
  return (
    <div className="w-full rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    </div>
  );
}

function CreatePropertyDialogSkeleton() {
  return <Skeleton className="h-10 w-32" />;
}

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black flex-col gap-4">
      <div className="flex items-center justify-between border-b border-zinc-200 p-4 w-full bg-white">
        <div>
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground rounded-md p-2">
              <Building2 />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold">Property Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Manage your WEG and MV properties
              </p>
            </div>
          </div>
        </div>
        <Suspense fallback={<CreatePropertyDialogSkeleton />}>
          <CreatePropertyDialogWrapper />
        </Suspense>
      </div>
      <main className=" min-h-screen w-full container flex-col  gap-4 flex">
        <Suspense fallback={<PropertiesContentSkeleton />}>
          <PropertiesContent />
        </Suspense>
      </main>
    </div>
  );
}
