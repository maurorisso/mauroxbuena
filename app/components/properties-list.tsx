import { Property } from "@/db/schemas/properties";
import { getUserNameById } from "../actions";
import PropertyItem from "./property-item";

type PropertiesListProps = {
  properties: Property[];
};

const PropertiesList = async ({ properties }: PropertiesListProps) => {
  const propertiesWithUsers = await Promise.all(
    properties.map(async (property) => {
      const managerName = property.managerId
        ? await getUserNameById(property.managerId as string)
        : "—";
      const accountantName = property.accountantId
        ? await getUserNameById(property.accountantId as string)
        : "—";

      return {
        ...property,
        managerName,
        accountantName,
      };
    })
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {propertiesWithUsers.map((property) => (
        <PropertyItem key={property.id} property={property} />
      ))}
    </div>
  );
};

export default PropertiesList;
