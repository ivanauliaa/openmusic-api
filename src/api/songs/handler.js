const ClientError = require('../../exceptions/ClientError');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongHandler = this.getSongHandler.bind(this);
    this.putSongHandler = this.putSongHandler.bind(this);
    this.deleteSongHandler = this.deleteSongHandler.bind(this);
  }

  async postSongHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);
      const {
        title, year, genre, performer, duration, albumId,
      } = request.payload;

      const songId = await this._service.addSong({
        title, year, genre, performer, duration, albumId,
      });

      const response = h.response({
        status: 'success',
        message: 'Song berhasil ditambahkan',
        data: {
          songId,
        },
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

  async getSongsHandler(request, h) {
    const { title, performer } = request.query;
    const songs = await this._service.getSongs({ title, performer });

    const response = h.response({
      status: 'success',
      data: {
        songs: songs.map((song) => ({
          id: song.id,
          title: song.title,
          performer: song.performer,
        })),
      },
    });
    response.code(200);
    return response;
  }

  async getSongHandler(request, h) {
    const { id } = request.params;

    try {
      const song = await this._service.getSong(id);

      const response = h.response({
        status: 'success',
        data: {
          song,
        },
      });
      response.code(200);
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
        message: 'Maaf terjadi kegagalan pada server kami.',
      });
      response.code(500);
      return response;
    }
  }

  async putSongHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);
      const {
        title, year, genre, performer, duration, albumId,
      } = request.payload;

      const { id } = request.params;

      await this._service.updateSong(id, {
        title, year, genre, performer, duration, albumId,
      });

      const response = h.response({
        status: 'success',
        message: 'Song berhasil diperbarui',
      });
      response.code(200);
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
        message: 'Maaf terjadi kegagalan pada server kami.',
      });
      response.code(500);
      return response;
    }
  }

  async deleteSongHandler(request, h) {
    try {
      const { id } = request.params;
      await this._service.deleteSong(id);

      const response = h.response({
        status: 'success',
        message: 'Song berhasil dihapus',
      });
      response.code(200);
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
        message: error.message,
      });
      response.code(500);
      return response;
    }
  }
}

module.exports = SongsHandler;
