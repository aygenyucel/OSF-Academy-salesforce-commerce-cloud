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

import {helpers, ShopperLogin, ShopperSearch, ShopperProducts} from 'commerce-sdk-isomorphic';


const ProductScroller = ({productSearchResult, isLoading, addedProducts, productListProp }) => {

    const [productID, setProductID] = useState("");
    const [productList, setProductList] = useState([]);
    const [productListString, setProductListString] = useState("") //format: "25589419M,91736743M,25591410M"
    

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

            setProductListString(productListString.split(",") + ","+ productID.toString())
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

    useEffect(() => {
        console.log("sdsd", addedProducts)
    }, [addedProducts])

    // useEffect(() => {
    //     const newProductListString = productList.join(",").toString()
    //     setProductListString(newProductListString)
    //     console.log("jksnfsdfk",newProductListString)
    // }, [productList])


    // Create a configuration to use when creating API clients
    const config = {
        proxy: 'http://localhost:3000/mobify/proxy/api', // Routes API calls through a proxy when set
        headers: {},
        parameters: {
            clientId: '1d763261-6522-4913-9d52-5d947d3b94c4',
            organizationId: 'f_ecom_zzte_053',
            shortCode: 'kv7kzm78',
            siteId: 'RefArch'
        },
        throwOnBadResponse: true,
    };
    const shopperLogin = new ShopperLogin(config);

   const  getGuestAccessToken = async() => {
        // Execute Public Client OAuth with PKCE to acquire guest tokens
        const {access_token, refresh_token} = await helpers.loginGuestUser(
            shopperLogin,
            {redirectURI: `http://localhost:3000/callback`} // Callback URL must be configured in SLAS Admin
            );
            return access_token
    }


    const [shopperSearch, setShopperSearch] = useState(null)
    const [searchResult, setSearchResult] = useState(null)
    const [shopperProductsClient, setShopperProductsClient] = useState(null)
    const [shopperProducts, setShopperProducts] = useState(null)

    const createSearchResult = async() => {
        await shopperSearch.productSearch({
            parameters: {q: 'shirt'},
            }).then((newSearchResult) => {setSearchResult(newSearchResult)
            })
    }

    const createShopperSearch = async () => {
       await getGuestAccessToken().then((access_token) => {
        //    console.log("access", access_token)
            const newShopperSearch = new ShopperSearch({
                ...config,
                headers: {authorization: `Bearer ${access_token}`},
                });
            setShopperSearch(newShopperSearch)
            console.log(":///", newShopperSearch)
            return newShopperSearch
        })
    }

    const getSearchResult = async () => {
        await createShopperSearch().then(() => {createSearchResult()})
        
    }

    const createShopperProductsClient = async () => {
        await getGuestAccessToken().then((access_token) => {
            const newShopperProductsClient = new ShopperProducts({
                ...config,
                headers: {authorization: `Bearer ${access_token}`},
                });
            setShopperProductsClient(newShopperProductsClient) 
            return newShopperProductsClient
         })
        
    }

    const getShopperProducts = async (productListString) => {
        await createShopperProductsClient().then(async () => {
            const products = await shopperProductsClient.getProducts({parameters: {
                // ids: "25589419M,91736743M,25591410M"
                ids: productListString
            }})
            // const editedProducts = []
            // console.log("bgbgbg", );

            // products.map((product) => {
            //     console.log("fsdljfs", product);
            //     editedProducts.push(
            //         {currency: product.currency,
            //         name: product.name,
            //         price: product.price,
            //         productID: product.id,
            //         image: product.imageGroups[0].images[0]}
            //         )
            //     })
            setShopperProducts(products)
            return products
        })
    }

    const [editedProducts, setEditedProducts] = useState(null)

    const editProductsObjectForScroller = () => {
        let editedProductsForScroller = []
        console.log("bgbgbg", shopperProducts);

        shopperProducts?.data.map((product) => {
            console.log("zzzzz", product);
            editedProductsForScroller.push(
                {currency: product.currency,
                name: product.name,
                price: product.price,
                productId: product.id,
                image: product.imageGroups[0].images[0]}
                )
        })

        setEditedProducts(editedProductsForScroller)
    }

    useEffect(() => {
    //    getSearchResult()
    //    createShopperProductsClient()
    console.log("productListString =>>>>", productListString)
       getShopperProducts(productListString)
    }, [productListString])

    useEffect(() => {
        editProductsObjectForScroller()
    }, [shopperProducts])

    useEffect(() => {
        console.log("edited products =>>>>**", editedProducts)
    }, [editedProducts])

    useEffect(() => {
        console.log("searchResult =>>>>", searchResult)
        console.log("shopperProducts =>>>>", shopperProducts)
    }, [searchResult, shopperProducts])
    
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
                            {/* <ProductScrollerPWA
                                products={addedProducts.data}
                                isLoading={isLoading}
                            /> */}
                            <ProductScrollerPWA
                                // products={[ {currency: addedProducts.data[0].currency,
                                // name: addedProducts.data[0].name,
                                // price: addedProducts.data[0].price,
                                // productID: addedProducts.data[0].id,
                                // image: addedProducts.data[0].imageGroups[0].images[0]}]}
                                products = {editedProducts}
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
            ids: "25589419M,91736743M,25591410M"
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