import './App.css';
import * as Matter from 'matter-js';

// module aliases
var Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  Body = Matter.Body,
  Vector = Matter.Vector,
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
var boxA = Bodies.rectangle(200, 500, 20, 20, {
  inertia: Infinity,
  restitution: 1,
  friction: 0,
  frictionAir: 0,
  frictionStatic: 0,
});
var boxB = Bodies.circle(400, 300, 40);
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
  const pointToA = Vector.add(boxB.position, Vector.neg(boxA.position));
  const power = (
    Math.pow(500 - Vector.magnitude(pointToA), 2) / 2000000000
  ).toFixed(5);

  if (Vector.magnitude(pointToA) < 500) {
    const forceToA = Vector.mult(Vector.normalise(pointToA), power);
    // console.log(forceToA);
    Body.applyForce(boxA, boxA.position, forceToA);
  }

  // Body.applyForce(boxA, boxA.position, (boxB.position - boxA.position) / 500)
  // }
  // Body.applyForce(
  //   boxA,
  //   { x: boxA.position.x, y: boxA.position.y },
  //   { x: 0, y: -0.001 }
  // );

  requestAnimationFrame(animate);
}

function App() {
  return (
    <div style={{ position: 'absolute' }}>
      <button onClick={() => {}}>add force</button>
    </div>
  );
}

export default App;
