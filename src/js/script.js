import { API } from "./oba-wrapper/js/index.js";

const app = {
  call: async query => {
    handle.load();
    const api = new API({
      key: "1e19898c87464e239192c8bfe422f280"
    });

    const request = await api.createIterator(
      "search/" + query + "&facet=type(postcard)"
    );
    for await (const response of request) {
      console.table(response);
      const results = response.map(result => createObject(result));
      localStorage.setItem("results", JSON.stringify(results));
      console.table(results);
      render.overview(results);
      handle.search();
      document.querySelector("#A").classList.remove("animate");
    }
  }
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
    image: data.coverimages.coverimage._text,
    url: data.eresources.eresource._attributes.url
  };

  return object;
};

const render = {
  overview: data => {
    const main = document.querySelector(".container");
    main.innerHTML = "";
    data.map((postcard, index) => {
      const postcardContainer = document.createElement("div");
      postcardContainer.setAttribute("class", "postcard-item");

      const postcardTemplate = `
				<span class="postcard-item--publication">${postcard.publication}</span>
				<p class="postcard-item--title">${postcard.title}</p>
				<h3 class="postcard-item--subject">${postcard.subject}</h3>
				<a class="postcard-item--link" href="#${index}">Maak je briefkaart</a>
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
    const data = JSON.parse(localStorage.getItem("results"));
    console.log(data[number]);
    // document.querySelector(".container").innerHTML = "";
    const container = document.querySelector(".container");
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    const postcardDetail = document.createElement("div");
    postcardDetail.setAttribute("class", "postcard-detail");

    const postcardTemplateDetail = `
			<img class='postcard-detail--image' src='${data[number].image}'/>
			<h1 class='postcard-detail--title'>${data[number].title}</h1>
			<h3 class='postcard-detail--subject'>${data[number].subject}</h3>
			<span class='postcard-detail--year'>${data[number].publication}</span>
			${helper.form()}
		`;

    postcardDetail.innerHTML = postcardTemplateDetail;
    container.appendChild(postcardDetail);
  }
};

const helper = {
  form: () => {
    return `
			<form class="postcard-detail--form" action="">
				<input type="text" id="input-receiver" placeholder="Ontvanger" />
				<input type="text" id="input-street" placeholder="Straat" />
				<input type="text" id="input-city" placeholder="Woonplaats" />
				<input type="text" id="input-zipcode" placeholder="Postcode" />
				<textarea name="text" rows="8" cols="80" placeholder="Uw bericht"></textarea>
				<button class='postcard-detail--button'>Versturen</button>
				<button class='postcard-detail--button'>Print uit</button>
			</form>
		`;
  }
};

const handle = {
  search: () => {
    const searchButton = document.querySelector(".search-button");
    const searchLabel = document.querySelector(".search-label");
    const searchValue = document.querySelector(".search-bar");

    searchButton.addEventListener("click", query => {
      app.call(searchValue.value);
    });
  },
  load: () => {
    document.querySelector("#A").classList.add("animate");
    console.log("Loading results");
  },
  test: () => {
    console.log("Het werkt");
  }
};

const router = {
  init: () => {
    routie({
      "": () => {
        app.call("gracht");
      },
      ":number": number => {
        render.detail(number);
      }
    });
  }
};

router.init();
