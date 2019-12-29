import MemoService from "./Memo.service";

test("Simple Function", () => {
  const func = (x: number) => x;
  const memoFunc = MemoService(func);

  expect(memoFunc(3)).toEqual(func(3));
});

test("Simple Function Called Twice", () => {
  const func = (x: number) => x * x;
  const memoFunc = MemoService(func);

  expect(memoFunc(3)).toEqual(func(3));
  expect(memoFunc(3)).toEqual(func(3));
});
