const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistSongService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistSong(playlistId, { songId }) {
    const id = `playlist_song-${nanoid(16)}`;

    const stmt = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(stmt);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist song gagal ditambahkan');
    }
  }

  async getPlaylistSongs(playlistId) {
    const stmt = {
      text: `SELECT playlists.id, playlists.name, users.username
      FROM playlists
      LEFT JOIN users ON users.id = playlists.owner
      WHERE playlists.id = $1`,
      values: [playlistId],
    };
    let result = await this._pool.query(stmt);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = result.rows[0];

    const songStmt = {
      text: `SELECT songs.id, songs.title, songs.performer
      FROM playlists
      JOIN playlist_songs
      ON playlists.id = playlist_songs.playlist_id
      JOIN songs
      ON songs.id = playlist_songs.song_id
      WHERE playlists.id = $1`,
      values: [playlistId],
    };
    result = await this._pool.query(songStmt);

    playlist.songs = result.rows;

    return playlist;
  }

  async deletePlaylistSong(playlistId, { songId }) {
    const stmt = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(stmt);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus playlist song. playlistId dan songId tidak ditemukan');
    }
  }
}

module.exports = PlaylistSongService;
