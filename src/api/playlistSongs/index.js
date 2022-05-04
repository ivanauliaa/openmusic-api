const PlaylistSongsHandler = require('./handler');
const routes = require('./routes');

const plugin = {
  name: 'playlistSongs',
  version: '1.0.0',
  register: async (server, {
    playlistService,
    songService,
    playlistSongService,
    playlistSongActivityService,
    validator,
  }) => {
    const playlistSongsHandler = new PlaylistSongsHandler(
      playlistService,
      songService,
      playlistSongService,
      playlistSongActivityService,
      validator,
    );
    server.route(routes(playlistSongsHandler));
  },
};

module.exports = plugin;
