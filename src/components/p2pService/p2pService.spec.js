describe( 'p2pService', function() {
  var $document;

  beforeEach( module( 'p2pService' ) );

  beforeEach( inject( function( _p2pService_ ) {
    p2pService = _p2pService_;
  }));

  

  it( 'should talk to each other in pairs', inject( function() {
    var onReceived1 = jasmine.createSpy(),
        onReceived2 = jasmine.createSpy(),
        onConnected1 = jasmine.createSpy();
    var peer1, peer2;


    runs(function(){
      peer1 = p2pService.createClient("pairPeer1", {
        onReceived:onReceived1,
        onConnected:onConnected1
      }),
      peer2 = p2pService.createClient("pairPeer2", {onReceived:onReceived2});

      peer2.connect("pairPeer1");
    });
    waits(1000);
    runs(function(){

      expect(onConnected1).toHaveBeenCalledWith("pairPeer2");

      peer1.send({some:"dataFromPeer1"});
      peer2.send(["dataFromPeer2"]);
    });
    waits(300);
    runs(function(){  
      expect(onReceived2).toHaveBeenCalledWith({some:"dataFromPeer1"});
      expect(onReceived1).toHaveBeenCalledWith(["dataFromPeer2"]);
      expect(onReceived1.callCount).toBe(1);
      expect(onReceived2.callCount).toBe(1);
    });
  }));
});

