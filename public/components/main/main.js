import React from 'react';
import {
  EuiPage,
  EuiPageHeader,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentHeader,
  EuiPageContentBody,
  EuiButton
} from '@elastic/eui';
import iconSave from '../../images/icon-save.svg';
import iconNotebook from '../../images/icon-nb.svg';
import {
  ModalWivTextbox,
  ModalConfirm,
  ModalInfo
} from './../../components/ModalWivTextbox';
import { QueryEditor } from './../../components/QueryEditor';
import { NotebookList } from './../../components/NotebookList';

export class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // should show save-query dialog?
      isSaveQueryDlgHidden: true,
      // query from sense
      queryContent: '',
      // notebook detail
      notebooks: undefined,
      // disable the save button?
      disableSave: true,
      // selected notebook name for display
      selectedNotebookName: '',

      // should the confirm dialog be shown?
      isConfirmDlgHidden: true,
      confirmDlgMessage: '',
      listItemDocId: undefined,

      infoDlgMessage: undefined,
      isInfoDlgHidden: true
    };
  }

  componentDidMount() {
    /*
       FOR EXAMPLE PURPOSES ONLY.  There are much better ways to
       manage state and update your UI than this.
    */
    const { httpClient } = this.props;
    httpClient.get('../api/kbn_notebook/example').then((resp) => {
      this.setState({ time: resp.data.time });
    });
    /*
     *  init the .notebook index
     *  0) check if ".notebook" index available or not
     *  1) if 0 => false, create .notebook index with corresponding settings and mappings
     */
    httpClient.post('../api/kbn_notebook/notebookSetup', {}).then((resp) => {
      if (resp.status === 'failure') {
        alert('something really bad happened => ' + resp.body);
        console.log(resp);
      }
    });
  }

  /* ---------------------------------------------------------------------- */
  /*  testing on access of window object and window.localStorage object     */
  /* ---------------------------------------------------------------------- */
  alertTest() {
    console.log(window);
    console.log(window.localStorage);
  }

  /**
   * combine the given css Objects to form the final one.
   * @param cssObjs
   * @private
   */
  _combineCss(...cssObjs) {
    let _finalObj = {};

    if (cssObjs && cssObjs.length > 0) {
      cssObjs.forEach((cssObj) => {
        _finalObj = Object.assign(_finalObj, cssObj);
      });
    }
    return _finalObj;
  }
  /**
   * create an icon size css object
   * @returns {{width: string, height: string}}
   * @private
   */
  _iconSize() {
    return {
      'width': '12px',
      'height': '12px'
    };
  }
  /**
   * create a margin-right or margin-left css object
   * @param widthInPx -> width for the margin
   * @param isMarginRight -> right or left margin
   * @returns {*}
   * @private
   */
  _getSpacer(widthInPx, isMarginRight) {
    if (isMarginRight === true) {
      return {
        'marginRight': (widthInPx + 'px')
      };
    } else {
      return {
        'marginLeft': (widthInPx + 'px')
      };
    }
  }

  /**
   * return the left pane's width
   * @returns {{width: string, paddingRight: string, display: string, float: string}}
   * @private
   */
  _leftPaneWidth() {
    return {
      'width': '49%',
      'paddingRight': '8px',
      'display': 'inline-block',
      'float': 'left'
    };
  }

  /**
   * return the right pane's width
   * @returns {{width: string, display: string, float: string}}
   * @private
   */
  _rightPaneWidth() {
    return {
      'width': '50%',
      'display': 'inline-block',
      'float': 'right'
    };
  }
  _sectionContainer() {
    return {
      marginTop: '52px'
    };
  }

  /**
   * actions related to the "save" query section
   * @type {{previewAction: Main._saveSection.previewAction, saveAction: Main._saveSection.saveAction, setShowSaveQueryDlgState: Main._saveSection.setShowSaveQueryDlgState}}
   * @private
   */
  _saveSection = {
    previewAction: () => {
      /*
       *  time => last_update_time probably
       *  content => all queries on the dev-console (\n = new line)
       *  TODO: need interpreter or some sort to decode this text
       */
      // console.log(window.localStorage.getItem('sense:editor_state'));
      const queryContent = window.localStorage.getItem('sense:editor_state');
      this.setState({
        'queryContent': queryContent,
        'disableSave': false,
        'selectedNotebookName': ''
      });
    },
    saveAction: () => {
      this.setState({ 'isSaveQueryDlgHidden': false });
    },
    /**
     * method to set the status of 'isSaveQueryDlgHidden'
     * @param toShow
     */
    setShowSaveQueryDlgState: (toShow) => {
      this.setState({ 'isSaveQueryDlgHidden': toShow });
    },
    /**
     * store the previewed queries to the given notebook name
     * @param nbName
     */
    persistQueriesToNotebookByName: (nbName) => {
      const _status = {
        success: true,
        errorMsg: undefined
      };
      if (this.state.queryContent && this.state.queryContent !== '') {
        // call esService to index the document
        // IMPORTANT: make it as a Promise so that the result would be in sync again...
        const { httpClient } = this.props;
        return new Promise((resolve) => {
          httpClient.post('../api/kbn_notebook/notebookPersist', {
            notebookName: nbName,
            queryContent: this.state.queryContent
          }).then((resp) => {
            if (resp.status === 'failure') {
              console.log(resp);
              _status.success = false;
              _status.errorMsg = 'failed to persist the queries into notebook~';
            }
            resolve(_status);
          });
        });
      }
    },
    /**
     * action to retrieve all notebook(s)
     */
    retrieveNotebooks: () => {
      const instance = this;
      const { httpClient } = this.props;
      httpClient.get('../api/kbn_notebook/notebookRetrieval', {}).then((resp) => {
        if (resp.status === 'failure') {
          console.log('something is wrong on notebook retrieval');
        } else {
          //console.log(resp);
          if (resp.data && resp.data.body && resp.data.body.hits && resp.data.body.hits.hits) {
            /*
            const _fHits = [];
            */
            const _hits = resp.data.body.hits.hits;
            /*
            _hits.forEach((_json, _idx) => {
              _fHits[_idx] = _json._source;
            });
            instance.setState({ notebooks: _fHits });
            */
            instance.setState({ notebooks: _hits });
            // console.log(instance.state.notebooks);
          }
        }
      });
    },
    loadNGo: () => {
      // console.log(window.location);
      if (this.state.queryContent && this.state.queryContent.trim().length > 0) {
        // replace the localstorage entry too...
        if (window.localStorage) {
          window.localStorage.setItem('sense:editor_state', this.state.queryContent);

          let windowLocation = window.location.href;
          // replace the last portion to the dev-console app
          // * /app/kibana#/dev_tools/console?_g=() *
          const idx = windowLocation.indexOf('/app/');
          if (idx !== -1) {
            windowLocation = windowLocation.substring(0, idx) + '/app/kibana#/dev_tools/console?_g=()';
            window.location = windowLocation;
          }
        } // end -- if localStorage present
      }
    },

    listItemPreview: (docId) => {
      const _nbook = this._getNotebookEntry(docId);
      if (_nbook) {
        const queryContent = _nbook._source.queries;
        this.setState({
          queryContent: queryContent,
          selectedNotebookName: _nbook._source.name
        });
      } else {
        alert('cannot load the required notebook~ ');
      }
    },
    listItemRemove: (docId) => {
      const _nbook = this._getNotebookEntry(docId);
      if (_nbook) {
        const _nbookName = _nbook._source.name;
        // confirm to delete?
        this.setState({
          listItemDocId: docId,
          listItemNotebookName: _nbookName,
          confirmDlgMessage: 'Are you sure to delete "' + _nbookName + '" ?',
          isConfirmDlgHidden: false
        });
        // call service to delete
      } else {
        alert('cannot load the required notebook~');
      }
    },

    setShowConfirmDlgState: (toShow) => {
      this.setState({ isConfirmDlgHidden: toShow });
    },
    removeSelectedNotebook: (docId) => {
      // set hidden to the confirm dlg
      this._saveSection.setShowConfirmDlgState(true);

      const _nbook = this._getNotebookEntry(docId);
      const instance = this;
      const { httpClient } = this.props;
      if (_nbook) {
        httpClient.post('../api/kbn_notebook/notebookRemove', {
          docId: instance.state.listItemDocId
        }).then((resp) => {
          if (resp.status === 'failure') {
            console.log(resp);
            instance.setState({
              infoDlgMessage: 'something is wrong, check console logs...',
              isInfoDlgHidden: false
            });
          } else {
            // update the preview pane + show success msg
            instance.setState({
              infoDlgMessage: 'notebook removed successfully~',
              isInfoDlgHidden: false,

              selectedNotebookName: '',
              queryContent: ''
            });
            // retrieve the notebooks again (throttle for 1 second to let ES side updated)
            setTimeout(() => {
              instance._saveSection.retrieveNotebooks();
            }, 1000);
          }
        });
      } else {
        alert('something wrong... should not happen, docId was not found etc');
      }
    },

    setShowInfoDlgState: (toShow) => {
      this.setState({ isInfoDlgHidden: toShow });
    }

  };

  _getNotebookEntry = (docId) => {
    if (this.state.notebooks) {
      for (let idx = 0; idx < this.state.notebooks.length; idx++) {
        const _nbook = this.state.notebooks[idx];
        if (_nbook._id === docId) {
          return _nbook;
        }
        /*
        if (_nbook.name === nbName && _nbook.createdAt === createdAt) {
          return _nbook;
        }
        */
      }
      return null;
    }
    return null;
  };

  render() {
    const { title } = this.props;
    return (
      <EuiPage>
        <EuiPageBody>
          <EuiPageHeader>
            <div style={{ 'fontWeight': 'bold' }}>{title}</div>
          </EuiPageHeader>

          <div>
            <EuiPageContent style={this._leftPaneWidth()}>
              <EuiPageContentHeader>
                <div>
                  <img src={iconSave} style={this._combineCss(this._iconSize(), this._getSpacer('10', true))} />
                  <span>Save current Queries to notebook:</span>
                </div>
              </EuiPageContentHeader>

              <EuiPageContentBody>
                <EuiButton onClick={() => { this._saveSection.previewAction(); }}>Preview Queries</EuiButton>&nbsp;
                <EuiButton
                  disabled={this.state.disableSave}
                  onClick={() => { this._saveSection.saveAction(); }}
                >Save to Notebook
                </EuiButton>
              </EuiPageContentBody>
              {/* -----------------------------------------
                  Start of notebook listing section
                  ----------------------------------------- */}
              <EuiPageContentHeader>
                <div style={this._sectionContainer()}>
                  <img src={iconNotebook} style={this._combineCss(this._iconSize(), this._getSpacer('10', true))} />
                  <span>Available Notebook(s):</span>
                </div>
              </EuiPageContentHeader>
              <EuiPageContentBody>
                <EuiButton onClick={() => { this._saveSection.retrieveNotebooks(); }}>Retrieve Notebook(s)</EuiButton>&nbsp;
                <EuiButton onClick={() => { this._saveSection.loadNGo(); }}>Load to Dev Console</EuiButton>
              </EuiPageContentBody>
              <EuiPageContentBody>
                <NotebookList
                  notebooks={this.state.notebooks}
                  listItemPreviewHandler={this._saveSection.listItemPreview}
                  listItemRemoveHandler={this._saveSection.listItemRemove}
                />
              </EuiPageContentBody>

            </EuiPageContent>
            {/* -----------------------------------------
                  Start of query editor section
                  ----------------------------------------- */}
            <EuiPageContent style={this._rightPaneWidth()}>
              <QueryEditor queryContent={this.state.queryContent} notebookName={this.state.selectedNotebookName} />
            </EuiPageContent>

          </div>

          <ModalWivTextbox
            isHidden={this.state.isSaveQueryDlgHidden}
            setShowSaveQueryDlgStateHandler={this._saveSection.setShowSaveQueryDlgState}
            persistQueriesToNotebookByNameHandler={this._saveSection.persistQueriesToNotebookByName}
            title="save queries to notebook"
          />
          <ModalConfirm
            message={this.state.confirmDlgMessage}
            docId={this.state.listItemDocId}
            isHidden={this.state.isConfirmDlgHidden}
            setShowDlgStateHandler={this._saveSection.setShowConfirmDlgState}
            removeSelectedNotebookHandler={this._saveSection.removeSelectedNotebook}
          />
          <ModalInfo
            message={this.state.infoDlgMessage}
            isHidden={this.state.isInfoDlgHidden}
            setShowDlgStateHandler={this._saveSection.setShowInfoDlgState}
          />

        </EuiPageBody>
      </EuiPage>
    );
  }
}
