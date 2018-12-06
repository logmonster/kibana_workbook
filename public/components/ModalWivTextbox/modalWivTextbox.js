import React from 'react';
import {
  EuiButton,
} from '@elastic/eui';
import './../../css/plugin.css';

export class ModalWivTextbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notebookName: '',
      listQueries: [],
      error: ''
    };
    // TODO: JSON.parse(xxx) => true or false
    // add event handler here (any "change" would trigger this eventHandler)
    this.handleChange = this.handleChange.bind(this);

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
   * event about textbox content change
   * @param event
   */
  handleChange(event) {
    // reset error
    if (this.state.error && this.state.error.trim().length > 0) {
      this.setState({ 'error': '' });
    }
    // TODO: check the event and which "target" it is...
    this.setState({ 'notebookName': event.target.value });
  }

  /**
   * render method
   */
  render() {
    /* get passed in params */
    const {
      title
    } = this.props;

    return (
      <div>
        {/* backdrop */}
        <div className={this._cssNStyleObjects._modalBackdrop(this)} />

        {/* actual dialog */}
        <div className={this._cssNStyleObjects._modalPane(this)} >
          <div className="modal-header">
            <div className="modal-title">{title}</div>
          </div>
          <div className="modal-body">
            <input
              className="modal-text"
              placeholder="enter notebook name here..."
              value={this.state.notebookName}
              onChange={this.handleChange}
            />
          </div>
          <div className="general-align-right">
            <EuiButton onClick={() => this._actions.saveAction(this)} >Save</EuiButton>
            &nbsp;
            <EuiButton onClick={() => this._actions.cancelAction(this)} >Cancel</EuiButton>
          </div>
          <div className="modal-error">
            {this.state.error}
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------- */
  /*        action methods            */
  /* -------------------------------- */
  _actions = {
    saveAction: (instance) => {
      // validate
      const _nbName = this.state.notebookName;
      if (_nbName && _nbName.trim().length > 0) {
        // TODO: save the queries to the notebook name
        /*
         *  1. check if the "listQueries" is fetched yet or not (at least try once)
         *  2. MIGHT need to warn if queries from dev-console was empty too... (but should have at least "GET _search"
         *  3. check if index created yet => need to create index with custom mappings and settings
         *  4. ingest the data into the index with the "notebookname" given
         */
        instance.props.persistQueriesToNotebookByNameHandler(_nbName).then((resp) => {
          if (resp.success === true) {
            instance._actions.cancelAction(instance);
          } else {
            instance.setState({
              error: resp.errorMsg
            });
          }
        });
      } else {
        instance.setState({ 'error': 'notebook name MUST be non-empty string' });
      }
    },
    cancelAction: (instance) => {
      // reset values
      this._resetStates(instance);
      instance.props.setShowSaveQueryDlgStateHandler(true);
    }
  };

  /**
   * method to reset state values
   * @param instance
   * @private
   */
  _resetStates = (instance) => {
    instance.setState({
      notebookName: '',
      listQueries: [],
      error: ''
    });
  };

  /* -------------------------------- */
  /*        css objects               */
  /* -------------------------------- */

  _cssNStyleObjects = {
    /**
     * should the modal be displayed?
     * @param isHidden
     * @returns {*}
     */
    isHidden: (isHidden) => {
      if (isHidden === true) {
        return {
          'display': 'block'
        };
      } else {
        return {
          'display': 'hidden'
        };
      }
    },
    /**
     * combining css objects into 1
     * @param cssObjs -> css object(s)
     * @returns {*}
     */
    combineCssObjs: (...cssObjs) => {
      let _finalObj = {};
      if (cssObjs && cssObjs.length > 0) {
        cssObjs.forEach((value) => {
          _finalObj = Object.assign(_finalObj, value);
        });
      }
      return _finalObj;
    },
    /**
     * modal pane related css
     * @param instance
     * @returns {string}
     * @private
     */
    _modalPane: (instance) => {
      const isHidden = instance.props.isHidden;
      let _css = 'modal-pane';

      if (isHidden && isHidden === true) {
        _css += ' general-hide';
      } else {
        _css += ' general-show';
      }
      // console.log(_css);
      // console.log(isHidden, instance.state);
      // console.log(instance.props);
      return _css;
    },
    /**
     * modal backdrop related css
     * @param instance
     * @returns {string}
     * @private
     */
    _modalBackdrop: (instance) => {
      const isHidden = instance.props.isHidden;
      let _css = 'modal-backdrop';

      if (isHidden && isHidden === true) {
        _css += ' general-hide';
      } else {
        _css += ' general-show';
      }
      return _css;
    }
  };
}