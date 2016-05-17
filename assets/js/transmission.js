(function () {
  
  // Send a socket request (virtual GET) to a Sails server using Socket.io.
  io.socket.get('/transmission', function socketConnected(data) {


    // Start listening for server-sent events from Sails
    io.socket.on('transmission', function transmissionReceived(msg) {


      // When we receive a transmission, add it to the table.
      log('Received a transmission!: ', msg);

      var transmission = msg.data;
      var table = $('.transmission-table');

      if (!table) {
        return;
      }

      var html = htmlRow(transmission);

      table.find('tbody tr:last').remove();
      table.find('tbody').prepend(html);

    });


    // Once we have established the server connection, initialize our table.
    var table = $('.transmission-table');
    var html, transmission;

    if (!table) {
      return;
    }

    for (var i in data) {
      transmission = data[i];
      html = htmlRow(transmission);
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
   * Add a new row to the table with the details of the transmission
   */
  function htmlRow(transmission) {
    var html;
    html = '<tr>';
    html += '<td><a href="/transmission/' + transmission.id + '">' + transmission.id + '</a></td>';
    html += '<td>' + transmission.body.Meta.DataModel + '</td>';
    html += '<td>' + transmission.body.Meta.EventType + '</td>';
    html += '<td>' + new Date(transmission.createdAt) + '</td>';
    html += '</tr>';

    return html;
  }
})();

