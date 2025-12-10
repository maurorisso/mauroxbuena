import { units } from "@/db/schemas/units";
import { Bed, Calendar, DoorOpen, Percent, Ruler, Square } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Building } from "lucide-react";
const UnitsItem = ({ unit }: { unit: typeof units.$inferSelect }) => {
  return (
    <div className="flex items-center gap-2 border border-border rounded-lg p-2">
      <div className="flex items-center gap-2 bg-muted rounded-md p-2">
        <DoorOpen className="w-4 h-4" />
      </div>

      <div className="flex-1 flex  justify-between">
        <div>
          {" "}
          <div className="text-sm font-medium">
            {unit.unitNumber} {unit.entrance ? `(${unit.entrance})` : ""}{" "}
            <Badge variant="outline" className="text-xs">
              {unit.type}
            </Badge>{" "}
          </div>
          <div className="text-sm text-muted-foreground">
            {unit.floor} floor
          </div>
        </div>

        <div>
          <div className="flex gap-2">
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Ruler className="w-4 h-4" />
              {unit.size} m²
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-1  ">
              <Bed className="w-4 h-4" />
              {unit.rooms} rooms
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Percent className="w-4 h-4" />
              {unit.coOwnershipShare} co-ownership share
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {unit.constructionYear} construction year
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitsItem;
