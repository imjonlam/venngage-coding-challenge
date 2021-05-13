import { expect } from '@jest/globals';
import Node from '../components/Node';
import { 
  closeEnough 
} from '../scripts/utils';

describe("Utility Tests", () => {
  test("To check if two values are close together", () => {
    const tolerance = 10;
    const a = 1;
    const b = 11;

    expect(closeEnough(a, b, tolerance)).toEqual(true);
  });
  
  test("To check if two values are too far away from eachother", () => {
    const tolerance = 10;
    const a = 5;
    const b = 20;

    expect(closeEnough(a, b, tolerance)).not.toEqual(true);
  });
});
