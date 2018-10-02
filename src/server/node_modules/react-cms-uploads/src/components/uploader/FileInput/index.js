
import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class FileInput extends Component{

  render(){

    return <input
      type="file"
      {...this.props}
    />

  }

}
