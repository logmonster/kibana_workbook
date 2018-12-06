import notebookSrv from './../services/NotebookService';

export default function (server, esService) {

  server.route({
    path: '/api/kbn_notebook/notebookSetup',
    method: 'POST',
    handler(req, reply) {
      // query for .notebook index
      // Ref: https://www.elastic.co/blog/kibana-plugin-developers-meet-elasticsearch-clusters

      // let { callWithRequest } = server.plugins.elasticsearch.getCluster('data');
      const callWithRequest = esService.getAPIHandle('6.4', server);
      if (callWithRequest) {
        callWithRequest(req, 'indices.get', {
          'ignoreUnavailable': true,
          'index': [ '.notebook' ]
        }).then((resp) => {
          if (!resp.hasOwnProperty('.notebook')) {
            // create missing index
            notebookSrv.createIndex(callWithRequest, req, {
              success: (resp) => {
                reply({ status: 'success', body: resp });
              },
              error: (error) => {
                reply({ status: 'failure', body: error });
              }
            });
          } else {
            reply({ status: 'success', body: { 'message': '.notebook already created' }});
          }
        });
      }
    }
  });

}