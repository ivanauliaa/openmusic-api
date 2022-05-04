const PlaylistsHandler = require('./handler');
const routes = require('./routes');

const plugin = {
  name: 'playlists',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const playlistHandler = new PlaylistsHandler(service, validator);
    server.route(routes(playlistHandler));
  },
};

module.exports = plugin;
