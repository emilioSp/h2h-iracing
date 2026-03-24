import { EventSource } from 'eventsource';

const es = new EventSource('http://localhost:3000/sse');

es.onopen = () => {
  console.log('Connected to http://localhost:3000/sse');
};

es.onmessage = (event) => {
  const { data } = JSON.parse(event.data);
  console.clear();
  console.log(`Session time : ${data.sessionTime.toFixed(1)}s`);
  console.log(
    `Player       : P${data.player.position} ${data.player.driver.name}`,
  );
  console.log(`Gap ahead    : ${data.gapAhead.toFixed(3)}s`);
  console.log(`Gap behind   : ${data.gapBehind.toFixed(3)}s`);
  console.log(`Delta ahead  : ${data.deltaAhead.toFixed(3)}s`);
  console.log(`Delta behind : ${data.deltaBehind.toFixed(3)}s`);
};

es.onerror = () => {
  console.error('Connection error — server might be down');
  es.close();
};
