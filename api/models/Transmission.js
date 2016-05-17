/**
* Transmission.js
*
* @description :: data requests received by RedoxEngine
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    body: { type: 'json' },
    headers: { type: 'json' }
  },

  /**
   * After creating a message, delete the oldest message if we have more 
   *   than 10. Then notifify listners. 
   * 
   * @param values 
   * @param cb 
   */
  afterCreate: function (values, cb) {
    Transmission.find({ sort: 'id asc' }).exec(function (err, transmissions) {
      if (err) {
        throw err;
      }

      if (transmissions.length < 11) {
        Transmission.publishCreate(values);
        return cb();
      }

      Transmission.destroy(transmissions[0].id, function (err) {
        if (err) {
          throw err;
        }

        Transmission.publishCreate(values);
        cb();
      });
    });
  }

};