/**
* Message.js
*
* @description :: data requests sent to RedoxEngine
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
    Message.find({ sort: 'id asc' }).exec(function (err, messages) { 
      if (err) {
        throw err;
      }

      if (messages.length < 11) {
        Message.publishCreate(values);
        return cb();
      }

      Message.destroy(messages[0].id, function (err) {
        if (err) {
          throw err;
        }

        Message.publishCreate(values);
        cb();
      });
    });
  }
};

