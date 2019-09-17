import { HasSchedulePipe } from './has-schedule.pipe';

describe('HasSchedulePipe', () => {
  it('create an instance', () => {
    const pipe = new HasSchedulePipe();
    expect(pipe).toBeTruthy();
  });
});
