import { Property } from "@/db/schemas/properties";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, UserCog, Calculator, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

type PropertyItemProps = {
  property: Property & {
    managerName: string;
    accountantName: string;
  };
};

const formatDate = (date: Date) => format(date, "dd.MM.yyyy");

const PropertyItem = ({ property }: PropertyItemProps) => {
  return (
    <Link href={`/property/${property.id}`}>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0 flex items-center gap-2">
              <CardTitle className="text-lg font-semibold leading-tight mb-1">
                {property.name}
              </CardTitle>
              <Badge className="text-xs" variant="outline">
                {property.type}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 flex gap-2">
          <div className="flex items-center gap-2.5 text-sm">
            <UserCog className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-muted-foreground mb-0.5">
                Manager
              </div>
              <div className="font-medium truncate">{property.managerName}</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-sm">
            <Calculator className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-muted-foreground mb-0.5">
                Accountant
              </div>
              <div className="font-medium truncate">
                {property.accountantName}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex items-center gap-2.5 text-sm w-full">
            <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="text-xs text-muted-foreground">
              Created{" "}
              <span className="font-medium text-foreground">
                {formatDate(property.createdAt ?? new Date())}
              </span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default PropertyItem;
