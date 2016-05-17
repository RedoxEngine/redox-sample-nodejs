(function () {
  
  // Send a socket request (virtual GET) to a Sails server using Socket.io.
  io.socket.get('/message', function socketConnected(data) {


    // Start listening for server-sent events from Sails
    io.socket.on('message', function messageReceived(msg) {


      // When we receive a message, add it to the table.
      log('Received a message!: ', msg);

      var message = msg.data;
      var table = $('.message-table');

      if (!table) {
        return;
      }

      var html = htmlRow(message);

      table.find('tbody tr:last').remove();
      table.find('tbody').prepend(html);

    });


    // Once we have established the server connection, initialize our table.
    var table = $('.message-table');
    var html, message;

    if (!table) {
      return;
    }

    for (var i in data) {
      message = data[i];
      html = htmlRow(message);
      table.find('tbody').append(html);
    }

  });
  
  /**
   * A simple log function
   */
  function log() {
    if (typeof console !== 'undefined') {
      console.log.apply(console, arguments);
    }
  }
  
  /**
   * Add a new row to the table with the details of the message
   */
  function htmlRow(message) {
    var html;
    html = '<tr>';
    html += '<td><a href="/message/' + message.id + '">' + message.id + '</a></td>';
    html += '<td>' + message.body.Meta.DataModel + '</td>';
    html += '<td>' + message.body.Meta.EventType + '</td>';
    html += '<td>' + new Date(message.createdAt) + '</td>';
    html += '</tr>';

    return html;
  }
})();

