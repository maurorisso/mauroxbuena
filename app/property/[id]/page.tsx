import { Suspense } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";

async function PropertyHeader({ id }: { id: string }) {
  const property = await fetchPropertyById(id);
  if (!property) {
    return notFound();
  }

  const [managerName, accountantName] = await Promise.all([
    property.managerId ? getUserNameById(property.managerId) : null,
    property.accountantId ? getUserNameById(property.accountantId) : null,
  ]);

  return (
    <section className="flex justify-between gap-4 w-full p-4 border rounded-lg bg-white ">
      <div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{property.name}</h1>
            <Badge>{property.type}</Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground shrink-0" />
            <p className="text-sm text-muted-foreground">
              {managerName || "N/A"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Calculator className="h-4 w-4 text-muted-foreground shrink-0" />
            <p className="text-sm text-muted-foreground">
              {accountantName || "N/A"}
            </p>
          </div>
        </div>
      </div>

      <PropertyStats id={id} />
    </section>
  );
}

async function PropertyStats({ id }: { id: string }) {
  const [units, buildings] = await Promise.all([
    getUnitsByPropertyId(id),
    getBuildingsByPropertyId(id),
  ]);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <House className="h-4 w-4 text-muted-foreground shrink-0" />
        <p className="text-sm text-muted-foreground">{units.length} units</p>
      </div>
      <div className="flex items-center gap-1">
        <Building className="h-4 w-4 text-muted-foreground shrink-0" />
        <p className="text-sm text-muted-foreground">
          {buildings.length} buildings
        </p>
      </div>
    </div>
  );
}

async function PropertyTabs({ id }: { id: string }) {
  const [units, buildings] = await Promise.all([
    getUnitsByPropertyId(id),
    getBuildingsByPropertyId(id),
  ]);

  return (
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
  );
}

function PropertyHeaderSkeleton() {
  return (
    <section className="flex justify-between gap-4 w-full p-4 border rounded-lg bg-white ">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
      </div>
    </section>
  );
}

function PropertyTabsSkeleton() {
  return (
    <div className="w-full p-4">
      <div className="flex gap-2 mb-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-20" />
      </div>
      <div className="flex flex-col gap-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  );
}

const PropertyPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  return (
    <div className="flex items-center justify-center w-full flex-col gap-4">
      <div className="flex items-center justify-between w-full mt-2">
        <Button variant="outline" className="bg-white" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>
      <Suspense fallback={<PropertyHeaderSkeleton />}>
        <PropertyHeader id={id} />
      </Suspense>
      <section className="flex justify-between w-full p-4">
        <Suspense fallback={<PropertyTabsSkeleton />}>
          <PropertyTabs id={id} />
        </Suspense>
      </section>
    </div>
  );
};

export default PropertyPage;
