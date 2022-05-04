const PlaylistSongActivitiesHandler = require('./handler');
const routes = require('./routes');

const plugin = {
  name: 'playlistSongActivities',
  version: '1.0.0',
  register: async (server, { playlistService, playlistSongActivityService }) => {
    const playlistSongActivitiesHandler = new PlaylistSongActivitiesHandler(
      playlistService,
      playlistSongActivityService,
    );
    server.route(routes(playlistSongActivitiesHandler));
  },
};

module.exports = plugin;
