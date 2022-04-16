const ClientError = require('../../exceptions/ClientError');

class AlbumHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumHandler = this.getAlbumHandler.bind(this);
    this.putAlbumHandler = this.putAlbumHandler.bind(this);
    this.deleteAlbumHandler = this.deleteAlbumHandler.bind(this);
  }

  async postAlbumHandler(request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload);
      const { name, year } = request.payload;

      const albumId = await this._service.addAlbum({ name, year });

      const response = h.response({
        status: 'success',
        data: {
          albumId,
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
        message: 'Maaf terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.log(error);
      return response;
    }
  }

  async getAlbumHandler(request, h) {
    try {
      const { id } = request.params;
      const album = await this._service.getAlbum(id);

      const response = h.response({
        status: 'success',
        data: {
          album,
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
      console.log(error);
      return response;
    }
  }

  async putAlbumHandler(request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload);
      const { name, year } = request.payload;

      const { id } = request.params;

      await this._service.updateAlbum(id, { name, year });

      const response = h.response({
        status: 'success',
        message: 'Album berhasil diperbarui',
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
      console.log(error);
      return response;
    }
  }

  async deleteAlbumHandler(request, h) {
    try {
      const { id } = request.params;
      await this._service.deleteAlbum(id);

      const response = h.response({
        status: 'success',
        message: 'Album berhasil dihapus',
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
      console.log(error);
      return response;
    }
  }
}

module.exports = AlbumHandler;
