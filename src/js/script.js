import { API } from "/node_modules/oba-wrapper/js/index.js";

(async () => {
  localStorage.clear();

  const api = new API({
    key: "1e19898c87464e239192c8bfe422f280"
  });

  const request = await api.createIterator(
    "search/briefkaart&facet=type(postcard)"
  );
  for await (const response of request) {
    const results = response.map(result => object(result));
    console.log(results);
    renderData(results);
  }
})();

const object = data => {
  const createObject = {
    title: data.title.full,
    publication: data.publication.year,
    image: data.images[0]
  };
  return createObject;
};

const renderData = data => {
  const main = document.querySelector("main");
  const postcard = document.createElement("div");
  postcard.innerHTML = `${data[0].title}`;
  main.appendChild(postcard);
};
