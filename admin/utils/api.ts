export const fetchApi = (path: string): Promise<unknown> =>
  fetch(path).then((r) => r.json());
