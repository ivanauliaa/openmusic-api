require('dotenv').config();

const Hapi = require('@hapi/hapi');
const albums = require('./api/albums');
const songs = require('./api/songs');
const AlbumService = require('./services/postgres/AlbumService');
const SongService = require('./services/postgres/SongService');
const AlbumValidator = require('./validator/album');
const SongValidator = require('./validator/song');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  const albumService = new AlbumService();
  const songService = new SongService();

  await server.register({
    plugin: albums,
    options: {
      service: albumService,
      validator: AlbumValidator,
    },
  });

  await server.register({
    plugin: songs,
    options: {
      service: songService,
      validator: SongValidator,
    },
  });

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();
