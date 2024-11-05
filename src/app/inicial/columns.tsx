"use client";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

// Define o tipo Payment conforme o novo modelo de dados
export type Payment = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="truncate max-w-xs">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Category
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="truncate max-w-xs">{row.getValue("category")}</div>
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Price
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(price);

      return (
        <div
          className={`text-right font-medium ${
            price < 100 ? "text-red-500" : "text-gray-800"
          }`}
        >
          {formatted}
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Description
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="truncate max-w-xs">{row.getValue("description")}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      // Estados locais para armazenar valores de edição
      const [editedValues, setEditedValues] = useState({
        title: payment.title,
        price: payment.price,
        description: payment.description,
        category: payment.category,
      });

      const handleSave = () => {
        fetch(`https://dummyjson.com/products/${payment.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: editedValues.title,
            price: editedValues.price,
            description: editedValues.description,
            category: editedValues.category,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("Item atualizado:", data);
          })
          .catch((error) => {
            console.error("Erro ao atualizar o item:", error);
          });
      };

      // Função para deletar o item com confirmação
      const handleDelete = () => {
        const confirmDelete = window.confirm(
          "Tem certeza que deseja deletar este item?"
        );
        if (confirmDelete) {
          fetch(`https://dummyjson.com/products/${payment.id}`, {
            method: "DELETE",
          })
            .then((res) => res.json())
            .then((data) => {
              console.log("Item deletado:", data);
              // Aqui você pode adicionar uma função para remover o item da lista localmente, se necessário
            })
            .catch((error) => {
              console.error("Erro ao deletar o item:", error);
            });
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost">Edit</Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="p-4 space-y-2">
                    <p>Edit Payment</p>
                    <div>
                      <label>Title</label>
                      <Input
                        value={editedValues.title}
                        onChange={(e) =>
                          setEditedValues({
                            ...editedValues,
                            title: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label>Price</label>
                      <Input
                        type="number"
                        value={editedValues.price}
                        onChange={(e) =>
                          setEditedValues({
                            ...editedValues,
                            price: parseFloat(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <label>Description</label>
                      <Input
                        value={editedValues.description}
                        onChange={(e) =>
                          setEditedValues({
                            ...editedValues,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label>Category</label>
                      <Input
                        value={editedValues.category}
                        onChange={(e) =>
                          setEditedValues({
                            ...editedValues,
                            category: e.target.value,
                          })
                        }
                      />
                    </div>
                    <Button onClick={handleSave} className="mt-2">
                      Save
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete}>Deletar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
