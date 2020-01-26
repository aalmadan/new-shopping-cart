import React, { useEffect, useState } from 'react';

const App = () => {
  // const [data, setData] = useState({});
  // const products = Object.values(data);
  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     const response = await fetch('./data/products.json');
  //     const json = await response.json();
  //     setData(json);
  //   };
  //   fetchProducts();
  // }, []);

  return (
    <main>
      <header className="w-full flex flex-row-reverse">
        <div className="p-5 bg-black text-white">Cart</div>
      </header>

      <div className="catalogue flex w-full max-w-5xl mx-auto">
        <div className="sidebar w-1/3 pr-5">
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
        
        <div className="items-view w-2/3">
          item goes here
        </div>
      </div>
    </main>
  );
};

export default App;
