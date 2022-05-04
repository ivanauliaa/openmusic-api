const AuthenticationsHandler = require('./handler');
const routes = require('./routes');

const plugin = {
  name: 'authentications',
  version: '1.0.0',
  register: async (server, {
    authenticationService,
    userService,
    tokenManager,
    validator,
  }) => {
    const authenticationsHandler = new AuthenticationsHandler(
      authenticationService,
      userService,
      tokenManager,
      validator,
    );

    server.route(routes(authenticationsHandler));
  },
};

module.exports = plugin;
