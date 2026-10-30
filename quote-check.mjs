import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const dialog = { setAttribute() {}, addEventListener() {} };
const context = {
  document: { createElement: () => dialog, body: { append() {} } },
  window: { addEventListener() {} },
  Intl,
};
vm.createContext(context);
vm.runInContext(fs.readFileSync(new URL('./dist/quote.js', import.meta.url), 'utf8'), context);
const calculate = context.window.ArtQuote.calculate;
const base = { brand: 'samsung', model: 'standard', units: '4', area: '30', pipe: 'multi', options: [], discount: 'none' };
assert.equal(calculate(base).total, 4450000, '삼성 4대 기본 견적');
assert.equal(calculate({ ...base, brand: 'lg' }).total, 4600000, 'LG 4대 기본 견적');
assert.equal(calculate({ ...base, brand: 'lg', model: 'premium', area: '40', pipe: 'single', options: ['protection', 'ceiling', 'pump', 'removal'], discount: 'interior' }).total, 6230000, '프리미엄·용량·배관·전체 옵션·할인 합산');
assert.equal(calculate({ ...base, options: ['protection', 'protection', 'unknown'] }).optionsTotal, 80000, '옵션 중복과 미등록 항목 무시');
assert.equal(calculate({ ...base, units: 0 }).total, 3150000, '최소 2대');
assert.equal(calculate({ ...base, units: 99 }).total, 5750000, '최대 6대');
assert.equal(calculate({ ...base, discount: 'schedule' }).total, 4350000, '일정 할인 10만원');
assert.equal(calculate({ ...base, discount: 'unknown' }).total, 4450000, '미등록 할인은 적용 안 함');
assert.equal(calculate({ ...base, brand: 'unknown', model: 'unknown' }).total, 4450000, '알 수 없는 브랜드·모델 기본값');
const before = JSON.stringify(base);
calculate(base);
assert.equal(JSON.stringify(base), before, '계산 중 입력값 변경 없음');
assert.equal(context.window.ArtQuote.options.length, 4, '추가금 안내용 옵션 4개 공개');
assert.ok(Object.isFrozen(context.window.ArtQuote.options), '옵션 배열 읽기 전용');
assert.ok(context.window.ArtQuote.options.every(Object.isFrozen), '각 옵션 읽기 전용');
assert.equal(context.window.ArtQuote.options.find(o => o.id === 'protection').price, 80000, '공개 가격과 계산 가격 동일');
console.log('PASS: 14 quote calculation and public options checks');
