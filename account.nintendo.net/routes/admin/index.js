let routes = require('express').Router(),
    json2xml = require('json2xml'),
    bcrypt = require('bcryptjs'),
    database = require('../../db'),
    helpers = require('../../helpers'),
    constants = require('../../constants');

/**
 * [GET]
 * Replacement for: https://account.nintendo.net/v1/api/admin/mapped_ids
 * Description: idk, it probably returns a list of nnids or something, i'll look into this more later
 * Who to blame if it doesn't work: @superwhiskers
 */
routes.all('/mapped_ids', async (req, res) => {
  // there isn't a known way how it generates this value,
  // so i'll just return a predetermined value
  res.send('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><mapped_ids><mapped_id><in_id> </in_id><out_id></out_id></mapped_id></mapped_ids>')
})

module.exports = routes
