import notebookSrv from './../services/NotebookService';

export default function (server, esService) {

  server.route({
    path: '/api/kbn_notebook/notebookPersist',
    method: 'POST',
    handler(req, reply) {
      // index to .notebook index
      const callWithRequest = esService.getAPIHandle('6.4', server);
      if (callWithRequest) {
        notebookSrv.indexNotebook(callWithRequest, req, {
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