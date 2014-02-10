/* ==========================================================
 * yp: loader.js v20131227
 * ==========================================================
 * Copyright xiewu
 *
 * 框架加载模块
 * ========================================================== */
+function(win) {
  function scripts() {
    return document.getElementsByTagName('script');
  }
  /**
   * Helper function for iterating over an array backwards. If the func
   * returns a true value, it will break out of the loop.
   */
  function eachReverse(ary, func) {
    if (ary) {
      var i;
      for (i = ary.length - 1; i > -1; i -= 1) {
        if (ary[i] && func(ary[i], i, ary)) {
          break;
        }
      }
    }
  }

  eachReverse(scripts(), function(script) {
    var oYpConfig = win.oYpConfig
      , sUrlBase = oYpConfig.baseUrl
      , sUrlYp = sUrlBase + (oYpConfig.ypUrl || 'yp/')
      , sUrlJq = sUrlBase + (oYpConfig.ypUrl || 'yp/lib/require-jquery')
      , sUrlYpConfig = sUrlBase + 'demo/yp/yp-config'///
      , sUrlYpCore = sUrlYp + 'lib/yp-core'
      , sUrlMain = script.getAttribute('data-main');
    
    if (sUrlMain) {
      var sVer = script.getAttribute('src').replace(/^[^=]+=?/, '') || 'yp'
      sUrlMain = sUrlMain.replace('base/index', 'base/demo/index');
      script.setAttribute('data-main', sUrlMain);
      document.write('<script src="' + sUrlJq + '.js?v=' + sVer + '"><\/script>');
      document.write('<script src="' + sUrlYpConfig + '.js?v=' + sVer + '"><\/script>');
      document.write('<script src="' + sUrlYpCore + '.js?v=' + sVer + '"><\/script>');
      return true;
    }
  });
}(this);