import React, { useEffect } from "react";
import ProductScrollerPWA from './../../components/product-scroller/index.jsx';
import { Container, Box, Button, Input, Text } from '@chakra-ui/react'
import { useState } from "react";

const ProductScroller = () => {

    const [productID, setProductID] = useState("");
    const [productList, setProductList] = useState([])

    const handleChangeProductID = (e) => {-
         setProductID(e.target.value)
    }


    //add new product to list
    const addProduct = () => {
        if(productID !== "" && !productList.includes(productID)) {
            const newArr = [...productList]
            newArr.push(productID)
            setProductList(newArr)
            setProductID("")
        }
    }

    //remove product from list
    const removeProduct = (removedProduct) => {
        const newArr = [...productList]
        for(let i = 0 ; i < newArr.length; i++) {
            if(newArr[i] == removedProduct){
                newArr.splice(i, 1);
                setProductList(newArr)
            }
        }
    }

    return (
        <>
        <Container>
            <Box>
                <Box mt={3}>
                    <Input
                        placeholder='Product ID you want to add scroller' mb={2}
                        value={productID}
                        onChange={handleChangeProductID}
                    />

                    {/* added products  */}
                    {productList?.map((product, i) => {
                        return (
                        <Box key={i} display ="flex" justifyContent="end" mb={2}>
                            <Box width="100%" border="1px" borderColor="gray.100" borderRadius={5} mr={3} display="flex" alignItems="center" paddingInline={3}>
                                {product}
                            </Box>
                            <Button onClick={() => {removeProduct(product)}} mb={2}>Remove</Button>
                        </Box> )
                    }
                    )}
                        
                </Box>
                <Box display="flex" flexDirection="column">
                    <Button onClick={addProduct} mb={2}>Add Field</Button>
                    <Button>Get Products</Button>
                </Box>
            </Box>

            <Box>
                Product Scroller
                
                <ProductScrollerPWA />
            {/* products=
            isLoading= */}
            </Box>


        </Container>


        </>
    )
}

export default ProductScroller;