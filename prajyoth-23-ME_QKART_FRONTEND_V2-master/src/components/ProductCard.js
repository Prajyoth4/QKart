import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  //console.log("Product", product)
const data = {
  "name":"Tan Leatherette Weekender Duffle",
  "category":"Fashion",
  "cost":150,
  "rating":4,
  "image":"https://crio-directus-assets.s3.ap-south-1.amazonaws.com/ff071a1c-1099-48f9-9b03-f858ccc53832.png",
  "_id":"PmInA797xJhMIPti"
  }
  return (
    <Card className="card">
      <CardMedia className="card-img" component="img" alt="Paella dish" image={product.image} />
      <CardContent>
    <Typography color="primary" variant="h5">
      {product.name}
    </Typography>
    <Typography color="textSecondary" variant="subtitle2">
      {`$${product.cost}`}
    </Typography>
    <Rating
    readOnly
    name="simple-controlled"
    value={product.rating}
    />
    <Button value={product["_id"]} style={{display:"block"}} variant="contained" onClick={(e)=>{handleAddToCart(e, product)}}><AddShoppingCartOutlined/>ADD TO CART</Button>
  </CardContent>
    </Card>
  );
};

export default ProductCard;
