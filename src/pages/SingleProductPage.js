import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProductsContext } from "../context/products_context";
import { single_product_url } from "../utils/constants";
import { formatPrice } from "../utils/helpers";
import { Loading, Error, ProductImages, Stars, PageHero } from "../components";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useCartContext } from "../context/cart_context";

const SingleProductPage = () => {
  const [images, setImages] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    fetchSingleProduct,
    single_product: product,
    single_product_loading: loading,
    single_product_error: error,
  } = useProductsContext();

  const { addToCart } = useCartContext();

  useEffect(() => {
    fetchSingleProduct(single_product_url + id);
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
    // eslint-disable-next-line
  }, [error]);

  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <Error />;
  }

  const {
    title: name,
    price,
    description,
    stock,
    rating: stars,
    id: sku,
    brand: company,
    // images,
  } = product;

  setTimeout(() => {
    setImages(product.images);
  }, [1000]);

  return (
    <Wrapper>
      <PageHero title={name} product />
      <div className="section section-center page">
        <Link to={"/products"} className="btn">
          back to products
        </Link>
        <div className="product-center">
          {images && <ProductImages name={name} images={images} />}
          <section className="content">
            <h2>{name}</h2>
            <Stars stars={stars} />
            <h5 className="price">{formatPrice(price)}</h5>
            <p className="desc">{description}</p>
            <p className="info">
              <span>Available :</span>
              {stock > 0 ? "In stock" : "out of stock"}
            </p>
            <p className="info">
              <span>SKU :</span>
              {sku}
            </p>
            <p className="info">
              <span>Brand :</span>
              {company}
            </p>
            <hr />
            {stock > 0 && (
              <div className="container">
                <div className="btn-container">
                  <button
                    onClick={() => {
                      if (quantity > 1) {
                        setQuantity(quantity - 1);
                      }
                    }}
                  >
                    -
                  </button>
                  <p>{quantity}</p>
                  <button
                    onClick={() => {
                      if (quantity !== stock) {
                        setQuantity(quantity + 1);
                      }
                    }}
                  >
                    +
                  </button>
                </div>
                <button
                  className="add-to-cart"
                  onClick={() => {
                    addToCart({ ...product, quantity });
                    navigate("/cart");
                  }}
                >
                  add to cart
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  .product-center {
    display: grid;
    gap: 4rem;
    margin-top: 2rem;
  }
  .price {
    color: var(--clr-primary-5);
  }
  .desc {
    line-height: 2;
    max-width: 45em;
  }
  .info {
    text-transform: capitalize;
    width: 300px;
    display: grid;
    grid-template-columns: 125px 1fr;
    span {
      font-weight: 700;
    }
  }
  .container {
    display: flex;
    justify-content: space-between;
    margin-top: 1.5rem;

    .btn-container {
      display: flex;
      justify-content: flex-start;
      gap: 2rem;
      align-items: center;

      button {
        border: none;
        background: none;
        background-color: #0ca0cc;
        padding: 1rem;
        width: 4rem;
        border-radius: 5px;
        color: #ffffff;
        font-size: 2rem;
      }

      p {
        font-size: 2rem;
        position: relative;
        top: 0.5rem;
      }
    }
  }
  .add-to-cart {
    font-size: large;
    color: #ffffff;
    text-transform: uppercase;
    display: inline-block;
    padding: 1rem;
    border-radius: 3px;
    background: #0ca0cc;
    margin-right: 0.5rem;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (min-width: 992px) {
    .product-center {
      grid-template-columns: 1fr 1fr;
      align-items: center;
    }
    .price {
      font-size: 1.25rem;
    }
  }
`;

export default SingleProductPage;
