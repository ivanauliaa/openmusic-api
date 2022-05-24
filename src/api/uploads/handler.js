const ClientError = require('../../exceptions/ClientError');

class UploadsHandler {
  constructor(storageService, albumsService, validator) {
    this._storageService = storageService;
    this._albumsService = albumsService;
    this._validator = validator;

    this.postUploadAlbumCoverHandler = this.postUploadAlbumCoverHandler.bind(this);
  }

  async postUploadAlbumCoverHandler(request, h) {
    try {
      const { cover } = request.payload;
      this._validator.validateImageHeaders(cover.hapi.headers);

      const { id } = request.params;

      const filename = await this._storageService.writeFile(cover, cover.hapi);
      await this._albumsService.updateAlbumCover(id, {
        coverUrl: `http://${process.env.HOST}:${process.env.PORT}/albums/${id}/covers/${filename}`,
      });

      const response = h.response({
        status: 'success',
        message: 'Sampul berhasil diunggah',
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
      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = UploadsHandler;
