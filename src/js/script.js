import { API } from "/node_modules/oba-wrapper/js/index.js";

(async () => {
  localStorage.clear();

  const api = new API({
    key: "1e19898c87464e239192c8bfe422f280"
  });

  const request = await api.createIterator("search/banaan");
  for await (const response of request) {
    console.log(response);
  }
})();
