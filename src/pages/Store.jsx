import React, { useState, useContext, useEffect, useCallback } from "react";
import { UserContext } from "../context/UserContext";
import { Product } from "../components";
import {
  BrandService,
  CategoriesService,
  OrdersService,
  ProductsService,
} from "../utils/functions";

const Store = () => {
  const { currentUser, isLoggedIn } = useContext(UserContext);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const { fetchBrands, getBrandByBrandId } = BrandService;
  const { fetchCategories, getCategoryByCategoryId } = CategoriesService;
  const { fetchProducts } = ProductsService;
  const { postOrder } = OrdersService;

  const getDataFromDatabase = useCallback(async () => {
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
    }
  }, []);

  useEffect(() => {
    getDataFromDatabase();
  }, []);

  const updateBrandsChecked = (id) => {
    const updatedBrands = brands.map((brand) =>
      brand.id === id ? { ...brand, isChecked: !brand.isChecked } : brand
    );

    setBrands(updatedBrands);
  };

  const updateCategoriesChecked = (id) => {
    const updatedCategories = categories.map((category) =>
      category.id === id
        ? { ...category, isChecked: !category.isChecked }
        : category
    );

    setCategories(updatedCategories);
  };

  const addToCart = async(product) => {
    const newOrder = {
      userId: currentUser.id,
      productId: product.id,
      quantity: 1,
      isPaymentCompleted: false
    }

    const response = await postOrder(newOrder);

    if(response.ok){
      const productsUpdated = products.map(prod => prod.id === product.id ? ({ ...prod, isOrdered: true }) : prod);

      setProducts(productsUpdated);
    }
  }

  return (
    <div>
      <div className="row py-3 header">
        <div className="col-lg-3">
          <h4>
            <i className="fa fa-shopping-bag"></i> Store
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
                        type="checkbox"
                        value="true"
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
                        className="form-check-input"
                        type="checkbox"
                        value="true"
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
            {products.map((product) => (
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
