import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import Cart, {generateCartItemsFrom} from "./Cart"
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard"
import "./Products.css";


// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
import "./Products.css";*/


/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */


const Products = () => {
  const [cardArray, setCardArray] = useState([])
  const [cartData, setCartData] = useState([])
  const [loading, setLoading] = useState(false)
  const [emptySearch, setEmptySearch] = useState(false)
  const [timerId, setTimerId] = useState(0)
  const { enqueueSnackbar } = useSnackbar();
  const [username, setUsername] = useState("")
  const [token, setToken] = useState("")
  const [allProducts, setAllProducts] = useState([])
  const [cartFullData, setCartFullData] = useState([])
  //let allProducts = []

  useEffect(()=>{
    let result = generateCartItemsFrom(cartData, allProducts)
    setCartFullData(result)
  },[cartData, allProducts]);
//   const arrayEquals = (a, b) => {
//     return Array.isArray(a) &&
//         Array.isArray(b) &&
//         a.length === b.length &&
//         a.every((val, index) => val === b[index]);
// }
  
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    setLoading(true)
    try{
    let res = await axios.get(`${config.endpoint}/products`)
    setLoading(false)
    setCardArray(res.data)
    setAllProducts(res.data)
    setEmptySearch(false)
    }catch(e){
      setLoading(false)
      if (e.response) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return
    }
    //act( ()=>{setCardArray(res.data)})
    
    //let cardArray = res.data
  };
  useEffect(()=>{
    // console.log("Refresh...")
    performAPICall()
    const nextUsername = localStorage.getItem("username");
    const nextToken = localStorage.getItem("token");
    if (nextToken !== token){
      setToken(nextToken)
    }
    if (nextUsername!== username){
      setUsername(nextUsername)
    }
    fetchCart(nextToken)

  },[])
  
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    if (text !== ""){
      try{
        setLoading(true)
        let res = await axios.get(`${config.endpoint}/products/search?value=${text}`)
        setLoading(false)
        
        //console.log(res.data)
        setCardArray(res.data)
        setEmptySearch(false)
      }catch(e){
        setLoading(false)
        if (e.response) {
          setEmptySearch(true)
          //enqueueSnackbar(e.response.data.message, { variant: "error" });
        } else {
          enqueueSnackbar(
            "Check that the backend is running, reachable and returns valid JSON.",
            {
              variant: "error",
            }
          );
        }
        return
      }
    }else{
      performAPICall()
    }
  };
  const handleSearch = async (e) => {
    //console.log(e.target.value)
    debounceSearch(e)
    //performSearch(e.target.value)
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (e, debounceTimeout) => {

    if (timerId !== 0){
      clearTimeout(timerId)
    }
    let id = setTimeout(()=>{performSearch(e.target.value)},500)
    setTimerId(id)
    //performSearch(e.target.value)
  };


  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      let res = await axios.get(`${config.endpoint}/cart`, {headers:{
        "Authorization":`Bearer ${token}`
      }})
      //console.log(res.data)
      setCartData(res.data)
      return res.data
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      setCartData(null)
      return null;
    }
  };


  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    for (let i=0; i<items.length; i++){
      if (items[i]["productId"] === productId){
        return true
      }
    }
    return false
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options //= { preventDuplicate: false }
  ) => {
    // console.log("addToCart")
    console.log(items)
    if (options.preventDuplicate && isItemInCart(items, productId)){
      enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item.",{
        variant: "warning",
      });
      return
    }
    try{
    let res = await axios.post(`${config.endpoint}/cart`, 
    {productId, qty}, 
    {headers:{
      Authorization:`Bearer ${token}`, 
      "Content-type":"application/json"
    }})
    //console.log("Response from post to /cart", res.data)
    setCartData(res.data)

    // let result = generateCartItemsFrom(res.data, products)
    // setCartFullData(result)

  }catch(e){
    //setLoading(false)
    if (e.response) {
      enqueueSnackbar(e.response.data.message, { variant: "error" });
    } else {
      enqueueSnackbar(
        "Check that the backend is running, reachable and returns valid JSON.",
        {
          variant: "error",
        }
      );
    }
    return
  }
  //fetchCart(token);
  };
  const handleAddToCart = (e, product)=>{
    if (!token){
      enqueueSnackbar("Login to add an item to the Cart",{
        variant: "warning",
      });
      return
    }
    
    //console.log(e.target)
    //console.log(product)
    addToCart(token, cartData, allProducts, product["_id"], 1, { preventDuplicate: true })
  }


  return (
    <div>

      <Header productPage handleSearch={handleSearch} username={username} setUsername={setUsername}>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}

      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        onChange={(e)=>{handleSearch(e)}}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
      />
      <Grid container>
        <Grid item xs={12} md={(username !== null)?9:12}>
       <Grid container>
         <Grid item className="product-grid">
           <Box className="hero">
             <p className="hero-heading">
               India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
               to your door step
             </p>
           </Box>
         </Grid>
       </Grid>
       {!loading && emptySearch && <Box className="empty-symbol"><SentimentDissatisfied/><Box className="empty-symbol-text">No products found</Box></Box>}
       {!loading && !emptySearch && <Grid container spacing={2} style={{padding:"20px"}}>
       {cardArray.map((element, index)=>{
        //console.log(element)
        return  (<Grid key={index} item xs={6} md={3}>
                  <ProductCard product={element} handleAddToCart={handleAddToCart}/>
                </Grid>)
       })}
       </Grid>}
       {loading && <Box className="progress-symbol"><CircularProgress />Loading products...</Box>}
        {/* TODO: CRIO_TASK_MODULE_CART - Display the Cart component */}
        </Grid>
        {(username !== null) && <Grid item xs={12} md={3} className="cart-outer">
          <Cart items={cartFullData} addToCart={addToCart} products={allProducts} token={token}/>
        </Grid>}
        </Grid>

      <Footer />
    </div>
  );
};

export default Products;
