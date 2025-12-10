import { buildings } from "@/db/schemas/buildings";
import { units } from "@/db/schemas/units";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { CreateUnitDialog } from "./create-unit-dialog";
import UnitsItem from "./units-item";

const BuildingsItem = ({
  building,
  units: buildingUnits,
}: {
  building: typeof buildings.$inferSelect;
  units: (typeof units.$inferSelect)[];
}) => {
  return (
    <Card className="  rounded-lg  bg-white shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center justify-between w-full">
          <div className="text-lg font-semibold">
            {building.street} {building.houseNumber}
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium">
              {buildingUnits.length} units
            </div>
            <CreateUnitDialog buildingId={building.id} />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground flex items-center gap-1">
          <MapPin className="w-4 h-4" /> {building.zipCode} {building.city}
        </div>

        {buildingUnits.length > 0 && (
          <div className="flex flex-col gap-2">
            {buildingUnits.map((unit) => (
              <UnitsItem key={unit.id} unit={unit} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BuildingsItem;
