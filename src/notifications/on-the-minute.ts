/* eslint-disable no-undef */
export default (fn: () => any): (() => void) => {
  let timeout: NodeJS.Timeout;

  const helper = () => {
    const nextMinute = new Date();
    nextMinute.setSeconds(60, 0);
    const delay = nextMinute.getTime() - new Date().getTime();

    timeout = setTimeout(() => {
      fn();
      helper();
    }, delay);
  };

  helper();

  return () => {
    clearTimeout(timeout);
  };
};
