const test = require("ava");
const foo = require("../index");

test(`index#1`, (t) => {
  const r = foo();
  t.is(r, "bar");
});
