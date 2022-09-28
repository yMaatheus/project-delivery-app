import React from 'react';
import NavBar from '../components/NavBar/NavBar';
import ProductList from '../components/ProductList';

function Customer() {
  return (
    <>
      <NavBar client="customer" />
      <ProductList />
    </>
  );
}

export default Customer;
