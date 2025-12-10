import { fetchPropertyById } from "../actions";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BuildingsTab from "../components/tabs/buildings-tab";
import CreateBuildingDialog from "../components/create-building-dialog";

const PropertyPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const property = await fetchPropertyById(id);
  if (!property) {
    return notFound();
  }
  return (
    <div className="flex items-center justify-center w-full flex-col gap-4">
      <section className="flex flex-col gap-4 w-full p-4 border rounded-lg bg-white">
        <h1 className="text-2xl font-bold">{property?.name}</h1>
      </section>
      <section className="flex  justify-between w-full    p-4">
        <Tabs className="w-full " defaultValue="buildings">
          <TabsList>
            <TabsTrigger value="buildings">Buildings</TabsTrigger>
            <TabsTrigger value="units">Units</TabsTrigger>
          </TabsList>
          <TabsContent value="buildings">
            <BuildingsTab propertyId={id} />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default PropertyPage;
