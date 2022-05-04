const ClientError = require('../../exceptions/ClientError');

class PlaylistSongActivitiesHandler {
  constructor(playlistService, playlistSongActivitiesService) {
    this._playlistService = playlistService;
    this._playlistSongActivitiesService = playlistSongActivitiesService;

    this.getPlaylistSongActivities = this.getPlaylistSongActivities.bind(this);
  }

  async getPlaylistSongActivities(request, h) {
    try {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._playlistService.verifyPlaylistOwner(id, credentialId);

      const { playlistId, activities } = await this._playlistSongActivitiesService
        .getPlaylistSongActivities(id);

      const response = h.response({
        status: 'success',
        data: {
          playlistId,
          activities,
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

module.exports = PlaylistSongActivitiesHandler;
