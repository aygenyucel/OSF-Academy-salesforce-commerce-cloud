import React, { useEffect } from "react";
import ProductScrollerPWA from './../../components/product-scroller/index.jsx';
import { Container, Box, Button, Input, Stack } from '@chakra-ui/react'
import { useState } from "react";
import {helpers, ShopperLogin, ShopperProducts} from 'commerce-sdk-isomorphic';
// import PropTypes from 'prop-types'

// Constants
// import {
    //     MAX_CACHE_AGE,
    // } from '../../constants'
    
//props: {isLoading, addedProducts, productListProp }
const ProductScroller = () => {
        
    const [productID, setProductID] = useState("");
    const [productList, setProductList] = useState([]);
    //ids in array
    const [productListString, setProductListString] = useState("") 
    //format: "25589419M,91736743M,25591410M"
    //ids in string format for sending the ids to productScrollerPWA component
    

    const [shopperProductsClient, setShopperProductsClient] = useState(null)
    const [shopperProducts, setShopperProducts] = useState(null)
    const [editedProducts, setEditedProducts] = useState(null)
    //edited shopperProducts data for sending products to productScrollerPWA

    const handleChangeProductID = (e) => {
         setProductID(e.target.value)
    }

    //add new product to list
    const addProduct = () => {
        if(productID !== "" && !productList.includes(productID)) {
            const newArr = [...productList]
            newArr.push(productID)
            setProductList(newArr)
            setProductListString(productListString.split(",") + ","+ productID.toString())
            setProductID("")
        } else {
            console.log("Oops, invalid product ID!")
        }
    }

    //remove product from list
    const removeProduct = (removedProduct) => {
        const newArr = [...productList]
        for(let i = 0 ; i < newArr.length; i++) {
            if(newArr[i] == removedProduct){
            
                newArr.splice(i, 1);
                setProductList(newArr)
                console.log(removedProduct.concat(",").split(",").reverse().join(""))
                setProductListString(productListString.replace(removedProduct, ""))
                // editProductsObjectForScroller()
            }
        }
    }

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


    //getting an access token for guests
    const  getGuestAccessToken = async() => {
        // Execute Public Client OAuth with PKCE to acquire guest tokens
        const {access_token, refresh_token} = await helpers.loginGuestUser(
            shopperLogin,
            {redirectURI: `http://localhost:3000/callback`} // Callback URL must be configured in SLAS Admin
            );
            return access_token
    }

    // const [shopperSearch, setShopperSearch] = useState(null)
    // const [searchResult, setSearchResult] = useState(null)

    // const createSearchResult = async() => {
    //     await shopperSearch.productSearch({
    //         parameters: {q: 'shirt'},
    //         }).then((newSearchResult) => {setSearchResult(newSearchResult)
    //         })
    // }

    // const createShopperSearch = async () => {
    //    await getGuestAccessToken().then((access_token) => {
    //     //    console.log("access", access_token)
    //         const newShopperSearch = new ShopperSearch({
    //             ...config,
    //             headers: {authorization: `Bearer ${access_token}`},
    //             });
    //         setShopperSearch(newShopperSearch)
    //         console.log(":///", newShopperSearch)
    //         return newShopperSearch
    //     })
    // }

    // const getSearchResult = async () => {
    //     await createShopperSearch().then(() => {createSearchResult()}) 
    // }


    //creating shopper client with using the access token 
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

    //getting shopper products with provided IDs 
    const getShopperProducts = async (productListString) => {
        await createShopperProductsClient().then(async () => {
            const products = await shopperProductsClient.getProducts({parameters: {
                ids: productListString
            }})
            setShopperProducts(products)
            return products
        })
    }


    //editing shopper products with the desired format for the ProductScrollerPWA
    const editProductsObjectForScroller = () => {
        let editedProductsForScroller = []
        // console.log("bgbgbg", shopperProducts);

        if(shopperProducts?.data) {
            shopperProducts.data.map((product) => {
                // console.log("zzzzz", product);
                editedProductsForScroller.push(
                    {currency: product.currency,
                    name: product.name,
                    price: product.price,
                    productId: product.id,
                    image: product.imageGroups[0].images[0]}
                    )
            })
        }
        setEditedProducts(editedProductsForScroller)
    }
    
    const [isScrollerOpen, setIsScrollerOpen] = useState(false)

    //showing product scroller after "Get Products button" clicked 
    const showProductScroller = () => {
        if(shopperProducts) {
            setIsScrollerOpen(true)
        }
    }


    //update edited shopper products every time shopper products changes
    useEffect(() => {
        editProductsObjectForScroller()
    }, [shopperProducts])

    //update shopper products every time productListString changes 
    useEffect(() => {
        getShopperProducts(productListString)
        // console.log("productListString =>>>>", productListString)
    }, [productListString])

    // useEffect(() => {
    //     console.log("editedProducts =>>>>", editedProducts)
    // }, [editedProducts])

    // useEffect(() => {
    //     console.log("shopperProducts =>>>>", shopperProducts)
    // }, [shopperProducts])
    
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
                    <Button onClick ={showProductScroller}>Get Products</Button>
                </Box>
            </Box>

            <Box mb={3}>
                Product Scroller

                {editedProducts && isScrollerOpen && (
                    <>
                        <Stack pt={8} spacing={16}>
                            <ProductScrollerPWA
                                products = {editedProducts}
                                // isLoading={isLoading}
                            />
                        </Stack>
                    </>
                )}
            </Box>

        </Container>
        </>
    )
}

// ProductScroller.getProps = async ({res, api, productListProp}) => {
//     if(res) {
//         res.set('Cache-Control', `max-age=${MAX_CACHE_AGE}`)
//     }

//     const addedProducts = await api.shopperProducts.getProducts({
//         parameters: {
//             ids: "25589419M,91736743M,25591410M"
//         }
//     })

//     return { addedProducts, productListProp}
// }

// ProductScroller.propTypes = {
//     isLoading: PropTypes.bool,
//     addedProducts: PropTypes.object,
//     productListProp: PropTypes.array
// }

export default ProductScroller;