import { expect } from '@jest/globals';
import Node from '../components/Node';

describe("Node Tests", () => {
  test("A Node should be created with proper data", () => {
    const rect = {
      top: 50,
      right: 582,
      bottom: 290,
      left: 142
    };

    const node = new Node("jest", rect);

    expect(node.top).toEqual(rect.top);
    expect(node.bottom).toEqual(rect.bottom);
    expect(node.left).toEqual(rect.left);
    expect(node.right).toEqual(rect.right);
    
    expect(node.centerX).toEqual(362);
    expect(node.centerY).toEqual(170);
  });

  test("A Node can be horizontally translated", () => {
    const rect = {
      top: 50,
      right: 582,
      bottom: 290,
      left: 142
    };

    const node = new Node("jest", rect);
    node.hTranslate(-10);

    expect(node.left).toEqual(132);
    expect(node.right).toEqual(572);
    expect(node.centerX).toEqual(352);
  });

  test("A Node can be vertically translated", () => {
    const rect = {
      top: 50,
      right: 582,
      bottom: 290,
      left: 142
    };

    const node = new Node("jest", rect);
    node.vTranslate(-10);

    expect(node.top).toEqual(40);
    expect(node.bottom).toEqual(280);
    expect(node.centerY).toEqual(160);
  });

  test("A Node can be removed from an array of Nodes", () => {
    const rect = {
      top: 50,
      right: 582,
      bottom: 290,
      left: 142
    };

    const expected = new Node("rectangle", rect);
    let nodes = [new Node("square", rect), expected];
    nodes = Node.removeNode(nodes[1].id, nodes);

    expect(nodes).toEqual(expect.not.objectContaining(expected));
  });

  test("To find closest Node on x-axis", () => {
    const nodeA = new Node("nodeA", {
      top: 50,
      right: 582,
      bottom: 290,
      left: 142
    });

    const nodeB = new Node("nodeB", {
      top: 50,
      right: 1040,
      bottom: 290,
      left: 600
    });

    const nodeC = new Node("nodeC", {
      top: 50,
      right: 1485,
      bottom: 290,
      left: 1045
    });

    let nodes = [nodeA, nodeC];
    const closest = Node.closestNode(nodeB, nodes, 1);

    expect(closest.id).toEqual(nodeC.id);
  });

  test("To find closest Node on y-axis I", () => {
    const nodeA = new Node("nodeA", {
      top: 500,
      right: 200,
      bottom: 550,
      left: 150
    });

    const nodeB = new Node("nodeB", {
      top: 550,
      right: 200,
      bottom: 600,
      left: 150
    });
    
    const nodeC = new Node("nodeC", {
      top: 800,
      right: 200,
      bottom: 850,
      left: 150
    });

    let nodes = [nodeB, nodeC];
    const closest = Node.closestNode(nodeA, nodes, 0);

    expect(closest.id).toEqual(nodeB.id);
  });

  test("To find closest Node on y-axis II (closest could have the same y value)", () => {
    const nodeA = new Node("nodeA", {
      top: 500,
      right: 200,
      bottom: 550,
      left: 150
    });

    const nodeB = new Node("nodeB", {
      top: 550,
      right: 200,
      bottom: 600,
      left: 150
    });
    
    const nodeC = new Node("nodeC", {
      top: 800,
      right: 200,
      bottom: 850,
      left: 150
    });

    const nodeD = new Node("nodeD", {
      top: 500,
      right: 300,
      bottom: 550,
      left: 250
    });

    let nodes = [nodeB, nodeC, nodeD];
    const closest = Node.closestNode(nodeA, nodes, 0);

    expect(closest.id).toEqual(nodeD.id);
  });
});