import UnitsItem from "../units-item";
import { Unit } from "@/db/schemas/units";
type UnitsTabProps = {
  units: Unit[];
};

const UnitsTab = async ({ units }: UnitsTabProps) => {
  return (
    <div className="flex flex-col gap-4 items-center justify-between w-full">
      <div className="flex items-center justify-between w-full">
        <h2 className="text-lg font-semibold">Units</h2>
      </div>
      <div className="flex flex-col gap-4 w-full">
        {units.length > 0 ? (
          units.map((unit) => <UnitsItem key={unit.id} unit={unit} />)
        ) : (
          <div className="text-sm text-muted-foreground rounded-lg border p-4 bg-white flex flex-col gap-2 items-center justify-center">
            <p> No units found</p>
            <p>Create a new unit to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnitsTab;
