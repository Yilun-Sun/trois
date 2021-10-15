import './App.css';
import * as Matter from 'matter-js';

// module aliases
var Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  Body = Matter.Body,
  Composite = Matter.Composite;

// create an engine
var engine = Engine.create();
engine.gravity.y = 0;
engine.inertia = Infinity;

// create a renderer
var render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
  },
});

// create two boxes and a ground
var boxA = Bodies.rectangle(200, 500, 80, 80, {
  inertia: Infinity,
  restitution: 1,
  friction: 0,
  frictionAir: 0,
  frictionStatic: 0,
});
var boxB = Bodies.rectangle(600, 400, 80, 80);
var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

// add all of the bodies to the world
Composite.add(engine.world, [boxA, boxB, ground]);

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);
Body.setVelocity(boxA, { x: 1, y: 0 });

animate();
function animate() {
  if (Math.abs(boxA.position.x - boxB.position.x) < 500) {
    console.log(boxB.position - boxA.position);
    // Body.applyForce(boxA, boxA.position, (boxB.position - boxA.position) / 500)
  }
  // Body.applyForce(
  //   boxA,
  //   { x: boxA.position.x, y: boxA.position.y },
  //   { x: 0, y: -0.001 }
  // );

  requestAnimationFrame(animate);
}

function App() {
  return <div style={{ position: 'absolute' }}>Matter</div>;
}

export default App;
