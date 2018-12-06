import React from 'react';
import { NotebookListItem } from './notebookListItem';
import './../../css/plugin.css';

export class NotebookList extends React.Component {
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
    const _listFromProps = this.props.notebooks;
    let _list = '';

    if (_listFromProps) {
      _list = this.props.notebooks.map((_nbook) => {
        return (
          <NotebookListItem
            key={_nbook._id}
            docId={_nbook._id}
            notebookName={_nbook._source.name}
            listItemPreviewHandler={this.props.listItemPreviewHandler}
            listItemRemoveHandler={this.props.listItemRemoveHandler}
          />
        );
      });
    }
    return (
      <div style={this._css.container}>
        { _list }
      </div>
    );
  }

  /* -------------------------------- */
  /*        css methods               */
  /* -------------------------------- */

  _css = {
    container: {
      margin: 'auto',
      width: 'calc(98%)',
      paddingTop: '24px'
    },
    leftControl: {
      position: 'relative',
      float: 'left',
      maxWidth: '400px'
    },
    rightControl: {
      position: 'relative',
      float: 'right'
    }
  };
}