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
    width: window.innerWidth - 100,
    height: window.innerHeight - 100,
  },
});

const canvas = document.getElementsByTagName('canvas')[0];

var ctx = canvas.getContext('2d');
ctx.beginPath();

let newCircleDirection = { fromX: 0, fromY: 0, toX: 0, toY: 0 };
let isMouseDown = false;
let dummyCircle = undefined;
canvas.addEventListener('mousedown', (e) => {
  isMouseDown = true;
  newCircleDirection.fromX = e.x;
  newCircleDirection.fromY = e.y;
  dummyCircle = addCircle(e.x, e.y, 30, 50);
});
canvas.addEventListener('mousemove', (e) => {
  if (isMouseDown && dummyCircle) {
    dummyCircle.position.x = e.x;
    dummyCircle.position.y = e.y;
  }
  newCircleDirection.toX = e.x;
  newCircleDirection.toY = e.y;
});
canvas.addEventListener('mouseup', (e) => {
  isMouseDown = false;
  Composite.remove(engine.world, dummyCircle);
  dummyCircle = undefined;
  addCircle(e.x, e.y, 30, 50, newCircleDirection);
  newCircleDirection = { fromX: 0, fromY: 0, toX: 0, toY: 0 };
});

const noFriction = {
  inertia: Infinity,
  restitution: 1,
  friction: 0,
  frictionAir: 0,
  frictionStatic: 0,
};

const drawLine = (position1, position2, width = 4) => {
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(99, 80, 177, 0.2)';
  ctx.lineWidth = width;
  ctx.moveTo(position1.x, position1.y);
  ctx.lineTo(position2.x, position2.y);
  ctx.stroke();
};

const calculateMassCenter = (body1, body2) => {
  let x =
    (body1.position.x * body1.mass + body2.position.x * body2.mass) /
    (body1.mass + body2.mass);
  let y =
    (body1.position.y * body1.mass + body2.position.y * body2.mass) /
    (body1.mass + body2.mass);

  return { x, y };
};

// create bodies
var bodies = [];

for (let i = 0; i < 0; i++) {
  const radius = Math.floor(Math.random() * 30 + 5);
  var body = Bodies.circle(
    Math.random() * 800 + 100,
    Math.random() * 400 + 200,
    radius,
    noFriction
  );
  body.mass = Math.pow(radius, 2);
  body.render.fillStyle = '#000000';
  Body.setVelocity(body, { x: Math.random() - 0.5, y: Math.random() - 0.5 });
  bodies.push(body);
}

// add all of the bodies to the world
Composite.add(engine.world, bodies);

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);

const G = 6.67 * Math.pow(10, -4);

let animationId = 0;

function addCircle(
  x,
  y,
  radius = 30,
  mass = 50,
  velocity = { fromX: 0, fromY: 0, toX: 0, toY: 0 }
) {
  const circle = Bodies.circle(x, y, radius, noFriction);
  circle.mass = mass;
  let velocityX = (velocity.toX - velocity.fromX) / 500;
  let velocityY = (velocity.toY - velocity.fromY) / 500;

  Composite.add(engine.world, circle);
  Body.setVelocity(circle, { x: velocityX, y: velocityY });
  return circle;
}

animate();

function animate() {
  const bodies = Composite.allBodies(engine.world);

  const newBodies = [];

  for (let i = 0; i < bodies.length - 1; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const body1 = bodies[i];
      const body2 = bodies[j];

      if (body1.position.x > render.options.width) {
        body1.isDeleted = true;
      }
      if (body1.position.y > render.options.height) {
        body1.isDeleted = true;
      }
      if (body2.position.x > render.options.width) {
        body2.isDeleted = true;
      }
      if (body2.position.y > render.options.height) {
        body2.isDeleted = true;
      }

      if (i === j || body1.isDeleted === true || body2.isDeleted === true)
        continue;
      // calculate distance

      const pointTo2 = Vector.add(body2.position, Vector.neg(body1.position));
      const distance = Vector.magnitude(pointTo2);

      // calculate force
      if (
        body1.isDeleted !== true &&
        body2.isDeleted !== true &&
        // distance < 500 &&
        distance > body1.circleRadius + body2.circleRadius
      ) {
        const forceMultiplier = 1.0;
        const force =
          (
            (G * (body1.mass * body2.mass)) /
            // TODO union
            (Math.pow(distance, 2) + body1.mass * body2.mass)
          ).toFixed(5) * forceMultiplier;

        const forceTo1 = Vector.mult(Vector.normalise(pointTo2), force);
        const forceTo2 = Vector.mult(forceTo1, -1);

        // apply force to both
        Body.applyForce(body1, body1.position, forceTo1);
        Body.applyForce(body2, body2.position, forceTo2);
        drawLine(
          body1.position,
          body2.position,
          Math.floor(Vector.magnitude(forceTo1) * 10000)
        );
      }

      if (distance <= body1.circleRadius + body2.circleRadius) {
        // delete bodies
        body1.isDeleted = true;
        body2.isDeleted = true;
        const newPosition = calculateMassCenter(body1, body2);
        const newBody = Bodies.circle(
          newPosition.x,
          newPosition.y,
          Math.floor(
            Math.sqrt(
              body1.circleRadius * body1.circleRadius +
                body2.circleRadius * body2.circleRadius
            )
          ),
          noFriction
        );

        Body.setVelocity(
          newBody,
          Vector.mult(
            Vector.add(
              Vector.mult(body1.velocity, body1.mass),
              Vector.mult(body2.velocity, body2.mass)
            ),
            1 / (body1.mass + body2.mass)
          )
        );
        newBody.mass = body1.mass + body2.mass;
        newBodies.push(newBody);
      }
    }
  }

  bodies.forEach((body) => {
    if (body.isDeleted === true) {
      Composite.remove(engine.world, body);
    }
  });

  Composite.add(engine.world, newBodies);

  animationId = requestAnimationFrame(animate);
}

function App() {
  return (
    <div style={{ position: 'absolute', left: '10px', top: '10px' }}>
      <button
        onClick={() => {
          Composite.remove(engine.world, Composite.allBodies(engine.world));
          cancelAnimationFrame(animationId);
        }}
      >
        cancel animation
      </button>
    </div>
  );
}

export default App;
