const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class UserAlbumLikesService {
  constructor() {
    this._pool = new Pool();
  }

  async likeAlbum({ userId, albumId }) {
    const id = `user_album_likes-${nanoid(16)}`;

    const stmt = {
      text: 'INSERT INTO user_album_likes VALUES ($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };

    const result = await this._pool.query(stmt);

    if (!result.rows[0].id) {
      throw new InvariantError('Gagal like album');
    }
  }

  async unlikeAlbum({ userId, albumId }) {
    const stmt = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [userId, albumId],
    };

    const result = await this._pool.query(stmt);

    if (!result.rows[0].id) {
      throw new NotFoundError('Gagal unlike album');
    }
  }

  async getAlbumLikes({ albumId }) {
    const stmt = {
      text: 'SELECT * FROM user_album_likes WHERE album_id = $1',
      values: [albumId],
    };

    const result = await this._pool.query(stmt);

    return result.rows.length;
  }

  async verifyAlbumLike({ userId, albumId }) {
    const stmt = {
      text: 'SELECT * FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    const result = await this._pool.query(stmt);

    return result.rows.length;
  }
}

module.exports = UserAlbumLikesService;
