
import React, {
  Component,
} from 'react';


import Context from '@prisma-cms/context';

import * as UI from "../ui"

class ContextProvider extends Component {

  static contextType = Context;


  render() {

    const {
      children,
    } = this.props;

    let {
      query,
    } = this.context;

    Object.assign(this.context, {
      query: {
        ...query,
        ...this.prepareQuery(),
      },
      ...UI,
    });

    return <Context.Provider
      value={this.context}
    >
      {children || null}
    </Context.Provider>;

  }


  prepareQuery() {

    return {
    }

  }


}

export default ContextProvider;