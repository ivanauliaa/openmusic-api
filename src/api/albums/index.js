const AlbumHandler = require('./handler');
const routes = require('./routes');

const plugin = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const albumsHandler = new AlbumHandler(service, validator);
    server.route(routes(albumsHandler));
  },
};

module.exports = plugin;
