"use client";

import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [basket, setBasket] = useState<Product[]>([]);
  const [error, setError] = useState("");

  // Fetch products from Spring Boot
  useEffect(() => {
    fetch("http://localhost:8080/products")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data: Product[]) => setProducts(data))
      .catch((err) => setError(err.message));
  }, []);

  function addToBasket(product: Product) {
    setBasket((prev) => [...prev, product]);
  }

  function removeFromBasket(index: number) {
    setBasket((prev) => prev.filter((_, i) => i !== index));
  }

  if (error) return <h1> X {error}</h1>;

  return (
    <main style={{ display: "flex", gap: "40px", padding: "20px" }}>
      {/* PRODUCTS */}
      <div style={{ flex: 2 }}>
        <h1>🛒 Products</h1>

        {products.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h3>{p.name}</h3>
            <p>{p.category}</p>
            <strong>{p.price} €</strong>
            <br />
            <button onClick={() => addToBasket(p)}>
              Add to basket
            </button>
          </div>
        ))}
      </div>

      {/* BASKET */}
      <div style={{ flex: 1, borderLeft: "2px solid #ddd", paddingLeft: "20px" }}>
        <h2>🧺 Basket</h2>

        {basket.length === 0 && <p>Basket is empty</p>}
        {basket.map((item, index) => (
          <div key={index} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <span>
              {item.name} – {item.price} €
            </span>
            <button
              onClick={() => removeFromBasket(index)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "12px",
                padding: 0,
              }}
              aria-label="Remove from basket"
            >
              x
            </button>
          </div>
        ))}


        {basket.length > 0 && (
          <>
            <hr />
            <strong>
              Total:{" "}
              {basket.reduce((sum, item) => sum + item.price, 0)} €
            </strong>
          </>
        )}
      </div>
    </main>
  );
}
