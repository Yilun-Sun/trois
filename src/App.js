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
const noFriction = {
  inertia: Infinity,
  restitution: 1,
  friction: 0,
  frictionAir: 0,
  frictionStatic: 0,
};

// create two boxes and a ground
var boxes = [];
var boxA = Bodies.rectangle(200, 500, 20, 20, noFriction);
var boxB = Bodies.circle(400, 300, 40, noFriction);
boxB.mass = 10000;
var boxC = Bodies.rectangle(300, 300, 10, 10, noFriction);
boxes.push(boxA, boxB, boxC);
// var boxC = Bodies.rectangle(200, 500, 20, 20, noFriction);

// add all of the bodies to the world
Composite.add(engine.world, boxes);

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);
// Body.setVelocity(boxA, { x: 1, y: 0 });

animate();
function animate() {
  for (let i = 0; i < boxes.length - 1; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      if (i === j) continue;
      // calculate distance
      const box1 = boxes[i];
      const box2 = boxes[j];
      const pointTo2 = Vector.add(box2.position, Vector.neg(box1.position));
      const distance = Vector.magnitude(pointTo2);

      // calculate force
      if (distance < 500) {
        const force = (Math.pow(500 - distance, 2) / 2000000000).toFixed(5);
        const forceTo1 = Vector.mult(Vector.normalise(pointTo2), force);

        const forceTo2 = Vector.mult(forceTo1, -1);

        // apply force to both
        Body.applyForce(box1, box1.position, forceTo1);
        Body.applyForce(box2, box2.position, forceTo2);
      }
    }
  }

  // const pointToA = Vector.add(boxB.position, Vector.neg(boxA.position));
  // const power = (
  //   Math.pow(500 - Vector.magnitude(pointToA), 2) / 2000000000
  // ).toFixed(5);

  // ctx.strokeText(
  //   `(${boxA.position.x.toFixed(0)},${boxA.position.y.toFixed(
  //     0
  //   )})\nspeed:${Vector.magnitude(boxA.velocity).toFixed(1)}`,
  //   boxA.position.x + 10,
  //   boxA.position.y + 10
  // );

  // if (Vector.magnitude(pointToA) < 500) {
  //   const forceToA = Vector.mult(Vector.normalise(pointToA), power);
  //   Body.applyForce(boxA, boxA.position, forceToA);
  //   const forceToB = Vector.mult(forceToA, -0.1);
  //   Body.applyForce(boxB, boxB.position, forceToB);

  //   // ctx.moveTo(boxA.position.x, boxA.position.y);
  //   // ctx.lineTo(boxA.position.x + pointToA.x, boxA.position.y + pointToA.y);
  //   // ctx.stroke();
  // }

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
