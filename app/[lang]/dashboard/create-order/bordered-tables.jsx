"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import { users, columns } from "./data";
const BorderedTables = () => {

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "age", label: "Age" },
    { key: "point", label: "Points" },
  ];
  
  const users = [
    { id: 1, name: "Ahmed Ali", email: "ahmed@example.com", age: 25, point: 120 },
    { id: 2, name: "Sara Mohamed", email: "sara@example.com", age: 28, point: 150 },
    { id: 3, name: "Omar Tarek", email: "omar@example.com", age: 30, point: 90 },
    { id: 4, name: "Laila Hassan", email: "laila@example.com", age: 22, point: 200 },
    { id: 5, name: "Mohamed Samir", email: "mohamed@example.com", age: 27, point: 180 },
  ];
  return (
    <Table className="border border-default-300">
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.key} className="border border-default-300 ">
              {column.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.slice(0, 5).map((item) => (
          <TableRow key={item.id}>
            <TableCell className="border border-default-300">
              {item.id}
            </TableCell>
            <TableCell className="border border-default-300">
              {item.name}
            </TableCell>
            <TableCell className="border border-default-300">
              {item.email}
            </TableCell>
            <TableCell className="border border-default-300">
              {item.age}
            </TableCell>
            <TableCell className="border border-default-300">
              {item.point}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BorderedTables;
