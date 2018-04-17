"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const channelBatcher = exports.channelBatcher = async (ids, models, user) => {
  const results = await models.sequelize.query("select distinct on (id) * from channels as c left outer join pcmembers as pc ON c.id = pc.channel_id  where c.team_id in (:teamIds) AND (c.public = true or pc.user_id = :userId ) ", {
    raw: true,
    replacements: { teamIds: ids, userId: user.id },
    model: models.Channel
  });

  const data = {};

  results.forEach(r => {
    if (data[r.team_id]) {
      data[r.team_id].push(r);
    } else {
      data[r.team_id] = [r];
    }
  });

  return ids.map(id => data[id]);
};

const dummy = exports.dummy = () => {};