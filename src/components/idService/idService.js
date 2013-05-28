angular.module( 'idService', [])

.factory( 'idService', function (  ) {
  var generator = NameGen.compile("sV-i");
  var id = generator.toString();
  console.error(id);
  return {
    id: id
  };
});

