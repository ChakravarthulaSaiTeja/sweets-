import { prisma } from "@/lib/prisma";

export default async function TestPage() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
    });

    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Database Test</h1>
        <p className="mb-4">Products found: {products.length}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="border p-4 rounded">
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-600">{product.category.name}</p>
              <p className="text-sm">SKU: {product.sku}</p>
              <p className="text-sm">Price: ₹{product.price.toString()}</p>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Database Error</h1>
        <p className="text-red-600">Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }
}
