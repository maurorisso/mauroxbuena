import { Button } from "@/components/ui/button";
import { fetchProperties } from "./actions";
import PropertiesTable from "./components/properties-table";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { HouseHeart, PlusIcon } from "lucide-react";
import CreatePropertyDialog from "./components/create-property-dialog";

export default async function Home() {
  const properties = await fetchProperties();
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className=" min-h-screen w-full container flex-col   py-32 px-16 gap-4 flex">
        <div className="flex items-center justify-between">
          {" "}
          <h1 className="text-2xl font-bold">Properties</h1>
          <CreatePropertyDialog />
        </div>
        <div className="w-full rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          {properties.length > 0 ? (
            <PropertiesTable properties={properties} />
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
                <CreatePropertyDialog />
              </EmptyContent>
            </Empty>
          )}{" "}
        </div>
      </main>
    </div>
  );
}
