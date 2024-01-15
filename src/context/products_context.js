import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import reducer from "../reducers/products_reducer";
import {
  categories_url,
  get_category_url,
  search_url,
  products_url as url,
} from "../utils/constants";
import {
  SIDEBAR_OPEN,
  SIDEBAR_CLOSE,
  GET_PRODUCTS_BEGIN,
  GET_PRODUCTS_SUCCESS,
  GET_PRODUCTS_ERROR,
  GET_SINGLE_PRODUCT_BEGIN,
  GET_SINGLE_PRODUCT_SUCCESS,
  GET_SINGLE_PRODUCT_ERROR,
  SET_GRIDVIEW,
  SET_LISTVIEW,
  UPDATE_SEARCH,
  GET_BY_CATEGORY,
  GET_CATEGORIES,
  SET_CATEGORY,
  SET_SEARCH,
  SORT_PRODUCTS,
} from "../actions";

const initialState = {
  isSidebarOpen: false,
  products_loading: false,
  products_error: false,
  products: [],
  featured_products: [],
  single_product_loading: false,
  single_product_error: false,
  single_product: [],
};

const ProductsContext = React.createContext();

export const ProductsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const openSidebar = () => {
    dispatch({ type: SIDEBAR_OPEN });
  };
  const closeSidebar = () => {
    dispatch({ type: SIDEBAR_CLOSE });
  };
  const fetchProducts = async (url) => {
    dispatch({ type: GET_PRODUCTS_BEGIN });
    try {
      const response = await axios(url);
      const products = response.data;
      dispatch({
        type: GET_PRODUCTS_SUCCESS,
        payload: products,
      });
    } catch (err) {
      dispatch({ type: GET_PRODUCTS_ERROR });
    }
  };
  const fetchCategories = async () => {
    dispatch({ type: GET_PRODUCTS_BEGIN });
    try {
      const response = await axios(categories_url);
      const categories = response.data;
      dispatch({
        type: GET_CATEGORIES,
        payload: categories,
      });
    } catch (err) {
      dispatch({ type: GET_PRODUCTS_ERROR });
    }
  };
  const fetchSingleProduct = async (url) => {
    dispatch({ type: GET_SINGLE_PRODUCT_BEGIN });
    try {
      const response = await axios(url);
      const singleProduct = response.data;
      dispatch({ type: GET_SINGLE_PRODUCT_SUCCESS, payload: singleProduct });
    } catch (err) {
      dispatch({ type: GET_SINGLE_PRODUCT_ERROR });
    }
  };
  const setGridView = () => {
    dispatch({ type: SET_GRIDVIEW });
  };
  const setListView = () => {
    dispatch({ type: SET_LISTVIEW });
  };
  const setCategory = (category) => {
    dispatch({ type: SET_CATEGORY, payload: category });
  };
  const setSearch = (s) => {
    dispatch({ type: SET_SEARCH, payload: s });
  };
  const updateSearch = async (searchString) => {
    try {
      const response = await axios(search_url + searchString);
      const products = response.data;
      dispatch({ type: UPDATE_SEARCH, payload: products });
    } catch (err) {
      dispatch({ type: GET_PRODUCTS_ERROR });
    }
  };
  const getByCategory = async (category) => {
    dispatch({ type: GET_PRODUCTS_BEGIN });
    try {
      const response = await axios(get_category_url + category);
      const products = response.data;
      dispatch({ type: GET_BY_CATEGORY, payload: products });
    } catch (err) {
      dispatch({ type: GET_PRODUCTS_ERROR });
    }
  };
  const sort = (by) => {
    dispatch({ type: SORT_PRODUCTS, payload: by });
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts(url);
  }, []);

  return (
    <ProductsContext.Provider
      value={{
        ...state,
        openSidebar,
        closeSidebar,
        fetchProducts,
        fetchSingleProduct,
        setListView,
        setGridView,
        updateSearch,
        getByCategory,
        setCategory,
        setSearch,
        sort,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};
// make sure use
export const useProductsContext = () => {
  return useContext(ProductsContext);
};
