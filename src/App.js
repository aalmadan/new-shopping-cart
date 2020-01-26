import React, { useEffect, useState } from "react";
import Dock from "react-dock";

const App = () => {
  const [products, setProducts] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("./data/products.json");
      const json = await response.json();

      setProducts(Object.values(json));
    };

    fetchProducts();
  }, []);

  return (
    <main>
      <header className="w-full flex flex-row-reverse h-20">
        <button
          className="p-5 bg-black text-white"
          onClick={() => setIsSidebarOpen(true)}
        >
          Cart
        </button>

        <Dock size="0.35" position="right" isVisible={isSidebarOpen}>
          <div className="bg-black text-white min-h-full overflox-x-auto">
            <button
              className="p-5 leading-none inline-block  text-center "
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              &times;
            </button>

            <div className="items-view  flex flex-wrap p-5">
              {products.map(product => (
                <div key={product.sku} className="w-full p flex px-2 mb-5">
                  <div className="w-1/6">
                    <img
                      src={"/products/" + product.sku + "_2.jpg"}
                      className="block"
                    />
                  </div>
                  <div className="w-5/6 px-2">
                    <h1>{product.title}</h1>
                    <h3 className="opacity-50">
                      {product.style} <br /> Quantiy: 0
                    </h3>
                  </div>
                  <div className="w-1/6">
                    <h3 className="text-yellow-500">
                      {product.currencyFormat}
                      {product.price}
                    </h3>

                    <div className="flex">
                      <button className="w-20 h-5">+</button>
                      <button className="w-20 h-5">-</button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="w-full p-5 flex justify-between">
                <div className="text-lg">Subtotal</div>
                <div className="text-lg text-yellow-500">$100</div>
              </div>
              <button className="bg-gray-900 text-center w-full p-4 block">
                Checkout
              </button>
            </div>
          </div>
        </Dock>
      </header>

      <div className="catalogue flex w-full max-w-6xl mx-auto">
        <div className="sidebar w-1/6 pr-5">
          <div className="mb-4">
            <h2>Size</h2>

            {["S", "M", "L", "XL"].map((size, i) => (
              <label key={i} className="tshirt-sizes">
                <input className="hidden" type="checkbox" />
                <span className="inline-block p-2 w-10 h-10 text-center rounded-full bg-gray-300 mr-2 select-none">
                  {size}
                </span>
              </label>
            ))}
          </div>

          <div>
            <h2>Order by</h2>
            <select name="" id="">
              <option value="">Lowest to highest</option>
              <option value="">Highest to lowest</option>
            </select>
          </div>
        </div>

        <div className="w-5/6">
          <p className="mb-3">{products.length} Product(s) found.</p>

          <div className="items-view  flex flex-wrap">
            {products.map(product => (
              <div
                key={product.sku}
                className="w-1/4 pb-16 flex flex-col px-2 text-center"
              >
                <div className="flex-1">
                  <img
                    src={"/products/" + product.sku + "_1.jpg"}
                    className="block mx-auto"
                  />
                  <h1>{product.title}</h1>
                  <h3>
                    {product.currencyFormat}
                    {product.price}
                  </h3>
                  <h3>{product.description}</h3>
                </div>
                <div>
                  <select className="w-1/2 bg-gray-400 py-2">
                    {["S", "M", "L", "XL"].map((size, i) => (
                      <option value="">{size}</option>
                    ))}
                  </select>
                </div>
                <div className="bg-black text-white text-center py-4 mt-5">
                  Add to cart
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default App;
