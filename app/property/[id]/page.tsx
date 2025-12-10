import { fetchPropertyById, getBuildingsByPropertyId } from "../actions";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BuildingsTab from "../components/tabs/buildings-tab";
import UnitsTab from "../components/tabs/units-tab";
import { getUnitsByPropertyId, getUserNameById } from "@/app/actions";
import { ArrowLeft, Building, Calculator, House, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
  const units = await getUnitsByPropertyId(id);
  const buildings = await getBuildingsByPropertyId(id);
  return (
    <div className="flex items-center justify-center w-full flex-col gap-4">
      <div className="flex items-center justify-between w-full mt-2">
        <Button variant="outline" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>
      <section className="flex justify-between gap-4 w-full p-4 border rounded-lg bg-white ">
        <div>
          {" "}
          <div>
            {" "}
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{property.name}</h1>
              <Badge>{property.type}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground shrink-0" />
              <p className="text-sm text-muted-foreground">
                {property.managerId
                  ? getUserNameById(property.managerId)
                  : "No manager"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Calculator className="h-4 w-4 text-muted-foreground shrink-0" />
              <p className="text-sm text-muted-foreground">
                {property.accountantId
                  ? getUserNameById(property.accountantId)
                  : "No accountant"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <House className="h-4 w-4 text-muted-foreground shrink-0" />
            <p className="text-sm text-muted-foreground">
              {units.length} units
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Building className="h-4 w-4 text-muted-foreground shrink-0" />
            <p className="text-sm text-muted-foreground">
              {buildings.length} buildings
            </p>
          </div>
        </div>
      </section>
      <section className="flex  justify-between w-full    p-4">
        <Tabs className="w-full " defaultValue="buildings">
          <TabsList>
            <TabsTrigger value="buildings">Buildings</TabsTrigger>
            <TabsTrigger value="units">Units</TabsTrigger>
          </TabsList>
          <TabsContent value="buildings">
            <BuildingsTab buildings={buildings} propertyId={id} />
          </TabsContent>
          <TabsContent value="units">
            <UnitsTab units={units} />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default PropertyPage;
