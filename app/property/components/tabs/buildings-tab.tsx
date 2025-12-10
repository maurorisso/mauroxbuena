import { getBuildingsByPropertyId, getUnitsByBuildingId } from "../../actions";
import BuildingsItem from "../buildings-item";
import { CreateBuildingDialog } from "../create-building-dialog";
const BuildingsTab = async ({ propertyId }: { propertyId: string }) => {
  const buildings = await getBuildingsByPropertyId(propertyId);
  const buildingsWithUnits = await Promise.all(
    buildings.map(async (building) => {
      const units = await getUnitsByBuildingId(building.id);
      return { building, units };
    })
  );
  return (
    <div className="flex flex-col gap-4 items-center justify-between w-full">
      <div className="flex items-center justify-between w-full">
        <h2 className="text-lg font-semibold">Buildings</h2>
        <CreateBuildingDialog propertyId={propertyId} />
      </div>
      <div className="flex flex-col gap-4 w-full">
        {buildingsWithUnits.map(({ building, units }) => (
          <BuildingsItem key={building.id} building={building} units={units} />
        ))}
      </div>
    </div>
  );
};

export default BuildingsTab;
