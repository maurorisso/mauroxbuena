import { Property } from "@/db/schemas/properties";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getUserNameById } from "../actions";

type PropertiesTableProps = {
  properties: Property[];
};

const formatDate = (value: Date | null) =>
  value ? value.toLocaleDateString() : "—";

const PropertiesTable = ({ properties }: PropertiesTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Manager</TableHead>
          <TableHead>Accountant</TableHead>
          <TableHead>Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {properties.map((property) => (
          <TableRow key={property.id}>
            <TableCell className="font-medium">{property.name}</TableCell>
            <TableCell className="uppercase">{property.type}</TableCell>
            <TableCell>
              {getUserNameById(property.managerId as string)}
            </TableCell>
            <TableCell>
              {getUserNameById(property.accountantId as string)}
            </TableCell>
            <TableCell>{formatDate(property.createdAt ?? null)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PropertiesTable;
