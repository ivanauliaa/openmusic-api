const ClientError = require('../../exceptions/ClientError');

class UserAlbumLikesHandler {
  constructor(userAlbumLikesService, albumsService) {
    this._userAlbumLikesService = userAlbumLikesService;
    this._albumsService = albumsService;

    this.postUserAlbumLikeHandler = this.postUserAlbumLikeHandler.bind(this);
    this.getUserAlbumLikesHandler = this.getUserAlbumLikesHandler.bind(this);
  }

  async postUserAlbumLikeHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const { id: albumId } = request.params;

      await this._albumsService.getAlbum(albumId);

      const alreadyExists = await this._userAlbumLikesService.verifyAlbumLike({
        userId: credentialId,
        albumId,
      });

      if (!alreadyExists) {
        await this._userAlbumLikesService.likeAlbum({ userId: credentialId, albumId });
      } else {
        await this._userAlbumLikesService.unlikeAlbum({ userId: credentialId, albumId });
      }

      const response = h.response({
        status: 'success',
        message: 'Berhasil melakukan like/unlike album',
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

  async getUserAlbumLikesHandler(request, h) {
    try {
      const { id } = request.params;

      await this._albumsService.getAlbum(id);

      const likes = await this._userAlbumLikesService.getAlbumLikes({ albumId: id });

      const response = h.response({
        status: 'success',
        data: {
          likes,
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
}

module.exports = UserAlbumLikesHandler;
