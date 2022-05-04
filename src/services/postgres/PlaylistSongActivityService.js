const { nanoid } = require('nanoid');
const { Pool } = require('pg');

class PlaylistSongActivityService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistSongActivity(playlistId, {
    songId, userId, action, time,
  }) {
    const id = `activity-${nanoid(16)}`;

    const stmt = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, playlistId, songId, userId, action, time],
    };

    await this._pool.query(stmt);
  }

  async getPlaylistSongActivities(playlistId) {
    const stmt = {
      text: `SELECT users.username, songs.title, playlist_song_activities.action, playlist_song_activities.time
      FROM playlist_song_activities
      LEFT JOIN users ON users.id = playlist_song_activities.user_id
      LEFT JOIN songs ON songs.id = playlist_song_activities.song_id
      WHERE playlist_song_activities.playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(stmt);

    return { playlistId, activities: result.rows };
  }
}

module.exports = PlaylistSongActivityService;
