import React from 'react';
import './../../css/plugin.css';
import iconTrash from './../../images/icon-trash-white.svg';
import iconLoad from './../../images/icon-load-white.svg';

export class NotebookListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this._init();
  }

  _init() {}

  /* -------------------------------- */
  /*        lifecycle hooks           */
  /* -------------------------------- */

  /**
   * component just mounted
   */
  componentDidMount() {}
  /**
   * render method
   */
  render() {
    return (
      <div style={this._css.container}>
        <span
          onClick={() => { this._itemClickAction.loadAction(); }}
          className="button-icon-2 button-icon-blue button-icon-2-with-right-margin"
        >
          <img src={iconLoad} style={this._css.icon} />
        </span>

        <span
          onClick={() => { this._itemClickAction.removeAction(); }}
          className="button-icon-2 button-icon-red button-icon-2-with-right-margin"
        >
          <img src={iconTrash} style={this._css.icon} />
        </span>

        <span style={this._css.labelLeftPadded}>{this.props.notebookName}</span>
      </div>
    );
  }

  /* -------------------------------- */
  /*        action methods            */
  /* -------------------------------- */

  _itemClickAction = {
    loadAction: () => {
      this.props.listItemPreviewHandler(this.props.docId);
    },
    removeAction: () => {
      this.props.listItemRemoveHandler(this.props.docId);
    }
  };

  /* -------------------------------- */
  /*        css methods               */
  /* -------------------------------- */

  _css = {
    labelLeftPadded: {
      marginLeft: '8px'
    },
    icon: {
      'width': '13px',
      'height': '13px',
      marginRight: '2px',
      cursor: 'pointer'
    },
    container: {
      width: '100%',
      borderBottom: '1px solid #0079a5',
      /* borderTop: '1px solid', */
      marginTop: '2px',
      marginBottom: '4px',
      paddingBottom: '2px'
    },
    rightControl: {
      position: 'relative',
      float: 'right'
      /* paddingRight: '50px' */
    },
    leftControl: {
      paddingLeft: '12px'
    }
  };
}