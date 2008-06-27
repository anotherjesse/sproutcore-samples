// ==========================================================================
// Flickr.ServerController
// ==========================================================================

require('core');

/** @class

  (Document Your View Here)

  @extends SC.Object
  @author    AuthorName
  @version 0.1
  @static
*/
Flickr.serverController = SC.Object.create(
/** @scope Flickr.serverController */ {

  refresh: function() {

    var url = '/services/rest/?method=flickr.interestingness.getList&format=json&nojsoncallback=1&api_key=9f04a9da9d2110cfbb9cd77536626e76';
    new Ajax.Request(url, {
      method: 'get',
      onSuccess: this.refreshDidSucceed.bind(this),
      onFailure: this.refreshDidFail.bind(this)
    }) ;
  },

    /**
    Called when the request returns successfully.  Process the return
    records and add them to the store.
  */
  refreshDidSucceed: function(transport) {
    var json = transport.responseText ;
    if (json && json.parseJSON) json = json.parseJSON() ;

    // convert the received attributes into attribute hashes that can be
    // processed by updateRecords.
    var attrs = this.convertFeedToRecordAttributes(json['photos']);

    // load into the store.  This should update the collection.
    SC.Store.updateRecords(attrs);
  },

  refreshDidFail: function(transport) {
    // if we failed b/c of a 400, then we probably got an explanation...
    // try to fill that in.
    alert('error refreshing...');
  },

  convertFeedToRecordAttributes: function(json) {
    var ret = [] ;
    var users = {} ; // user hashes, by guid.

    var sample = {"id":"2610636636", "owner":"22809667@N00", "secret":"fc46cf85f0", "server":"3160", "farm":4, "title":"City of Lights", "ispublic":1, "isfriend":0, "isfamily":0};

    // loop through json and fix up items.
    json['photo'].each(function(rec) {
      rec.guid = rec.id;
      rec.recordType = Flickr.Photo; // setup the record type

      // save in return array
      ret.push(rec) ;
    });

    return ret;
  }

}) ;
