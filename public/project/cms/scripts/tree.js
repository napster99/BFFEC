yp.use('tree', function() {
  yp.ready(function() {
    var ui = yp.ui
    ui.t_tree_html = $('#t_tree').html();

    var oPage = {
      init: function() {
        yp.ajax('url')
        .done(function(msg) {
          oPage.view(msg.data);
          oPage.listen(msg.data);
        });
      }
    , view: function(data) {
        ui.$menu.find('.slim-scroll').append(ui.t_tree_html);
        ui.$yp_container_menuTree = $('#yp-container-menuTree');
        ui.$yp_menuTree = $('#yp-menuTree');

        $.fn.zTree.init(ui.$yp_menuTree, {
          data: {
            simpleData: {
              enable: true
            , idKey: 'id'
            , pIdKey: 'pId'
            }
          , key: {
              checked: 'checked'
            }
          }
        , view: {
            fontCss: function(treeId, treeNode) {
              return treeNode.highlight ?
                  {'font-weight':'bold', color:'#f57a01'}
                : {'font-weight':'normal', color:'#ffffff'};
            }
          }
        , callback: {
            onClick: function(event, treeId, treeNode) {
              oPage.loadNodeUrl(treeNode);
            }
          }
        }, data);
      }
    , listen: function(data) {
        yp.sub('ui/unload.page', function() {
          ui.$yp_container_menuTree.remove();
        });

        var searchTimeout, nodeList = [];
        // 更新节点状态
        function fUpdateNodes(bHighlight) {
          for (var i = 0,len = nodeList.length; i < len; i++) {
            nodeList[i].highlight = bHighlight;
            oPage.oMenuTree.updateNode(nodeList[i]);
            if (bHighlight) {
              fExpandParentsNode(nodeList[i]);
            }
          }
        };
        // 展开父级节点
        function fExpandParentsNode(node) {
          var pNode = node.getParentNode();
          if (pNode) {
            if (pNode.open) {
              fExpandParentsNode(pNode, true);
            } else {
              oPage.oMenuTree.expandNode(pNode, true, false, false);
            }
          }
        };
        // 选中节点
        function selectNode(oNode) {
          oPage.oMenuTree.selectNode(oNode);
          oPage.loadNodeUrl(oNode);
        }

        oPage.oMenuTree = $.fn.zTree.getZTreeObj('yp-menuTree');
        // 默认选中
        var oNodes = oPage.oMenuTree.getNodes();
        if (data.length > 0) selectNode(oNodes[0]);

        // 监听搜索框输入
        ui.$yp_container_menuTree.find('.filter-bar-tree .form-control')
          .on('input.zTree', function() {
            var $this = $(this)
            if (searchTimeout) {
              clearTimeout(searchTimeout);
            }
            searchTimeout = setTimeout(function() {
              var txt = $.trim($this.val());
              fUpdateNodes(false);
              if (txt != '') {
                nodeList = oPage.oMenuTree.getNodesByParamFuzzy('name', txt, null);
                oPage.oMenuTree.expandAll(false);
                fUpdateNodes(true);
              } else {
                oPage.oMenuTree.expandAll(false);
              }
            }, 300);
          });
      }
    , loadNodeUrl: function(treeNode) {
        //ui.loadMain('html/table-calc.html?' + treeNode.id);
      }
    };
    oPage.init();
  });
});