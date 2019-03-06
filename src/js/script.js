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
      localStorage.setItem("results", JSON.stringify(results));
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
				<p class="postcard-title">${postcard.title}</p>
				<h3 class="postcard-subject">${postcard.subject}</h3>
				<a class="postcard-link" href="#${index}">Maak je briefkaart</a>
				`;
      postcardContainer.style.background = `
				linear-gradient(
		      rgba(0, 0, 0, .5),
		      rgba(0, 0, 0, .5)
		    ), url(${postcard.image}) center
				`;
      postcardContainer.innerHTML = postcardTemplate;
      main.appendChild(postcardContainer);
    });
  },
  detail: number => {
    const postcardDetail = JSON.parse(localStorage.getItem("results"));
    console.log(postcardDetail[number]);
  }
};

const router = {
  init: () => {
    routie({
      home: () => {
        app.call();
      }
    });
    routie(":number", number => {
      render.detail(number);
    });
  }
};

router.init();
