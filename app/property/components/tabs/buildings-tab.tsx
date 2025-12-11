import { getBuildingsByPropertyId, getUnitsByBuildingId } from "../../actions";
import BuildingsItem from "../buildings-item";
import { CreateBuildingDialog } from "../create-building-dialog";
import { Building } from "@/db/schemas/buildings";
type BuildingsTabProps = {
  buildings: Building[];
  propertyId: string;
};

const BuildingsTab = async ({ buildings, propertyId }: BuildingsTabProps) => {
  const buildingsWithUnits = await Promise.all(
    buildings.map(async (building) => {
      const units = await getUnitsByBuildingId(building.id);
      return { building, units };
    })
  );
  return (
    <div className="flex flex-col  items-center justify-between w-full">
      <div className="flex items-center justify-between w-full mb-4">
        <h2 className="text-lg font-semibold">Buildings</h2>
        <CreateBuildingDialog propertyId={propertyId} />
      </div>
      <div className="flex flex-col gap-4 w-full">
        {buildingsWithUnits.length > 0 ? (
          buildingsWithUnits.map((building) => (
            <BuildingsItem
              key={building.building.id}
              building={building.building}
              units={building.units}
            />
          ))
        ) : (
          <div className="text-sm text-muted-foreground rounded-lg border p-4 bg-white flex flex-col gap-2 items-center justify-center">
            <p> No buildings found</p>
            <p>Create a new building to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuildingsTab;
