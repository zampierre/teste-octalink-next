"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import * as React from "react";
import { Input } from "@/components/ui/input";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState<string>(""); // Novo estado para filtro global
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [payments, setPayments] = React.useState(data); // Estado para os dados de pagamento
  const [newPayment, setNewPayment] = React.useState({
    title: "",
    price: 0,
    description: "",
    category: "",
  });

  const table = useReactTable({
    data: payments,
    columns,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter, // Define o filtro global na tabela
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      globalFilter, // Define o estado do filtro global
      columnVisibility,
    },
  });

  const handleAddPayment = async () => {
    try {
      const response = await fetch("https://dummyjson.com/products/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newPayment.title,
          price: newPayment.price,
          description: newPayment.description,
          category: newPayment.category,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add payment");
      }

      const newProduct = await response.json();

      setPayments((prev) => [
        ...prev,
        { id: newProduct.id, ...newPayment } as TData, // Garantir que a estrutura é compatível com TData
      ]);
      setNewPayment({ title: "", price: 0, description: "", category: "" }); // Limpa os campos
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Search all columns..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)} // Atualiza o filtro global
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Formulário para adicionar um novo pagamento */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Add New Payment</h3>
        <div className="grid gap-4 grid-cols-2 mb-2">
          <Input
            placeholder="Title"
            value={newPayment.title}
            onChange={(e) =>
              setNewPayment({ ...newPayment, title: e.target.value })
            }
          />
          <Input
            placeholder="Price"
            type="number"
            value={newPayment.price}
            onChange={(e) =>
              setNewPayment({
                ...newPayment,
                price: parseFloat(e.target.value),
              })
            }
          />
          <Input
            placeholder="Description"
            value={newPayment.description}
            onChange={(e) =>
              setNewPayment({ ...newPayment, description: e.target.value })
            }
          />
          <Input
            placeholder="Category"
            value={newPayment.category}
            onChange={(e) =>
              setNewPayment({ ...newPayment, category: e.target.value })
            }
          />
        </div>
        <Button onClick={handleAddPayment}>Add Payment</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
