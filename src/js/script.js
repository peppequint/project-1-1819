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
    // console.log(response);
    const results = response.map(result => createObject(result));
    console.log(results);
    renderData(results);
  }
})();

const createObject = data => {
  const object = {
    title: data.titles.title._text,
    subject: data.subjects.subject._text,
    publication: data.publication
      ? data.publication.year._text
      : "Jaar niet bekend",
    image: data.coverimages.coverimage._text
  };
  return object;
};

const renderData = data => {
  console.log(data);
  data.map(element => {
    const main = document.querySelector(".container");
    const postcard = document.createElement("img");
    postcard.src = `${element.image}`;
    postcard.setAttribute("class", "postcard");
    main.appendChild(postcard);
  });
};
