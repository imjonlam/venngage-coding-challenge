# Venngage Coding Challenge
[![codecov](https://codecov.io/gh/imjonlam/venngage-coding-challenge/branch/main/graph/badge.svg?token=7OI2I2B2GI)](https://codecov.io/gh/imjonlam/venngage-coding-challenge)

## Description
This repository contains the functions required to implement an alignment feature where a user can drag and drop items and automatically be aligned with its closest node (or viewport).

## Technologies
* **Language**: Javascript ES6
* **Testing Framework**: Jest

## Overview
* The main functions can be found [here](./scripts/utils.js) and use a [Node class](./components/Node.js) to represent each item
* Entry function is [snap(id, nodeIDs, axis, tolerance)](./scripts/utils.js#L20)
  * `id`: the element ID of the currently dragged item
  * `nodeIDs`: an array of element IDs in the viewport (or you want to attempt to align with)
  * `axis`: the axis the element being draged is moving
    * `0`: moving along x-axis
    * `1`: moving along y-axis
  * `tolerance`: the space in pixels between two Nodes (or node and viewport) for aligning to occur
  * **returns** the new coordinates that the element should be set to.
    * If no alignment occured, the old coordinates are returned.

## Assumptions
* Data for each item used for calculations will be retrieved using a [DomRect](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect). 
* The viewport dimensions will be retrieved using:
  * `window.innerHeight` and `window.innerWidth`
* **Alignment priorities:**
  1. An item cannot be outside of the viewport
  2. An item can align to it's nearest neighbour
  3. An item can align to the middle of the viewport
* Whenever an item is being dragged, it is moving along **only one axis**. In cases where an item is moving diagonally, this is a sequential combination of left/right and up/down movements.
  * In such cases, you may wish to invoke the function [snap](./scripts/utils.js#L20) twice.