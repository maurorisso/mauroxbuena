import { getBuildingsByPropertyId } from "../../actions";
import BuildingsItem from "./buildings-item";
import { CreateBuildingDialog } from "../create-building-dialog";
const BuildingsTab = async ({ propertyId }: { propertyId: string }) => {
  const buildings = await getBuildingsByPropertyId(propertyId);
  return (
    <div className="flex flex-col gap-4 items-center justify-between w-full">
      <div className="flex items-center justify-between w-full">
        <h2 className="text-lg font-semibold">Buildings</h2>
        <CreateBuildingDialog propertyId={propertyId} />
      </div>
      <div className="flex flex-col gap-4 w-full">
        {buildings.map((building) => (
          <BuildingsItem key={building.id} building={building} />
        ))}
      </div>
    </div>
  );
};

export default BuildingsTab;
