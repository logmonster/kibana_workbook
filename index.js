import exampleRoute from './server/routes/example';
import notebookSetupRoute from './server/routes/notebookSetup';
import notebookPersistRoute from './server/routes/notebookPersist';
import notebookRetrieval from './server/routes/notebookRetrieval';
import notebookRemove from './server/routes/notebookRemove';

// import a common service for ES -> get the handle for "callWithRequest"
import esService from './server/services/ESServices';

export default function (kibana) {
  return new kibana.Plugin({
    require: ['elasticsearch', 'kibana'],
    name: 'kbn_notebook',
    uiExports: {
      app: {
        title: 'Kibana Notebook',
        description: 'kibana notebook - saving queries',
        main: 'plugins/kbn_notebook/app',
        icon: 'plugins/kbn_notebook/images/notebook.svg',
        styleSheetPath: require('path').resolve(__dirname, 'public/app.scss'),
      },
      hacks: [
        'plugins/kbn_notebook/hack'
      ]
    },

    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    },

    init(server, options) { // eslint-disable-line no-unused-vars
      // Add server routes and initialize the plugin here
      exampleRoute(server);
      // notebook related route(s)
      notebookSetupRoute(server, esService);
      notebookPersistRoute(server, esService);
      notebookRetrieval(server, esService);
      notebookRemove(server, esService);
    }
  });
}
