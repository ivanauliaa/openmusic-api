const CollaborationsHandler = require('./handler');
const routes = require('./routes');

const plugin = {
  name: 'collaborations',
  version: '1.0.0',
  register: async (server, {
    collaborationService, playlistService, userService, validator,
  }) => {
    const collaborationsHandler = new CollaborationsHandler(
      collaborationService,
      playlistService,
      userService,
      validator,
    );

    server.route(routes(collaborationsHandler));
  },
};

module.exports = plugin;
