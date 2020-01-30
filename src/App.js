import React, { useEffect, useState } from "react";
import Dock from "react-dock";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

import { Message, Button } from "rbx";
import "rbx/index.css";

// FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyDhSRqsmr6S8FdXxxhYVBTtJhJyKmUdITo",
  authDomain: "new-shopping-cart-a43b0.firebaseapp.com",
  databaseURL: "https://new-shopping-cart-a43b0.firebaseio.com",
  projectId: "new-shopping-cart-a43b0",
  storageBucket: "new-shopping-cart-a43b0.appspot.com",
  messagingSenderId: "483434111822",
  appId: "1:483434111822:web:025fc10b03ca1d61fff41f"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref();

const App = () => {
  const [products, setProducts] = useState([]);
  const [inventory, setInventory] = useState({});
  const [cart, setCart] = useState([]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const uiConfig = {
    signInFlow: "popup",
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
    callbacks: {
      signInSuccessWithAuthResult: () => false
    }
  };
  const [user, setUser] = useState(null);
  const Welcome = ({ user }) => (
    <div className="p-5 flex items-center">
      <div className="pr-5">Welcome, {user.displayName}</div>
      <Button primary onClick={() => firebase.auth().signOut()}>
        Log out
      </Button>
    </div>
  );

  const SignIn = () => (
    <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
  );
  const Banner = ({ user, title }) => (
    <React.Fragment>
      {user ? <Welcome user={user} /> : <SignIn />}
    </React.Fragment>
  );

  useEffect(() => {
    firebase.auth().onAuthStateChanged(setUser);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("./data/products.json");
      const json = await response.json();

      setProducts(Object.values(json));
      setCart([
        {
          id: 12064273040195392,
          quantity: 2,
          size: "M"
        }
      ]);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchInventory = async () => {
      const response = await fetch("./data/inventory.json");
      const json = await response.json();

      setInventory(json);
    };

    fetchInventory();
  }, []);

  function changeProductQuantity(id, size, isIncrement) {
    const newCart = Array.from(cart);
    const orderIndex = newCart.findIndex(
      order => order.id === id && order.size === size
    );
    if (isIncrement) {
      newCart[orderIndex].quantity += 1;
    } else {
      newCart[orderIndex].quantity -= 1;
    }

    setCart(newCart);
  }

  function addToCart(id, size) {
    const updatedCart = Array.from(cart);
    const doesItemExist = cart.findIndex(
      item => item.id === id && item.size === size
    );

    console.log(doesItemExist);

    if (doesItemExist > -1) {
      updatedCart[doesItemExist].quantity++;
      setCart(updatedCart);
    } else {
      updatedCart.push({
        id,
        size,
        quantity: 1
      });

      setCart(updatedCart);
    }
  }

  return (
    Object.values(inventory).length > 0 && (
      <main>
        <header className="w-half flex flex-row-reverse h-20">
          <button
            className="p-5 bg-black text-white"
            onClick={() => setIsSidebarOpen(true)}
          >
            Cart
          </button>
          <div className="p-1 ">
            <Banner className="padding-5" user={user}>
              Sign In
            </Banner>
          </div>
          <Dock size="0.35" position="right" isVisible={isSidebarOpen}>
            <div className="bg-black text-white min-h-full overflox-x-auto">
              <button
                className="p-5 leading-none inline-block  text-center "
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                &times;
              </button>

              <div className="items-view  flex flex-wrap p-5">
                {cart
                  .map(cartItem => {
                    return {
                      meta: cartItem,
                      product: products.find(pr => pr.sku === cartItem.id)
                    };
                  })
                  .map(({ product, meta }) => (
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
                          {meta.size} | {product.style} <br /> Quantiy:{" "}
                          {meta.quantity}
                        </h3>
                      </div>
                      <div className="w-1/6">
                        <h3 className="text-yellow-500">
                          {product.currencyFormat}
                          {product.price}
                        </h3>
                        <div
                          className="cursor-pointer"
                          onClick={() => {
                            const updatedCart = Array.from(cart);
                            const index = cart.findIndex(
                              item =>
                                item.id == product.sku &&
                                item.size === meta.size
                            );
                            updatedCart.splice(index, 1);
                            setCart(updatedCart);
                          }}
                        >
                          &times;
                        </div>

                        <div className="flex">
                          <button
                            className="w-20 h-5"
                            disabled={
                              inventory[meta.id][meta.size] == meta.quantity
                            }
                            onClick={() =>
                              changeProductQuantity(
                                product.sku,
                                meta.size,
                                true
                              )
                            }
                          >
                            +
                          </button>
                          <button
                            className="w-20 h-5"
                            disabled={meta.quantity < 2}
                            onClick={() =>
                              changeProductQuantity(
                                product.sku,
                                meta.size,
                                false
                              )
                            }
                          >
                            -
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                <div className="w-full p-5 flex justify-between">
                  <div className="text-lg">Subtotal</div>
                  <div className="text-lg text-yellow-500">
                    $
                    {cart.reduce((a, b) => {
                      const itemPrice = products.find(item => item.sku == b.id)
                        .price;
                      return a + itemPrice * b.quantity;

                      // return
                    }, 0)}
                  </div>
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
                      {["S", "M", "L", "XL"]
                        .filter(size => {
                          const ref = inventory[product.sku];

                          return ref ? ref[size] > 0 : true;
                        })
                        .map((size, i) => (
                          <option value={size}>{size}</option>
                        ))}
                    </select>
                  </div>
                  <button
                    className="bg-black text-white text-center py-4 mt-5"
                    onClick={e => {
                      var select = e.target.previousElementSibling.querySelector(
                        "select"
                      ).value;

                      addToCart(Number(product.sku), select);
                      setIsSidebarOpen(true);
                    }}
                  >
                    Add to cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  );
};

export default App;
