export default class SleepController {
  private shouldContinue: boolean;
  private terminate: () => void;

  constructor() {
    this.shouldContinue = true;
    this.terminate = () => {}
  }

  public sleep(ms: number): Promise<void> {
    this.shouldContinue = true
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        if (this.shouldContinue) {
          resolve();
        } else {
          reject('终止');
        }
      }, ms);
      // 如果需要提前终止，清除定时器并拒绝Promise
      this.terminate = () => {
        clearTimeout(timeoutId);
        reject('终止');
      };
    });
  }

  public terminateSleep(): void {
    this.shouldContinue = false;
    if (this.terminate) {
      this.terminate();
    }
  }
}