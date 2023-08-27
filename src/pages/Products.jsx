import React, { useState, useEffect } from "react";
import {
  ProductsService,
  BrandsService,
  CategoriesService,
  SortService
} from "../utils/functions";

const Products = () => {
  const [search, setSearch] = useState("");
  const [originalProducts, setOriginalProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("ASC");

  const { fetchProductsBySearchAndSort } = ProductsService;
  const { getBrandByBrandId, fetchBrands } = BrandsService;
  const { getCategoryByCategoryId, fetchCategories } = CategoriesService;
  const { getSortedArray } = SortService;

  useEffect(() => {
    (async () => {
      const productsResponse = await fetchProductsBySearchAndSort(search, sortBy, sortOrder);
      const categoriesResponse = await fetchCategories();
      const brandsResponse = await fetchBrands();

      if (productsResponse.ok) {
        const productsBody = await productsResponse.json();
        const categoriesBody = await categoriesResponse.json();
        const brandsBody = await brandsResponse.json();

        const productsToSave = productsBody.map((product) => {
          return {
            ...product,
            brand: getBrandByBrandId(brandsBody, product.brandId),
            category: getCategoryByCategoryId(
              categoriesBody,
              product.categoryId
            ),
          };
        });

        setProducts(productsToSave);
        setOriginalProducts(productsToSave);
      }
    })();
  }, [search, sortBy, sortOrder]);

  const handleSorting = (e, column) => {
    e.preventDefault();

    console.log(column)

    setSortBy(column);
    setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
    setProducts(getSortedArray(originalProducts, sortBy, sortOrder));
    console.log(products)
  }

  const getColumnHeader = (columnName, displayName) => {
    return (
      <>
        <a href="/#" onClick={(e) => handleSorting(e, columnName)}>{displayName}</a>{" "}
        {sortBy === columnName && sortOrder === "ASC" && (
          <i className="fa fa-sort-up"></i>
        )}
        {sortBy === columnName && sortOrder === "DESC" && (
          <i className="fa fa-sort-down"></i>
        )}
      </>
    );
  };

  return (
    <div className="row">
      <div className="col-12">
        <div className="row p-3 header">
          <div className="col-lg-3">
            <h4>
              <i className="fa fa-suitcase"></i> Products
              <span className="badge bg-secondary m-2"> {products.length}</span>
            </h4>
          </div>
          <div className="col-lg-9">
            <input
              type="search"
              placeholder="Search"
              className="form-contdol"
              autofocus="autofocus"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="col-10 mx-auto mb-2">
        <div className="card- my2 shadow">
          <div className="card-body">
            <table className="table">
              <thead>
                <tr>
                  <th>{getColumnHeader("name", "Name")}</th>
                  <th>{getColumnHeader("brand", "Brand")}</th>
                  <th>{getColumnHeader("category", "Category")}</th>
                  <th>{getColumnHeader("price", "Price")}</th>
                  <th>{getColumnHeader("rating", "Rating")}</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  return (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{product.brand.name}</td>
                      <td>{product.category.name}</td>
                      <td>${product.price}</td>
                      <td>
                        <div>
                          {[...Array(product.rating).keys()].map((n) => (
                            <i key={n} className="fa fa-star text-warning"></i>
                          ))}
                          {[...Array(5 - product.rating).keys()].map((n) => (
                            <i
                              key={n}
                              className="fa fa-star-o text-warning"
                            ></i>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
