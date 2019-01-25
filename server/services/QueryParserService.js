/**
 * query content parsing
 * @returns {{loadPlugin: loadPlugin, parse: (function(*=): *)}}
 * @private
 */
const _queryParserService = function () {
  const CSS_HTTP_VERB = 'parser-http-verb';
  const CSS_INDEX_LINE = 'parser-index-line';
  const CSS_LINE_WRAP = 'parser-word-wrap';
  /**
   * default parser; in general the parser should be picked based on
   * the method -> loadPlugin (pluginName, version)
   * @type {{parse: parse}}
   * @private
   */
  let _parser = {};
  _parser = {
    parse: (queryContent) => {
      if (queryContent) {
        // json parsing
        const _jContent = JSON.parse(queryContent);
        // line breakage
        let _lines = _jContent.content.split('\n');
        // apply coloring(s)
        _lines.forEach((_line, idx) => {
          // direct replacement
          let _verbIdx = _line.indexOf('GET');
          let _endVerbIdx = -1;
          let _verb = undefined;
          if (_verbIdx !== -1) {
            _endVerbIdx = _verbIdx + 3;
            _verb = 'GET';
          }
          if (_verbIdx === -1) {
            _verbIdx = _line.indexOf('PUT');
            if (_verbIdx !== -1) {
              _endVerbIdx = _verbIdx + 3;
              _verb = 'PUT';
            }
          }
          if (_verbIdx === -1) {
            _verbIdx = _line.indexOf('POST');
            if (_verbIdx !== -1) {
              _endVerbIdx = _verbIdx + 4;
              _verb = 'POST';
            }
          }
          if (_verbIdx === -1) {
            _verbIdx = _line.indexOf('DELETE');
            if (_verbIdx !== -1) {
              _endVerbIdx = _verbIdx + 6;
              _verb = 'DELETE';
            }
          }
          if (_verbIdx === -1) {
            _verbIdx = _line.indexOf('HEAD');
            if (_verbIdx !== -1) {
              _endVerbIdx = _verbIdx + 4;
              _verb = 'HEAD';
            }
          }
          // is a "verb"
          if (_verbIdx !== -1) {
            _line = '<div class="' + CSS_LINE_WRAP + '"><span class="' + CSS_HTTP_VERB + '">' + _verb + '</span>' +
              '<span class="' + CSS_INDEX_LINE + '">' + _line.substring(_endVerbIdx).replace(/\s/g, '&nbsp;') + '</span> <div/>';
            _lines[idx] = _line;
          } else {
            // TODO: handle { or }
            // ** global replace using regexp => https://flaviocopes.com/how-to-replace-all-occurrences-string-javascript/
            _line = _line.replace(/\s/g, '&nbsp;');
            _lines[idx] = '<div class="' + CSS_LINE_WRAP + '"></div>' + _line + '<div/>';
          }
        }); // end -- _lines.forEach()
        return _lines.join('');
      } else {
        return '';
      }
    }
  };

  return {
    /**
     * TBD. Method to load the correct plugin for query parsing.
     * @param pluginName
     * @param version
     */
    loadPlugin: (pluginName, version) => {
      console.log('TBD => plugin: ', pluginName, '; version: ', version);
    },
    /**
     * actual method to parse the query content.
     * @param queryContent
     * @returns {*}
     */
    parse: (queryContent) => {
      return _parser.parse(queryContent);
    }
  };
}

export default (new _queryParserService());