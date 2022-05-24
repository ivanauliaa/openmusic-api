const UploadsHandler = require('./handler');
const routes = require('./routes');

const plugin = {
  name: 'uploads',
  version: '1.0.0',
  register: async (server, { storageService, albumsService, validator }) => {
    const uploadsHandler = new UploadsHandler(storageService, albumsService, validator);
    server.route(routes(uploadsHandler));
  },
};

module.exports = plugin;
