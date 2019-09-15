import { LessonNumberPipe } from './lesson-number.pipe';

describe('LessonNumberPipe', () => {
  it('create an instance', () => {
    const pipe = new LessonNumberPipe();
    expect(pipe).toBeTruthy();
  });
});
