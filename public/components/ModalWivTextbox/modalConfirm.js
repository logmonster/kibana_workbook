import React from 'react';
import {
  EuiButton,
} from '@elastic/eui';
import './../../css/plugin.css';

export class ModalConfirm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: ''
    };
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
      <div>
        {/* backdrop */}
        <div className={this._cssNStyleObjects._modalBackdrop(this)} />

        {/* actual dialog */}
        <div
          className={this._cssNStyleObjects._modalPane(this)}
          style={this._cssNStyleObjects._modalPaneConfirmDlg()}
        >
          <div className="modal-header">
            <div className="modal-title">{this.props.message}</div>
          </div>
          <div className="general-align-right">
            <EuiButton onClick={() => this._actions.okAction(this)} >Ok</EuiButton>
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
    okAction: (instance) => {
      // validate
      const _docId = this.props.docId;
      if (_docId && _docId.trim().length > 0) {
        this.props.removeSelectedNotebookHandler(_docId);
      } else {
        instance.setState({ 'error': 'something is wrong... should not happen' });
      }
    },
    cancelAction: (instance) => {
      // reset values
      this._resetStates(instance);
      instance.props.setShowDlgStateHandler(true);
    }
  };

  /**
   * method to reset state values
   * @param instance
   * @private
   */
  _resetStates = (instance) => {
    instance.setState({
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
      return _css;
    },
    _modalPaneConfirmDlg: () => {
      return {
        minHeight: '0px'
      };
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