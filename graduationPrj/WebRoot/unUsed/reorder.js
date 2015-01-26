/*
 * Ext JS Library 2.0.2 Copyright(c) 2006-2008, Ext JS, LLC. licensing@extjs.com
 * 
 * http://extjs.com/license
 */

Ext.onReady(function() {
	// shorthand
	var Tree = Ext.tree;

	var tree = new Tree.TreePanel({
		el : 'tree-div',
		useArrows : true,
		autoScroll : true,
		animate : true,
		enableDD : true,
		containerScroll : true,
		loader : new Tree.TreeLoader({
			dataUrl : 'get-nodes.php'
		})
	});

	// set the root node
	var root = new Tree.AsyncTreeNode({
		text : 'Ext JS',
		draggable : false,
		id : 'source'
	});
	tree.setRootNode(root);

	// render the tree
	tree.render();
	root.expand();

	var _st = window.setTimeout;
	window.setTimeout = function(fRef, mDelay) {
		if (typeof fRef == 'function') {
			var argu = Array.prototype.slice.call(arguments, 2);
			var f = (function() {
				fRef.apply(null, argu);
			});
			return _st(f, mDelay);
		}
		return _st(fRef, mDelay);
	}

	root.on('load', function(node) {
		node.eachChild(function(node) {
			node.getUI().hasClass = function(cls) {
				if (this.elNode) {
					return Ext.fly(this.elNode).hasClass(cls);
				}
			};
			node.on('click', function(node) {
				if (!node.timer) {
					node.timer = true;
					setTimeout(nodeColorTimer, 500, node);
				} else {
					node.timer = null;
					if (node.getUI().hasClass('toRed')) {
						node.getUI().removeClass('toRed');
					}
				}
			});
		});
	});
	var nodeColorToggle = function(node, cls) {
		if (node.getUI().hasClass(cls) || !node.timer) {
			node.getUI().removeClass(cls);
		} else {
			node.getUI().addClass(cls);
		}
	};
	var nodeColorTimer = function(node) {
		nodeColorToggle(node, 'toRed');
		if (node.timer) {
			setTimeout(nodeColorTimer, 500, node);
		}
	};
});