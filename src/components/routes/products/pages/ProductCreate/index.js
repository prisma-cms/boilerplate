import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Link } from "react-router-dom";

class ProductCreatePage extends Component {

  static propTypes = {
    View: PropTypes.func.isRequired,
  };

  render() {

    const {
      View,
    } = this.props;

    return (
      <div>
        ProductCreatePage <br />
        <Link
          to="/products/wefwefewf"
        >
          Product page
      </Link>

        <View 
          data={{
            object: {},
          }}
          _dirty={{
            name: "",
          }}
        />
      </div>
    );
  }
}


export default ProductCreatePage;