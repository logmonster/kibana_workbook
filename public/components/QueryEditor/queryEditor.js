import React from 'react';
import parserService from './../../../server/services/QueryParserService';
import './../../css/plugin.css';

export class QueryEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: ''
    };
    this._init();
  }

  _init() {
    this.contentAreaRef = React.createRef();
  }

  /* -------------------------------- */
  /*        lifecycle hooks           */
  /* -------------------------------- */

  /**
   * component just mounted
   */
  componentDidMount() {}

  componentDidUpdate() {
    // this.props.queryContent => sense editor's content
    if (this.contentAreaRef) {
      const parseQuery = this._actions.parseQueryAction();
      this.contentAreaRef.current.innerHTML = parseQuery;
    }
  }

  /**
   * render method
   */
  render() {
    return (
      <div>
        <div style={this._css.previewTitle}>
          Preview: <span style={this._css.notebookLabel}>{this.props.notebookName}</span>
        </div>
        <div style={this._css.contentContainer}>
          <div
            contentEditable="false"
            ref={this.contentAreaRef}
            style={this._css.contentArea}
          />
        </div>
      </div>
    );
  }

  /* -------------------------------- */
  /*        action methods            */
  /* -------------------------------- */

  _actions = {
    parseQueryAction: () => {
      return parserService.parse(this.props.queryContent);
    }
  }

  /* -------------------------------- */
  /*        css objects               */
  /* -------------------------------- */
  _css = {
    /**
     * content's container css
     */
    contentContainer: {
      margin: 'auto',
      width: 'calc(98%)',
      height: '450px',
      /*
      overflowX: 'scroll',
      overflowY: 'auto'
      */
      overflow: 'auto'
    },
    contentArea: {},
    previewTitle: {
      fontStyle: 'italic',
      fontWeight: 'bold',
      marginBottom: '8px'
    },
    notebookLabel: {
      paddingLeft: '12px',
      color: '#0079a5'
    }
  }
}