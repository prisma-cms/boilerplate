import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Link } from "react-router-dom";

class ProductPage extends Component {

  static propTypes = {

  };

  render() {
    return (
      <div>
        ProductPage <br />
      <Link
          to="/products"
        >
          Products page
      </Link>
      </div>
    );
  }
}


export default ProductPage;