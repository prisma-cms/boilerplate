import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';


import EditorComponent from "@prisma-cms/front-editor/lib/components/App/components/";


import { Document, Page } from 'react-pdf';
import { Button } from 'material-ui';
import { Typography } from 'material-ui';


class PdfView extends EditorComponent {

  static defaultProps = {
    ...EditorComponent.defaultProps,
    pages: 1,
    page_width: 800,
    scale: 1,
    show_pages: true,
    style: {
      ...EditorComponent.defaultProps.style,
      overflow: "auto",
      maxWidth: 810,
      marginLeft: "auto",
      marginRight: "auto",
    }
  }

  static Name = "PdfView"


  constructor(props) {

    super(props);

    this.state = {
      ...this.state,
      numPages: null,
      pageNumber: 1,
      showAll: false,
    }

  }

  onDocumentLoadSuccess(state) {

    const {
      numPages,
    } = state;

    this.setState({
      numPages,
    });
  }

  renderPanelView() {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(<div
      className={classes.panelButton}
    >
      PdfView
    </div>);
  }


  renderChildren() {

    // return <MyApp />

    const {
      pageNumber,
      numPages,
      showAll,
    } = this.state;

    const {
      pages,
      src: file,
      page_width,
      scale,
      show_pages,
      ...other
    } = this.getComponentProps(this);


    const {
      inEditMode,
    } = this.getEditorContext();


    if (!file) {

      if (inEditMode) {
        return <Typography
          color="error"
        >
          src property required
        </Typography>
      }
      else {
        return null;
      }

    }


    let pagesList = [];

    if (pageNumber > 0) {

      for (var i = pageNumber; i <= numPages; i++) {

        pagesList.push(<Page
          key={i}
          pageNumber={i}
          {...this.getPageProps()}
        />);

        if (!showAll && pages > 0 && pagesList.length >= pages) {
          break;
        }

      }

    }

    return <Fragment>

      <Document
        file={file}
        onLoadSuccess={state => this.onDocumentLoadSuccess(state)}
        {...this.getDocumentProps()}
      >
        {pagesList}
      </Document>

      {show_pages && !showAll ?
        <div
          style={{
            textAlign: "center",
          }}
        >
          Page {pageNumber} of {numPages}. <Button
            size="small"
            onClick={event => {
              this.setState({
                showAll: true,
              });
            }}
          >
            Show all
          </Button>
        </div>
        : null
      }

    </Fragment>

  }


  getDocumentProps() {
    return {};
  }


  getPageProps() {

    const {
      page_width: width,
      scale,
    } = this.getComponentProps(this);

    return {
      width,
      scale,
    }

  }

}

export default PdfView;
