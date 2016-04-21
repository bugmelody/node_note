var g = function* () {
  while (true) {
    console.log('===x');
    yield;
    console.log('===y');
  }
};

var i = g();
i.next();

try {
  i.throw('a');
  i.throw('b');
} catch (e) {
  console.log('外部捕获', e);
}

i.next(); // 这里实际上并不会进行推进, 不会有输出
try {
  i.throw('c');
  i.throw('d');
} catch (e) {
  console.log('外部捕获', e);
}

i.next(); // 这里实际上并不会进行推进, 不会有输出
i.next(); // 这里实际上并不会进行推进, 不会有输出