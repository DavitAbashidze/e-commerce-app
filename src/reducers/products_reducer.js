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

function sortByLowestPrice(a, b) {
  return a.price - b.price;
}
function sortByHighestPrice(a, b) {
  return b.price - a.price;
}
function sortByTitleAsc(a, b) {
  const titleA = a.title.toUpperCase();
  const titleB = b.title.toUpperCase();
  return titleA.localeCompare(titleB);
}
function sortByTitleDesc(a, b) {
  const titleA = a.title.toUpperCase();
  const titleB = b.title.toUpperCase();
  return titleB.localeCompare(titleA);
}

const products_reducer = (state, action) => {
  switch (action.type) {
    case SIDEBAR_OPEN:
      return { ...state, isSidebarOpen: true };
    case SIDEBAR_CLOSE:
      return { ...state, isSidebarOpen: false };
    case GET_PRODUCTS_BEGIN:
      return { ...state, products_loading: true };
    case GET_PRODUCTS_SUCCESS:
      const featured_products = action.payload.products.sort(sortByLowestPrice);
      return {
        ...state,
        products_loading: false,
        grid_view: true,
        products: featured_products,
        featured_products,
        category: "all",
        search: "",
        sort: "price (lowest)",
      };
    case GET_CATEGORIES:
      const categories = action.payload;
      return {
        ...state,
        products_loading: false,
        grid_view: true,
        categories,
      };
    case UPDATE_SEARCH:
      const products = action.payload.products.sort(sortByLowestPrice);
      return {
        ...state,
        products_loading: false,
        grid_view: true,
        products,
      };
    case GET_BY_CATEGORY:
      const productsByCategory =
        action.payload.products.sort(sortByLowestPrice);
      return {
        ...state,
        products_loading: false,
        grid_view: true,
        products: productsByCategory,
      };
    case SET_GRIDVIEW: {
      return { ...state, grid_view: true };
    }
    case SET_LISTVIEW: {
      return { ...state, grid_view: false };
    }
    case SET_CATEGORY: {
      const category = action.payload;
      return { ...state, category };
    }
    case SET_SEARCH: {
      const search = action.payload;
      return { ...state, search };
    }
    case SORT_PRODUCTS: {
      const by = action.payload;
      let newProducts = [];
      if (by === "price-lowest") {
        newProducts = state.products.sort(sortByLowestPrice);
      } else if (by === "price-highest") {
        newProducts = state.products.sort(sortByHighestPrice);
      } else if (by === "name-a") {
        newProducts = state.products.sort(sortByTitleAsc);
      } else if (by === "name-z") {
        newProducts = state.products.sort(sortByTitleDesc);
      }

      return { ...state, sort: by, products: newProducts };
    }
    case GET_PRODUCTS_ERROR:
      return { ...state, products_error: true, products_loading: false };
    case GET_SINGLE_PRODUCT_BEGIN:
      return {
        ...state,
        single_product_loading: true,
        single_product_error: false,
      };
    case GET_SINGLE_PRODUCT_SUCCESS:
      const single_product = action.payload;
      return {
        ...state,
        single_product,
        single_product_loading: false,
        single_product_error: false,
      };
    case GET_SINGLE_PRODUCT_ERROR:
      return {
        ...state,
        single_product_error: true,
        single_product_loading: false,
      };
    default:
      throw new Error(`No Matching "${action.type}" - action type`);
  }
};

export default products_reducer;
