import { Payment, columns } from "./columns";
import { DataTable } from "./data-table";

async function getData() {
  // Faz uma requisição à API externa
  const res = await fetch("https://dummyjson.com/products");

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  // Extrai os dados da resposta
  const { products } = await res.json();

  // Mapear para o formato `Payment`, se necessário
  const formattedData = products.map((product: any) => ({
    id: product.id,
    title: product.title,
    price: product.price,
    description: product.description,
    category: product.category,
  }));

  return formattedData;
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
