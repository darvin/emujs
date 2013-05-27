angular.module( 'p2pService', [])

.factory( 'p2pService', function (  ) {
  
  var p2pService = {
    createClient:function(clientId, opts) {
      var peer = new Peer(clientId, 
        {
        key: 'qbxxtma1ws7qr529',
        host:"0.peerjs.com",
        port:"9000",
        debug:true
      }
        /*{host: 'localhost', port: 9000}*/
      );


      var connections = {};

      peer.on('connection', function(conn) {
        console.error("HI");

        connections[conn.peer] = conn;
        conn.on('data', opts.onReceived);
        opts.onConnected(conn.peer);

      });

      return {
        connect: function(connectToClientId) {
          console.error("connecting "+peer.id + "to "+connectToClientId);

          var conn = peer.connect(connectToClientId);
          conn.on('data', opts.onReceived);
          connections[connectToClientId] = conn;
        },
        send: function(data) {
          console.error(data, connections);
          angular.forEach(connections, function(conn, peerId){
            console.error("seding from "+peer.id+" to "+conn.peer);
            conn.send(data);
          });
        }
      };


    }
  };

  return p2pService;
});