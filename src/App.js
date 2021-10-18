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

const canvas = document.getElementsByTagName('canvas')[0];
console.log(canvas);
var ctx = canvas.getContext('2d');
ctx.beginPath();

// create two boxes and a ground
var boxA = Bodies.rectangle(200, 500, 20, 20, {
  inertia: Infinity,
  restitution: 1,
  friction: 0,
  frictionAir: 0,
  frictionStatic: 0,
});
var boxB = Bodies.circle(400, 300, 40);
// var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

// add all of the bodies to the world
Composite.add(engine.world, [boxA, boxB]);

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

  ctx.strokeText(
    `(${boxA.position.x.toFixed(0)},${boxA.position.y.toFixed(
      0
    )})\nspeed:${Vector.magnitude(boxA.velocity).toFixed(1)}`,
    boxA.position.x + 10,
    boxA.position.y + 10
  );

  if (Vector.magnitude(pointToA) < 500) {
    const forceToA = Vector.mult(Vector.normalise(pointToA), power);
    Body.applyForce(boxA, boxA.position, forceToA);

    ctx.moveTo(boxA.position.x, boxA.position.y);
    ctx.lineTo(boxA.position.x + pointToA.x, boxA.position.y + pointToA.y);
    ctx.stroke();
  }

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
