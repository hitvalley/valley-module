let queue = [];

queue.push(async next => {
  let res1 = await next();
  console.log(res1);
  let res2 = await next();
  console.log(res2);
});

queue.push(async () => {
  return Promise.resolve(Math.random());
})

function runItem(index) {
  let fun = queue[index];
  if (!fun) {
    return;
  }
  return fun(runItem(index + 1));
}
