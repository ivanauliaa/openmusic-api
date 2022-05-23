const ExportsHandler = require('./handler');
const routes = require('./routes');

const plugin = {
  name: 'exports',
  version: '1.0.0',
  register: async (server, { producerService, playlistsService, validator }) => {
    const exportsHandler = new ExportsHandler(producerService, playlistsService, validator);
    server.route(routes(exportsHandler));
  },
};

module.exports = plugin;
