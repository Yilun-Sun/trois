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
var ctx = canvas.getContext('2d');
ctx.beginPath();

const noFriction = {
  inertia: Infinity,
  restitution: 1,
  friction: 0,
  frictionAir: 0,
  frictionStatic: 0,
};

// create boxes
var boxes = [];

for (let i = 0; i < 20; i++) {
  const radius = Math.floor(Math.random() * 30 + 5);
  var box = Bodies.circle(
    Math.random() * 500 + 100,
    Math.random() * 500 + 200,
    radius,
    noFriction
  );
  box.mass = Math.pow(radius, 2);
  boxes.push(box);
}

// add all of the bodies to the world
Composite.add(engine.world, boxes);

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);

const G = 6.67 * Math.pow(10, -4);
animate();
function animate() {
  const newBoxes = [...boxes];
  for (let i = 0; i < boxes.length; i++) {
    ctx.strokeText(
      boxes[i].mass,
      boxes[i].position.x - 2,
      boxes[i].position.y + 1
    );
  }

  for (let i = 0; i < boxes.length - 1; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      if (i === j) continue;
      // calculate distance
      const box1 = boxes[i];
      const box2 = boxes[j];
      const pointTo2 = Vector.add(box2.position, Vector.neg(box1.position));
      const distance = Vector.magnitude(pointTo2);

      // calculate force
      if (
        box1.isDeleted !== true &&
        box2.isDeleted !== true &&
        distance < 500 &&
        distance > box1.circleRadius + box2.circleRadius
      ) {
        const force = (
          (G * (box1.mass * box2.mass)) /
          // TODO union
          (Math.pow(distance, 2) + box1.mass * box2.mass)
        ).toFixed(5);
        // const force = (Math.pow(500 - distance, 2) / 2000000000).toFixed(5);
        const forceTo1 = Vector.mult(Vector.normalise(pointTo2), force);

        const forceTo2 = Vector.mult(forceTo1, -1);

        // apply force to both
        Body.applyForce(box1, box1.position, forceTo1);
        Body.applyForce(box2, box2.position, forceTo2);

        // ctx.moveTo(box1.position.x, box1.position.y);
        // ctx.lineTo(box2.position.x, box2.position.y);
        // ctx.stroke();
      }

      if (distance <= box1.circleRadius + box2.circleRadius) {
        newBoxes[i].isDeleted = true;
        newBoxes[j].isDeleted = true;
        // newBoxes.push(
        //   Bodies.circle(
        //     (box1.position.x + box2.position.x) / 2,
        //     (box1.position.y + box2.position.y) / 2,
        //     Math.sqrt(
        //       box1.circleRadius * box1.circleRadius +
        //         box2.circleRadius * box2.circleRadius
        //     )
        //   )
        // );
      }
    }
  }

  // boxes = newBoxes.filter((x) => x.isDeleted !== true);
  // console.log(boxes);

  requestAnimationFrame(animate);
}

function App() {
  return (
    <div style={{ position: 'absolute' }}>
      {/* <button onClick={() => {}}>add force</button> */}
    </div>
  );
}

export default App;
