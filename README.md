# Sensors

[![CI](https://github.com/mterczynski/sensors/actions/workflows/ci.yml/badge.svg)](https://github.com/mterczynski/sensors/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/mterczynski/sensors/branch/master/graph/badge.svg)](https://codecov.io/gh/mterczynski/sensors)

Machine learning project that utilizes neural networks and evolutionary algorithm

<img src="assets/projectPreview.gif" width="300" height="300">

## Description

This project demonstrates **evolutionary learning** where AI agents (bots) learn to navigate through maze-like environments without hitting walls.

### The Problem
Bots are placed in a level with walls and must survive as long as possible by avoiding collisions. Each bot has:
- Multiple **sensors** that detect distance to the nearest wall
- A simple **neural network** that processes sensor inputs to decide turning direction

### Learning Methods

**1. Neural Networks**
- Each bot has a neural network with weights that determine how sensor inputs affect movement
- Network inputs: distance readings from each sensor
- Network output: turning direction (left or right)

**2. Evolutionary Algorithm (Genetic Algorithm)**
- Population of bots compete each generation
- Fitness is measured by survival time
- Successful bots produce more offspring for the next generation
- Offspring inherit parent's neural network weights with small mutations
- Random anomalies introduce fresh neural networks to prevent local optima

**3. Mutation & Selection**
- Better-performing bots get more offspring (fitness-proportional selection)
- Offspring weights are slightly mutated to explore new behaviors
- Over generations, bots evolve better wall-avoidance strategies

Levels were generated using https://www.mter.pl/level-editor

## Setup scripts

### Install dependencies

```bash
npm i
```

### Start application in watch mode

```bash
npm start
```

### Build application

```bash
npm run build
```

### Run tests

```bash
npm test
```
