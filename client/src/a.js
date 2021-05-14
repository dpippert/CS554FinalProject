const x = [1, 2, 3];

function foo(a) {
  return a === 1 ? a : false;
}

console.log(x.some(foo));