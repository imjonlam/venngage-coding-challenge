import Node from '../components/Node';

/**
 * @typedef {Object} Point
 * @property {Number} x - the X coordinate
 * @property {Number} y - the Y coordinate
 */

/**
 * Attempts to snap an element to it's closest neighbour or Viewport
 * @param {*} id - an elementID
 * @param {*} nodeIDs - an array of element IDs
 * @param {Number} axis - axis where
   *  0 = x-axis,
   *  1 = y-axis
 * @param {*} tolerance - how close is "enough" 
 * @returns {Point} the new top-left coordinates of the element
 *  in the form of {x: _, y: _}
 */
function snap(id, nodeIDs, axis, tolerance) {
  // create a Node for the element being dragged
  const node = new Node(id);
  let nodes = Node.getNodes(nodeIDs.filter(i => i != node.id));

  /** alignment priority:
   * 1. viewport outer boundary
   * 2. neighbouring nodes
   * 3. viewport center
  **/
  const status = (
    snapToViewport(node, axis, tolerance, outer=true) ||
    snapToNodes(node, nodes, axis, tolerance) ||
    snapToViewport(node, axis, tolerance, outer=false)
  );
  
  return {
    x: node.left,
    y: node.top
  };
}

/**
 * Snap a Node to its closest Node along an axis
 * @param {Node} node - a Node
 * @param {Array<Node>} nodes - an array of Nodes
   * @param {Number} axis - axis where
   *  0 = x-axis,
   *  1 = y-axis
 * @param {Number} tolerance - how close is "enough" 
 * @returns {Boolean} true if snapped successfully, 
 *  false if no Node in Nodes found to snap to
 */
 function snapToNodes(node, nodes, axis, tolerance) {
  // determine alignment function to call
  const align = axis == 0 ? vAlign : hAlign;
  const sides = axis == 0 ? 
    ["left", "centerX", "right"] : 
    ["bottom", "centerY", "top"];

  // find closest Node and try to align with it
  let closest = Node.closestNode(node, nodes, axis);
  while (nodes.length > 0) {
    if (
      align(node, closest, sides[0], tolerance) ||
      align(node, closest, sides[1], tolerance) ||
      align(node, closest, sides[2], tolerance)
    ) {
      return true;
    }

    // remove bad Node and try again
    nodes = Node.removeNode(closest.id, nodes);
    closest = Node.closestNode(node, nodes, axis);
  }

  return false;
}

/**
 * Snap a Node to the Viewport along an axis
 * @param {Node} node - a Node
   * @param {Number} axis - axis where
   *  0 = x-axis,
   *  1 = y-axis
 * @param {Number} tolerance - how close is "enough" 
 * @param {Boolean} [outer=true] - check outer bounds if true,
 *   otherwise middle of viewport
 * @returns {Boolean} true if snapped successfully
 */
function snapToViewport(node, axis, tolerance, outer=true) {
  // setup viewport as a Node
  const viewport = new Node(
    "viewport", 
    {
      left: 0,
      top: 0,
      bottom: window.innerHeight,
      right: window.innerWidth
    }
  );

  // check outer bounds
  if (outer) {
    const bounds = axis == 0 ? hBounds : vBounds;
    return bounds(node, viewport, tolerance);
  }
  
  // check center alignment with viewport
  const key = axis == 0 ? "centerX" : "centerY";
  const align = axis == 0 ? vAlign : hAlign;
  return align(node, viewport, key, tolerance);
}

/**
 * Horizontally aligns two Node if within tolerance
 * @param {Node} nodeA - a Node
 * @param {Node} nodeB - a Node
 * @param {String} key - side of nodeB to align to:
 *  ["top", "bottom", "centerY"]
 * @param {Number} tolerance - how close is "enough" 
 * @returns {Boolean} true if aligned successfully
 */
 function hAlign(nodeA, nodeB, key, tolerance) {
  const side = nodeB[key];

  // are any vertical sides on Node A close to any on Node B?
  // if so, adjust Node A coordinates
  if (closeEnough(nodeA.bottom, side, tolerance)) {
    nodeA.vTranslate(side - nodeA.bottom);
  } else if (closeEnough(nodeA.centerY, side, tolerance)) {
    nodeA.vTranslate(side - nodeA.centerY);
  } else if (closeEnough(nodeA.top, side, tolerance)) {
    nodeA.vTranslate(side - nodeA.top);
  } else {
    return false;
  }

  return true;
}

/**
 * Vertically aligns two Node if within tolerance
 * @param {Node} nodeA - a Node
 * @param {Node} nodeB - a Node
 * @param {String} key - side of nodeB to align to:
 *  ["left", "right", "centerX"]
 * @param {Number} tolerance - how close is "enough" 
 * @returns {Boolean} true if aligned successfully
 */
function vAlign(nodeA, nodeB, key, tolerance) {
  const side = nodeB[key];

  // are any horizontal sides on Node A close to any on Node B?
  // if so, adjust Node A coordinates
  if (closeEnough(nodeA.left, side, tolerance)) {
    nodeA.hTranslate(side - nodeA.left);
  } else if (closeEnough(nodeA.centerX, side, tolerance)) {
    nodeA.hTranslate(side - nodeA.centerX);
  } else if (closeEnough(nodeA.right, side, tolerance)) {
    nodeA.hTranslate(side - nodeA.right);
  } else {
    return false;
  }

  return true;
}

/**
 * Horizontally aligns a Node with the boundary if within tolerance
 * @param {Node} node - a Node
 * @param {Node} bounds - a Boundary (Viewport) Node
 * @param {Number} tolerance  - how close is "enough" 
 * @returns {Boolean} true if aligned successfully
 */
 function hBounds(node, bounds, tolerance) {
  // adjust Node so it's within the horizontal bounds 
  // or aligned at the center
  if (node.left <= bounds.left + tolerance) {
    node.hTranslate(bounds.left - node.left);
  } else if (node.right + tolerance >= bounds.right) {
    node.hTranslate(bounds.right - node.right);
  } else {
    return false;
  }
  return true;
}

/**
 * Vertically aligns a Node with the boundary if within tolerance
 * @param {Node} node - a Node
 * @param {Node} bounds - a Boundary (Viewport) Node
 * @param {Number} tolerance  - how close is "enough" 
 * @returns {Boolean} true if aligned successfully
 */
function vBounds(node, bounds, tolerance) {
  // adjust Node so it's within the vertical bounds 
  // or aligned at the center
  if (node.top <= bounds.top + tolerance) {
    node.vTranslate(bounds.top - node.top);
  } else if (node.bottom + tolerance >= bounds.bottom) {
    node.vTranslate(bounds.bottom - node.bottom);
  } else {
    return false;
  }
  return true;
}

/**
 * Checks if two values are close together
 * @param {Number} a
 * @param {Number} b 
 * @param {Number} tolerance - how close is "enough" 
 * @returns {Boolean} true if the two values are close together
 */
 function closeEnough(a, b, tolerance) {
  return Math.abs(b - a) <= tolerance;
}

export { 
  snap, 
  snapToNodes, 
  snapToViewport, 
  vAlign, 
  hAlign, 
  vBounds, 
  hBounds, 
  closeEnough 
};