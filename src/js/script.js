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
  const main = document.querySelector(".container");
  data.map(postcard => {
    console.log(postcard.title);
    // console.table(data);
    const postcardContainer = document.createElement("div");
    postcardContainer.setAttribute("class", "postcard-item");

    const postcardTemplate = `
		<h1 class="postcard-title">${postcard.title}</h1>
		<span class="postcard-publication">${postcard.publication}</span>
		<h3 class="postcard-subject">${postcard.subject}</h3>
		`;
    postcardContainer.style.backgroundImage = `url(${postcard.image})`;
    console.log(postcard.image);
    postcardContainer.innerHTML = postcardTemplate;
    main.appendChild(postcardContainer);
  });
};
