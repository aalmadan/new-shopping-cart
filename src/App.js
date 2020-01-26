import React, { useEffect, useState } from 'react';

const App = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('./data/products.json');
      const json = await response.json();

      setProducts( Object.values(json) );
    };

    fetchProducts();
  }, []);

  return (
    <main>
      <header className="w-full flex flex-row-reverse">
        <div className="p-5 bg-black text-white">Cart</div>
      </header>

      <div className="catalogue flex w-full max-w-6xl mx-auto">
        <div className="sidebar w-1/6 pr-5">
          <div className="mb-4">
            <h2>Size</h2>

            { ['S', 'M', 'L', 'XL'].map( (size) => (
              <label className="tshirt-sizes">
              <input className="hidden" type="checkbox"/>
              <span className="inline-block p-2 w-10 h-10 text-center rounded-full bg-gray-300 mr-2 select-none">{size}</span>
            </label>
            )) }
            
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
            {products.map( product => (
              <div className="w-1/4 pb-16 flex flex-col px-2 text-center">
                <div className="flex-1">
                  <img src={"/products/" + product.sku + "_1.jpg"} className="block mx-auto"/>
                  <h1>{product.title}</h1>
                  <h3>{product.currencyFormat}{product.price}</h3>
                  <h3>{product.description}</h3>
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
