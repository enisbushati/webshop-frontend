"use client";

import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
};

type BasketItem = Product & {
  quantity: number;
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [basket, setBasket] = useState<BasketItem[]>([]);
  const [error, setError] = useState("");
  const squareButton: React.CSSProperties = {
    width: "26px",
    height: "26px",
    border: "1px solid #999",
    background: "#fff",
    cursor: "pointer",
    fontSize: "16px",
    lineHeight: "1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };


  // Fetch products from Spring Boot
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data: Product[]) => setProducts(data))
      .catch((err) => setError(err.message));
  }, []);

function addToBasket(product: Product) {
  setBasket(prev => {
    const existing = prev.find(item => item.id === product.id);
    if (existing) {
      return prev.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }
    return [...prev, { ...product, quantity: 1 }];
  });
}
function increaseQuantity(id: number) {
  setBasket(prev =>
    prev.map(item =>
      item.id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    )
  );
}
function decreaseQuantity(id: number) {
  setBasket(prev =>
    prev
      .map(item =>
        item.id === id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter(item => item.quantity > 0)
  );
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
        {basket.map(item => (
  <div
    key={item.id}
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "8px",
    }}
  >
    <span>
      {item.name} – {item.price} € x {item.quantity}
    </span>

    <div style={{ display: "flex", gap: "6px" }}>
      <button
        onClick={() => increaseQuantity(item.id)}
        style={squareButton}
      >
        +
      </button>

      <button
        onClick={() => decreaseQuantity(item.id)}
        style={squareButton}
      >
        −
      </button>
    </div>
  </div>
))}

        {basket.length > 0 && (
  <>
    <hr />
    <strong>
      Total:{" "}
      {basket.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )} €
    </strong>
  </>
)}
      </div>
    </main>
  );
}


