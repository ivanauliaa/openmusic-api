/* eslint-disable camelcase */
const songDBToModel = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  album_id,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId: album_id,
});

const albumDBToModel = ({
  id,
  name,
  year,
  songs,
  cover_url,
}) => ({
  id,
  name,
  year,
  songs,
  coverUrl: cover_url,
});

module.exports = { songDBToModel, albumDBToModel };
