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

const drawLine = (position1, position2, width) => {
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

for (let i = 0; i < 20; i++) {
  const radius = Math.floor(Math.random() * 30 + 5);
  var body = Bodies.circle(
    Math.random() * 1000 + 100,
    Math.random() * 500 + 200,
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

animate();

function animate() {
  const bodies = Composite.allBodies(engine.world);

  const newBodies = [];

  for (let i = 0; i < bodies.length - 1; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      if (
        i === j ||
        bodies[i].isDeleted === true ||
        bodies[j].isDeleted === true
      )
        continue;
      // calculate distance
      const body1 = bodies[i];
      const body2 = bodies[j];
      const pointTo2 = Vector.add(body2.position, Vector.neg(body1.position));
      const distance = Vector.magnitude(pointTo2);

      // calculate force
      if (
        body1.isDeleted !== true &&
        body2.isDeleted !== true &&
        // distance < 500 &&
        distance > body1.circleRadius + body2.circleRadius
      ) {
        const force = (
          (G * (body1.mass * body2.mass)) /
          // TODO union
          (Math.pow(distance, 2) + body1.mass * body2.mass)
        ).toFixed(5);

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
          // (body1.position.x + body2.position.x) / 2,
          // (body1.position.y + body2.position.y) / 2,
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
    <div style={{ position: 'absolute' }}>
      <button
        onClick={() => {
          const circle = Bodies.circle(
            Math.random() * 500 + 100,
            Math.random() * 500 + 200,
            30,
            noFriction
          );
          circle.mass = 50;
          Composite.add(engine.world, circle);
        }}
      >
        add circle
      </button>
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
