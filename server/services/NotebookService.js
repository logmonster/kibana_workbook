/**
 * actual service implementation
 * @returns {{}}
 * @private
 */
const _notebookService = function () {
  // **** states **** //
  const INDEX_MAPPING_BODY = {
    settings: {
      index: {
        number_of_shards: 1,
        number_of_replicas: 1
      }
    },
    mappings: {
      _doc: {
        properties: {
          name: {
            type: 'text',
            fields: {
              keyword: {
                type: 'keyword'
              }
            }
          },
          createdAt: {
            type: 'date'
          },
          lastUpdateAt: {
            type: 'date'
          },
          queries: {
            type: 'text',
            fields: {
              keyword: {
                type: 'keyword'
              }
            }
          }
        }
      }
    }
  };

  return {
    /**
     * create the missing .notebook index
     * @param handle
     * @param req
     * @param callbacks
     */
    createIndex: (handle, req, callbacks) => {
      // TODO: NESTED ????
      // es client handles exception (err??? then???)
      // https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/quick-start.html
      handle(req, 'indices.create', {
        index: '.notebook',
        body: INDEX_MAPPING_BODY
      }).then((resp) => {
        if (callbacks && callbacks.success) {
          callbacks.success(resp);
        }
      }, (error) => {
        if (callbacks && callbacks.error) {
          callbacks.error(error);
        }
      });
    },
    /**
     * index the queries into .notebook
     * @param handle
     * @param req
     * @param callbacks
     */
    indexNotebook: (handle, req, callbacks) => {
      // prepare the document body
      const _reqBody = req.payload;
      const _docBody = {
        createdAt: (new Date()),
        lastUpdateAt: (new Date()),
        name: _reqBody.notebookName,
        queries: _reqBody.queryContent
      };

      handle(req, 'index', {
        'index': '.notebook',
        'type': '_doc',
        'body': _docBody
      }).then((resp) => {
        if (callbacks && callbacks.success) {
          callbacks.success(resp);
        }
      }, (error) => {
        if (callbacks && callbacks.error) {
          callbacks.error(error);
        }
      });
    },
    /**
     * remove a target notebook by notebookname and createdAt
     * @param handle
     * @param req
     * @param callbacks
     */
    removeNotebook: (handle, req, callbacks) => {
      const _reqBody = req.payload;
      handle(req, 'delete', {
        index: '.notebook',
        type: '_doc',
        id: _reqBody.docId
      }).then((resp) => {
        if (callbacks && callbacks.success) {
          callbacks.success(resp);
        }
      }, (error) => {
        if (callbacks && callbacks.error) {
          callbacks.error(error);
        }
      });
    },
    /**
     * retrieve all notebook(s)
     * @param handle
     * @param req
     * @param callbacks
     */
    getNotebooks: (handle, req, callbacks) => {
      handle(req, 'search', {
        index: '.notebook',
        type: '_doc',
        body: {
          query: {
            match_all: {}
          }
        }
      }).then((resp) => {
        if (callbacks && callbacks.success) {
          callbacks.success(resp);
        }
      }, (error) => {
        if (callbacks && callbacks.error) {
          callbacks.error(error);
        }
      });
    }
  };
};

export default (new _notebookService());