import { Property } from "@/db/schemas/properties";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
            <TableCell>{property.managerId ?? "—"}</TableCell>
            <TableCell>{property.accountantId ?? "—"}</TableCell>
            <TableCell>{formatDate(property.createdAt ?? null)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PropertiesTable;
