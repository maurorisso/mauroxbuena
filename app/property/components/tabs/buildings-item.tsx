import { buildings } from "@/db/schemas/buildings";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin } from "lucide-react";

const BuildingsItem = ({
  building,
}: {
  building: typeof buildings.$inferSelect;
}) => {
  return (
    <Card className="  rounded-lg  bg-white shadow-none">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {building.street} {building.houseNumber}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground flex items-center gap-1">
          <MapPin className="w-4 h-4" /> {building.zipCode} {building.city}
        </div>
      </CardContent>
    </Card>
  );
};

export default BuildingsItem;
