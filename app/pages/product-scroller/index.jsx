import React, { useEffect } from "react";
import ProductScrollerPWA from './../../components/product-scroller/index.jsx';
import { Container, Box, Button, Input, Stack } from '@chakra-ui/react'
import { useState } from "react";
// import { ShopperLogin, ShopperSearch, helpers } from "commerce-sdk-isomorphic";
import PropTypes from 'prop-types'

// Constants
import {
    MAX_CACHE_AGE,
    HOME_SHOP_PRODUCTS_CATEGORY_ID,
    HOME_SHOP_PRODUCTS_LIMIT
} from '../../constants'

const ProductScroller = ({productSearchResult, isLoading, addedProducts, productListProp }) => {

    const [productID, setProductID] = useState("");
    const [productList, setProductList] = useState([]);

    const handleChangeProductID = (e) => {
         setProductID(e.target.value)
    }

    //add new product to list
    const addProduct = () => {
        console.log("idkidk")
        if(productID !== "" && !productList.includes(productID)) {
            const newArr = [...productList]
            newArr.push(productID)
            setProductList(newArr)
            setProductID("")
            productListProp = newArr
            console.log("productListProp addddd", productListProp)
        }
    }

    //remove product from list
    const removeProduct = (removedProduct) => {
        const newArr = [...productList]
        for(let i = 0 ; i < newArr.length; i++) {
            if(newArr[i] == removedProduct){
                newArr.splice(i, 1);
                setProductList(newArr)
                productListProp = newArr
                console.log("productListProp removvee", productListProp)
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

            <Box mb={3}>
                Product Scroller

                {addedProducts && (
                <>
                        <Stack pt={8} spacing={16}>
                            <ProductScrollerPWA
                                products={addedProducts.data}
                                isLoading={isLoading}
                            />
                        </Stack>
                    </>
                )}
            </Box>

        </Container>


        </>
    )
}





ProductScroller.getProps = async ({res, api, location, productListProp}) => {
    if(res) {
        res.set('Cache-Control', `max-age=${MAX_CACHE_AGE}`)
    }

    const urlParams = new URLSearchParams(location.search)

    const productSearchResult = await api.shopperSearch.productSearch({
        parameters: {
            refine: [`cgid=${HOME_SHOP_PRODUCTS_CATEGORY_ID}`, 'htype=master'],
            limit: HOME_SHOP_PRODUCTS_LIMIT
        }
    })

    const addedProducts = await api.shopperProducts.getProducts({
        parameters: {
            // id: urlParams.get('pid') || productId,
            ids: "25589419M,91736743M,25591410M"
            // ids: productListProp.join(",")
            // ids: productListProp ? `${productListProp}.join(",")` : ""
        }
    
        // parameters: {
        //     ids: ["91736743M", "25493613M"]
        // }
    })

    return {productSearchResult, addedProducts, productListProp}
}





ProductScroller.propTypes = {
    /**
     * The search result object showing all the product hits, that belong
     * in the supplied category.
     */
    productSearchResult: PropTypes.object,
    /**
     * The current state of `getProps` when running this value is `true`, otherwise it's
     * `false`. (Provided internally)
     */
    isLoading: PropTypes.bool,

    addedProducts: PropTypes.object,

    productListProp: PropTypes.array
}

export default ProductScroller;