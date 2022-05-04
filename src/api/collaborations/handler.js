const ClientError = require('../../exceptions/ClientError');

class CollaborationsHandler {
  constructor(collaborationService, playlistService, userService, validator) {
    this._collaborationService = collaborationService;
    this._playlistService = playlistService;
    this._userService = userService;
    this._validator = validator;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
  }

  async postCollaborationHandler(request, h) {
    try {
      this._validator.validateCollaborationPayload(request.payload);

      const { id: credentialId } = request.auth.credentials;
      const { playlistId, userId } = request.payload;

      // check whether users exists
      await this._userService.getUserById(userId);

      await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
      const collaborationId = await this._collaborationService.addCollaboration(playlistId, userId);

      const response = h.response({
        status: 'success',
        data: {
          collaborationId,
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

  async deleteCollaborationHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const { playlistId, userId } = request.payload;

      await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
      await this._collaborationService.deleteCollaboration(playlistId, userId);

      const response = h.response({
        status: 'success',
        message: 'Berhasil menghapus collaboration',
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

module.exports = CollaborationsHandler;
