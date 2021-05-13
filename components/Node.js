class Node {
  /**
   * A Node represents an element in the Viewport
   * @param {Number} id  - an elementID
   * @param {DOMRect} [rect=null] - a DOMRect Object or
   *  similarliy structured
   */
  constructor(id, rect=null) {
    this.id = id;

    if (rect == null) {
      const element = document.getElementById(id);      
      rect = element.getBoundingClientRect();
    }

    this.top = rect.top;
    this.bottom = rect.bottom;
    this.left = rect.left;
    this.right = rect.right;
    
    this.centerX = Math.floor((rect.right + rect.left) / 2);
    this.centerY = Math.floor((rect.bottom + rect.top) / 2); 
  }

  /**
   * Translates the Node vertically 
   * @param {Number} offset - amount to translate
   */
  vTranslate(offset) {
    this.top += offset;
    this.bottom += offset;
    this.centerY = Math.floor((this.bottom + this.top) / 2); 
  }
  /**
  * Translates the Node horizontally
  * @param {Number} offset - amount to translate
  */
  hTranslate(offset) {
    this.left += offset;
    this.right += offset;
    this.centerX = Math.floor((this.right + this.left) / 2);
  }

  /**
   * Returns an array of Nodes
   * @param {Array<Number>} nodeIDs - an array of element IDs
   * @returns {Array<Node>} an array of Nodes
   */
  static getNodes(nodeIDs) {
    return $.map(nodeIDs, function(id) {
      return new Node(id);
    });
  }

  /**
   * 
   * @param {Node} node - a Node
   * @param {Array<Node>} nodes - an array of Nodes
   * @param {Number} axis - axis where
   *  0 = x-axis,
   *  1 = y-axis
   * @returns {Node} closest Node, null otherwise
   */
  static closestNode(node, nodes, axis) {
    const key = (axis == 0) ? "bottom" : "left";

    if (nodes.length == 0) {
      return null;
    }

    const reducer = (prev, curr) => (
      Math.abs(curr[key] - node[key]) < 
      Math.abs(prev[key] - node[key]) ?
      curr : prev
    );

    return nodes.reduce(reducer);
  }

  /**
   * Removes a given Node with id from Nodes
   * @param {Number} id - a element ID of the Node to remove
   * @param {Array<Node>} nodes - an array of Nodes
   * @returns {Array<Node>} a new array of Nodes with target Node removed
   */
  static removeNode(id, nodes) {
    return nodes.filter(node => node.id != id);
  }
}

export default Node;