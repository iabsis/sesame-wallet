export const fakeResponse = (data: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ data });
    }, 800);
  });
};
