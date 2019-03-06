import { API } from "/node_modules/oba-wrapper/js/index.js";

const app = {
  call: (async () => {
    const api = new API({
      key: "1e19898c87464e239192c8bfe422f280"
    });

    const request = await api.createIterator(
      "search/water&facet=type(postcard)"
    );
    for await (const response of request) {
      const results = response.map(result => createObject(result));
      console.table(results);
      render.overview(results);
    }
  })()
};

const createObject = data => {
  const object = {
    title: data.titles.title._text
      ? data.titles.title._text
      : data.titles.title[1]._text,
    subject: !data.subjects
      ? "Plaats onbekend"
      : data.subjects.subject._text
      ? data.subjects.subject._text
      : data.subjects.subject[1]._text,
    publication: data.publication
      ? data.publication.year._text
      : "Jaar onbekend",
    image: data.coverimages.coverimage._text
  };

  return object;
};

const render = {
  overview: data => {
    const main = document.querySelector(".container");
    data.map((postcard, index) => {
      const postcardContainer = document.createElement("div");
      postcardContainer.setAttribute("class", "postcard-item");

      const postcardTemplate = `
				<span class="postcard-publication">${postcard.publication}</span>
				<h3 class="postcard-subject">${postcard.subject}</h3>
				<a class="postcard-link" href="#${index}">Test</a>
				`;
      postcardContainer.style.background = `
				linear-gradient(
		      rgba(0, 0, 0, .25),
		      rgba(0, 0, 0, .25)
		    ), url(${postcard.image})
				`;
      postcardContainer.innerHTML = postcardTemplate;
      main.appendChild(postcardContainer);
    });
  },
  detail: data => {
    console.log(data);
  }
};

const router = {
  init: () => {
    routie({
      home: () => {
        app.call();
      },
      detail: detail => {
        console.log(detail);
      }
    });
  }
};

router.init();
