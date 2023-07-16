import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useHistory, Link  } from "react-router-dom";
import "./Cart.css";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 * 
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */
export const generateCartItemsFrom = (cartData, productsData) => {
  // console.log("generateCartItemsFrom cartData",cartData)
  // console.log("generateCartItemsFrom productsData",productsData)
  if (productsData.length === 0 || cartData.length === 0){
    return []
  }
  let result = cartData.map(({productId, qty})=> {
    for (let i=0; i<productsData.length; i++){
      if (productsData[i]["_id"] === productId){
        return {...productsData[i], productId, qty}
      }
    }
  })

  // console.log("generateCartItemsFrom result", result)
  return result
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items = []) => {
  let total = 0;
  if (items.length === 0){
    return 0;
  }
  items.forEach((element)=>{
    total += (element.qty * element.cost)
  })
  return total
};

//};

// TODO: CRIO_TASK_MODULE_CHECKOUT - Implement function to return total cart quantity
/**
 * Return the sum of quantities of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products in cart
 *
 * @returns { Number }
 *    Total quantity of products added to the cart
 *
 */
export const getTotalItems = (items = []) => {
  let result = 0
  items.forEach((ele)=>{
    result += ele.qty
  })
  return result
};

// TODO: CRIO_TASK_MODULE_CHECKOUT - Add static quantity view for Checkout page cart
/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 * 
 * @param {Number} value
 *    Current quantity of product in cart
 * 
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 * 
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 * 
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 * 
 */
const ItemQuantity = ({
  value,
  handleAdd,
  handleDelete,
  productId,
  isReadOnly
}) => {
  return (
    <Stack direction="row" alignItems="center">
      {!isReadOnly && <IconButton size="small" color="primary" onClick={(e)=>{handleDelete(e, value, productId)}}>
        <RemoveOutlined />
      </IconButton>}
      <Box padding="0.5rem" data-testid="item-qty">
      {isReadOnly && "Qty: "}{value}
      </Box>
      {!isReadOnly && <IconButton size="small" color="primary" onClick={(e)=>{handleAdd(e, value, productId)}}>
        <AddOutlined />
      </IconButton>}
    </Stack>
  );
};

/**
 * Component to display the Cart view
 * 
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 * 
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 * 
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 * 
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 * 
 */
const Cart = ({
  products,
  items,
  addToCart,
  token,
  isReadOnly
}) => {
  // const [itemValue, setItemValue] = useState(0)
  const history = useHistory()


  useEffect(()=>{
    let result = getTotalCartValue(items)
    setTotalCartValue(result)
    // console.log("result", result)
  }, [items])
  const [totalCartValue, setTotalCartValue] = useState(0)



  const handleAdd = (e, value, productId)=>{
    //console.log("e.target", e)
    // console.log("handleAdd")
    addToCart(
      token,
      items,
      products,
      productId,
      value+1,
      { preventDuplicate: false }
    )
  }

  const handleDelete = (e, value, productId)=>{
    //console.log("e.target", e)
    // console.log("handleDelete")
    addToCart(
      token,
      items,
      products,
      productId,
      value-1,
      { preventDuplicate: false }
    )
    
  }
/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 * 
 * @param {Number} value
 *    Current quantity of product in cart
 * 
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 * 
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 * 
 * 
 */
 
  // console.log("items", items)

  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box>
        <Box className="cart">
        {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}
        {items.map((element)=>{
        return (<Box display="flex" alignItems="flex-start" padding="1rem">
            <Box className="image-container">
                <img
                    // Add product image
                    src={`${element.image}`}
                    // Add product name as alt eext
                    alt={`${element.name}`}
                    width="100%"
                    height="100%"
                />
            </Box>
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                height="6rem"
                paddingX="1rem"
            >
                <div>{ element.name }</div>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                <ItemQuantity
                // Add required props by checking implementation
                value={element.qty}
                handleAdd={handleAdd}
                handleDelete={handleDelete}
                productId={element.productId}
                isReadOnly={isReadOnly}
                />
                <Box padding="0.5rem" fontWeight="700">
                    ${element.cost}
                </Box>
                </Box>
            </Box>
        </Box>)
      })}
      <Box className="order-total"><Box>Order Total</Box><Box className="order-total-number" data-testid="cart-total">${totalCartValue}</Box></Box>
      {!isReadOnly && <Box className="checkout-btn"><Button variant="contained" onClick={()=>{history.push("/checkout")}}><ShoppingCart/>Checkout</Button></Box>}
      </Box>
      {isReadOnly && <Box className="order-details cart">
        <Box className="order-details-header">Order Details</Box>
        <Box>
          <Box className="order-details-row"><Box>Products</Box><Box>{getTotalItems(items)}</Box></Box>
          <Box className="order-details-row"><Box>Subtotal</Box><Box>${totalCartValue}</Box></Box>
          <Box className="order-details-row"><Box>Shipping Charges</Box><Box>${0}</Box></Box>
          <Box className="order-details-total"><Box>Total</Box><Box>${totalCartValue}</Box></Box>
        </Box>
        </Box>}
      </Box>
    </>
  );
};

export default Cart;
