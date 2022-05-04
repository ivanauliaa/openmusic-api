const ClientError = require('../../exceptions/ClientError');

class PlaylistSongsHandler {
  constructor(
    playlistService,
    songService,
    playlistSongService,
    playlistSongActivityService,
    validator,
  ) {
    this._playlistService = playlistService;
    this._songService = songService;
    this._playlistSongService = playlistSongService;
    this._playlistSongActivityService = playlistSongActivityService;
    this._validator = validator;

    this.postPlaylistSongHandler = this.postPlaylistSongHandler.bind(this);
    this.getPlaylistSongsHandler = this.getPlaylistSongsHandler.bind(this);
    this.deletePlaylistSongHandler = this.deletePlaylistSongHandler.bind(this);
  }

  async postPlaylistSongHandler(request, h) {
    try {
      this._validator.validatePlaylistSongPayload(request.payload);

      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;
      const { songId } = request.payload;

      // check whether song exists
      await this._songService.getSong(songId);

      await this._playlistService.verifyPlaylistAccess(id, credentialId);
      await this._playlistSongService
        .addPlaylistSong(id, { songId });

      const action = 'add';
      const time = new Date().toISOString();
      await this._playlistSongActivityService.addPlaylistSongActivity(id, {
        songId,
        userId: credentialId,
        action,
        time,
      });

      const response = h.response({
        status: 'success',
        message: 'Playlist song berhasil ditambahkan',
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.log(error);
      return response;
    }
  }

  async getPlaylistSongsHandler(request, h) {
    try {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._playlistService.verifyPlaylistAccess(id, credentialId);
      const playlist = await this._playlistSongService.getPlaylistSongs(id);

      const response = h.response({
        status: 'success',
        data: {
          playlist,
        },
      });
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.log(error);
      return response;
    }
  }

  async deletePlaylistSongHandler(request, h) {
    try {
      this._validator.validatePlaylistSongPayload(request.payload);

      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;
      const { songId } = request.payload;

      await this._playlistService.verifyPlaylistAccess(id, credentialId);
      await this._playlistSongService.deletePlaylistSong(id, { songId });

      const action = 'delete';
      const time = new Date().toISOString();
      await this._playlistSongActivityService.addPlaylistSongActivity(id, {
        songId,
        userId: credentialId,
        action,
        time,
      });

      const response = h.response({
        status: 'success',
        message: 'Playlist song berhasil dihapus',
      });
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.log(error);
      return response;
    }
  }
}

module.exports = PlaylistSongsHandler;
