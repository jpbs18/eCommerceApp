import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { Product } from "../components";
import {
  BrandsService,
  CategoriesService,
  OrdersService,
  ProductsService,
} from "../utils/functions";

const Store = () => {
  const { currentUser } = useContext(UserContext);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [productsToShow, setProductsToShow] = useState([]);

  const { fetchBrands, getBrandByBrandId } = BrandsService;
  const { fetchCategories, getCategoryByCategoryId } = CategoriesService;
  const { fetchProducts } = ProductsService;
  const { postOrder } = OrdersService;

  const getDataFromDatabase = async () => {
    const brandsResponse = await fetchBrands();
    const categoriesResponse = await fetchCategories();
    const productsResponse = await fetchProducts();

    const brandsBody = await brandsResponse.json();
    const categoriesBody = await categoriesResponse.json();
    const productsBody = await productsResponse.json();

    const brandsChecked = brandsBody.map((brand) => ({
      ...brand,
      isChecked: true,
    }));

    const categoriesChecked = categoriesBody.map((category) => ({
      ...category,
      isChecked: true,
    }));

    setBrands(brandsChecked);
    setCategories(categoriesChecked);

    if (productsResponse.ok) {
      const productsOrdered = productsBody.map((product) => {
        const brandObject = getBrandByBrandId(brandsBody, product.brandId);
        const categoryObject = getCategoryByCategoryId(
          categoriesBody,
          product.categoryId
        );

        return {
          ...product,
          isOrdered: false,
          brand: brandObject,
          category: categoryObject,
        };
      });

      setProducts(productsOrdered);
      setProductsToShow(productsOrdered);
    }
  };

  const updateProductsToShow = () => {
    const filteredProducts = products
      .filter(
        (prod) =>
          categories.filter(
            (category) => category.id === prod.categoryId && category.isChecked
          ).length > 0
      )
      .filter(
        (prod) =>
          brands.filter((brand) => brand.id === prod.brandId && brand.isChecked)
            .length > 0
      );

    setProductsToShow(filteredProducts);
  };

  const updateBrandsChecked = (id) => {
    const updatedBrands = brands.map((brand) =>
      brand.id === id ? { ...brand, isChecked: !brand.isChecked } : brand
    );

    setBrands(updatedBrands);
    updateProductsToShow();
  };

  const updateCategoriesChecked = (id) => {
    const updatedCategories = categories.map((category) =>
      category.id === id
        ? { ...category, isChecked: !category.isChecked }
        : category
    );

    setCategories(updatedCategories);
    updateProductsToShow();
  };

  const addToCart = async (product) => {
    const newOrder = {
      userId: currentUser.id,
      productId: product.id,
      quantity: 1,
      isPaymentCompleted: false,
    };

    const response = await postOrder(newOrder);

    if (response.ok) {
      const productsUpdated = products.map((prod) =>
        prod.id === product.id ? { ...prod, isOrdered: true } : prod
      );

      setProducts(productsUpdated);
      updateProductsToShow();
    }
  };

  useEffect(() => {
    updateProductsToShow();
  }, [categories, brands]);

  useEffect(() => {
    getDataFromDatabase();
    updateProductsToShow();
  }, []);

  return (
    <div>
      <div className="row py-3 header">
        <div className="col-lg-3">
          <h4>
            <i className="fa fa-shopping-bag"></i> Store
            <span className="badge bg-secondary m-2">
              {" "}
              {productsToShow.length}
            </span>
          </h4>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-3 py-2">
          <div className="my-2">
            <h5>Brands</h5>
            <ul className="list-group list-group-flush">
              {brands.map((brand) => {
                return (
                  <li key={brand.id} className="list-group-item">
                    <div className="form-check">
                      <input
                        id={`brand${brand.id}`}
                        className="form-check-input"
                        value="true"
                        type="checkbox"
                        checked={brand.isChecked}
                        onChange={() => updateBrandsChecked(brand.id)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`brand${brand.id}`}
                      >
                        {brand.name}
                      </label>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="my-2">
            <h5>Categories</h5>
            <ul className="list-group list-group-flush">
              {categories.map((category) => {
                return (
                  <li key={category.id} className="list-group-item">
                    <div className="form-check">
                      <input
                        id={`brand${category.id}`}
                        value="true"
                        className="form-check-input"
                        type="checkbox"
                        checked={category.isChecked}
                        onChange={() => updateCategoriesChecked(category.id)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`brand${category.id}`}
                      >
                        {category.name}
                      </label>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div className="col-lg-9 py-2">
          <div className="row">
            {productsToShow.map((product) => (
              <Product
                key={product.id}
                product={product}
                handleAddToCart={addToCart}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Store;
