/**
 * actual service object
 * @private
 */
const _esServices = function() {
  // **** states **** //

  // actual API available to the public
  return {
    /**
     * return the ES client API handle (after 5.2, need to call getCluster('data') to get the handle)
     * @param ver
     * @param server
     * @returns {*}
     */
    getAPIHandle: (ver, server) => {
      let _handle = null;
      if (JSON.parse(ver) >= 5.2) {
        _handle = server.plugins.elasticsearch.getCluster('data').callWithRequest;
      } else {
        _handle = server.plugins.elasticsearch.callWithRequest;
      }
      return _handle;
    }
  };
};

export default (new _esServices());


