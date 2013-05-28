describe( 'idService', function() {

  beforeEach( module( 'idService' ) );
  var firstTimeId, secondTimeId;

  it( 'should generate random id', inject( function(_idService_) {
    firstTimeId = _idService_.id;
    expect(firstTimeId).toBeTruthy();
  }));


  it( 'should generate random id each time', inject( function(_idService_) {
    secondTimeId = _idService_.id;
    expect(secondTimeId).toBeTruthy();
    expect(secondTimeId).not.toEqual(firstTimeId);
  }));

});

