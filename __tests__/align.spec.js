import { expect } from '@jest/globals';
import Node from '../components/Node';
import { 
  snap, 
  snapToNodes, 
  vAlign, 
  hAlign, 
  vBounds, 
  hBounds,
  snapToViewport, 
} from '../scripts/utils';

describe("Alignment Tests", () => {
  test("A Node cannot be outside of the Viewport I", () => {
    const tolerance = 10;

    const node = new Node("node", {
      top: 100,
      right: 45,
      bottom: 150,
      left: -5
    });

    const viewport = new Node("viewport", {
      left: 0,
      top: 0,
      bottom: 600,
      right: 800,
    });

    const status = hBounds(node, viewport, tolerance);

    expect(status).toEqual(true);
    expect(node.left).toEqual(0);
    expect(node.right).toEqual(50);
    expect(node.centerX).toEqual(25);
  });

  test("A Node cannot be outside of the Viewport II", () => {
    const tolerance = 10;

    const node = new Node("node", {
      top: 100,
      right: 810,
      bottom: 150,
      left: 760
    });

    const viewport = new Node("viewport", {
      left: 0,
      top: 0,
      bottom: 600,
      right: 800,
    });

    const status = hBounds(node, viewport, tolerance);

    expect(status).toEqual(true);
    expect(node.left).toEqual(750);
    expect(node.right).toEqual(800);
    expect(node.centerX).toEqual(775);
  });

  test("A Node cannot be outside of the Viewport III", () => {
    const tolerance = 10;

    const node = new Node("node", {
      top: -100,
      right: 100,
      bottom: -50,
      left: 50
    });

    const viewport = new Node("viewport", {
      left: 0,
      top: 0,
      bottom: 600,
      right: 800,
    });

    const status = vBounds(node, viewport, tolerance);

    expect(status).toEqual(true);
    expect(node.top).toEqual(0);
    expect(node.bottom).toEqual(50);
    expect(node.centerY).toEqual(25);
  });

  test("A Node cannot be outside of the Viewport IV", () => {
    const tolerance = 10;

    const node = new Node("node", {
      top: 560,
      right: 100,
      bottom: 610,
      left: 50
    });

    const viewport = new Node("viewport", {
      left: 0,
      top: 0,
      bottom: 600,
      right: 800,
    });

    const status = vBounds(node, viewport, tolerance);

    expect(status).toEqual(true);
    expect(node.top).toEqual(550);
    expect(node.bottom).toEqual(600);
    expect(node.centerY).toEqual(575);
  });

  test("A Node can snap to the Viewport I", () => {
    const tolerance = 10;

    const node = new Node("node", {
      top: 9,
      right: 100,
      bottom: 59,
      left: 50
    });

    const viewport = new Node("viewport", {
      left: 0,
      top: 0,
      bottom: 600,
      right: 800,
    });

    const status = vBounds(node, viewport, tolerance);

    expect(status).toEqual(true);
    expect(node.top).toEqual(0);
    expect(node.bottom).toEqual(50);
    expect(node.centerY).toEqual(25);
  });

  test("A Node can snap to the Viewport II", () => {
    const tolerance = 10;

    const node = new Node("node", {
      top: 9,
      right: 790,
      bottom: 59,
      left: 740
    });

    const viewport = new Node("viewport", {
      left: 0,
      top: 0,
      bottom: 600,
      right: 800,
    });

    const status = hBounds(node, viewport, tolerance);

    expect(status).toEqual(true);
    expect(node.left).toEqual(750);
    expect(node.right).toEqual(800);
    expect(node.centerX).toEqual(775);
  });

  test("A Node does not snap to Viewport if outside of tolerance", () => {
    const tolerance = 10;

    const node = new Node("node", {
      top: 9,
      right: 789,
      bottom: 59,
      left: 739
    });

    const viewport = new Node("viewport", {
      left: 0,
      top: 0,
      bottom: 600,
      right: 800,
    });

    const status = hBounds(node, viewport, tolerance);

    expect(status).toEqual(false);
    expect(node.right).toEqual(789);
    expect(node.left).toEqual(739);
    expect(node.centerX).toEqual(764);
  });

  test("A node can snap to the center of the Viewport I", () => {
    const tolerance = 10;

    const node = new Node("node", {
      top: 305,
      right: 200,
      bottom: 355,
      left: 150
    });

    const viewport = new Node("viewport", {
      left: 0,
      top: 0,
      bottom: 600,
      right: 800,
    });

    const status = hAlign(node, viewport, "centerY", tolerance);

    expect(status).toEqual(true);
    expect(node.top).toEqual(300);
    expect(node.bottom).toEqual(350);
    expect(node.centerY).toEqual(325);
  });

  test("A Node can snap to the center of the Viewport II", () => {
    const tolerance = 10;

    const node = new Node("node", {
      top: 270,
      right: 200,
      bottom: 320,
      left: 150
    });

    const viewport = new Node("viewport", {
      left: 0,
      top: 0,
      bottom: 600,
      right: 800,
    });

    const status = hAlign(node, viewport, "centerY", tolerance);
    
    expect(status).toEqual(true);
    expect(node.top).toEqual(275);
    expect(node.bottom).toEqual(325);
    expect(node.centerY).toEqual(300);
  });

  test("A node can snap to another Node if close together I", () => {
    const tolerance = 10;
    const nodeA = new Node("nodeA", {
      top: 150,
      right: 295,
      bottom: 200,
      left: 245
    });

    const nodeB = new Node("nodeB", {
      top: 90,
      right: 300,
      bottom: 140,
      left: 250
    });

    const status = vAlign(nodeA, nodeB, "left", tolerance);

    expect(status).toEqual(true);
    expect(nodeA.left).toEqual(250);
    expect(nodeA.right).toEqual(300);
  });

  test("A node can snap to another Node if close together II", () => {
    const tolerance = 10;
    const nodeA = new Node("nodeA", {
      top: 150,
      right: 330,
      bottom: 200,
      left: 280
    });

    const nodeB = new Node("nodeB", {
      top: 90,
      right: 300,
      bottom: 140,
      left: 250
    });

    const status = vAlign(nodeA, nodeB, "centerX", tolerance);

    expect(status).toEqual(true);
    expect(nodeA.left).toEqual(275);
    expect(nodeA.right).toEqual(325);
  });

  test("A node can snap to another Node if close together III", () => {
    const tolerance = 10;
    const nodeA = new Node("nodeA", {
      top: 150,
      right: 300,
      bottom: 200,
      left: 250
    });

    const nodeB = new Node("nodeB", {
      top: 100,
      right: 300,
      bottom: 150,
      left: 250
    });

    const status = hAlign(nodeA, nodeB, "bottom", tolerance);

    expect(status).toEqual(true);
    expect(nodeA.top).toEqual(150);
    expect(nodeA.bottom).toEqual(200);
  });

  test("Attempt to snap a Node to the Viewport I", () => {
    global.innerWidth = 800;
    global.innerHeight = 600;

    const tolerance = 10;
    const node = new Node("node", {
      top: 305,
      right: 200,
      bottom: 355,
      left: 150
    });


    const status = snapToViewport(node, 1, tolerance, false);

    expect(status).toEqual(true);
    expect(node.top).toEqual(300);
    expect(node.bottom).toEqual(350);
    expect(node.centerY).toEqual(325);
  });

  test("Attempt to snap a Node to the Viewport II", () => {
    global.innerWidth = 800;
    global.innerHeight = 600;

    const tolerance = 10;
    const node = new Node("node", {
      top: 9,
      right: 790,
      bottom: 59,
      left: 740
    });


    const status = snapToViewport(node, 0, tolerance);

    expect(status).toEqual(true);
    expect(node.left).toEqual(750);
    expect(node.right).toEqual(800);
    expect(node.centerX).toEqual(775);
  });

  test("Attempt to snap a Node to another Node I", () => {
    const tolerance = 10;
    const nodeA = new Node("nodeA", {
      top: 145,
      right: 150,
      bottom: 195,
      left: 100
    });

    const nodeB = new Node("nodeB", {
      top: 90,
      right: 300,
      bottom: 140,
      left: 250
    });

    const nodeC = new Node("nodeC", {
      top: 250,
      right: 305,
      bottom: 300,
      left: 255
    });

    let nodes = [nodeA, nodeC];
    const status = snapToNodes(nodeB, nodes, 0, tolerance);

    expect(status).toEqual(true);
    expect(nodeB.left).toEqual(255);
    expect(nodeB.right).toEqual(305);
    expect(nodeB.top).toEqual(90);
    expect(nodeB.bottom).toEqual(140);
  });

  test("Attempt to snap a Node to another Node I", () => {
    const tolerance = 10;
    const nodeA = new Node("nodeA", {
      top: 145,
      right: 150,
      bottom: 195,
      left: 100
    });

    const nodeB = new Node("nodeB", {
      top: 90,
      right: 300,
      bottom: 140,
      left: 250
    });

    const nodeC = new Node("nodeC", {
      top: 250,
      right: 305,
      bottom: 300,
      left: 255
    });

    let nodes = [nodeA, nodeC];
    const status = snapToNodes(nodeB, nodes, 1, tolerance);

    expect(status).toEqual(true);
    expect(nodeB.left).toEqual(250);
    expect(nodeB.right).toEqual(300);
    expect(nodeB.top).toEqual(95);
    expect(nodeB.bottom).toEqual(145);
  });
  
  test("Node has no other Nodes to snap to", () => {
    const tolerance = 10;
    const node = new Node("nodeA", {
      top: 145,
      right: 150,
      bottom: 195,
      left: 100
    });

    let nodes = [];
    const status = snapToNodes(node, nodes, 1, tolerance);

    expect(status).toEqual(false);
    expect(node.left).toEqual(100);
    expect(node.right).toEqual(150);
    expect(node.top).toEqual(145);
    expect(node.bottom).toEqual(195);
  });
});