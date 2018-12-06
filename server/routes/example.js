export default function (server) {

  server.route({
    path: '/api/kbn_notebook/example',
    method: 'GET',
    handler(req, reply) {
      reply({ time: (new Date()).toISOString() });
    }
  });

}
