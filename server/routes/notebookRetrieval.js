import notebookSrv from './../services/NotebookService';

export default function (server, esService) {

  server.route({
    path: '/api/kbn_notebook/notebookRetrieval',
    method: 'GET',
    handler(req, reply) {
      // get all notebooks from .notebook
      const callWithRequest = esService.getAPIHandle('6.4', server);
      if (callWithRequest) {
        notebookSrv.getNotebooks(callWithRequest, req, {
          success: (resp) => {
            reply({ status: 'success', body: resp });
          },
          error: (error) => {
            reply({ status: 'failure', body: error });
          }
        });
      }
    }
  });

}