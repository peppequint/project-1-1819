import { API } from "/node_modules/oba-wrapper/js/index.js";

(async () => {
  localStorage.clear();

  const api = new API({
    key: "1e19898c87464e239192c8bfe422f280"
  });

  const request = await api.createIterator(
    "search/gracht&facet=type(postcard)"
  );
  for await (const response of request) {
    const results = response.map(result => createObject(result));
    console.log(results);
    renderData(results);
  }
})();

const createObject = data => {
  const object = {
    title: data.title.full,
    publication: data.publication.year,
    image: data.images[0]
  };
  return object;
};

const renderData = data => {
  data.map(element => {
    const main = document.querySelector("main");
    const postcard = document.createElement("img");
    postcard.src = `${element.image}`;
    postcard.setAttribute("class", "postcard-image");
    main.appendChild(postcard);
  });
};
