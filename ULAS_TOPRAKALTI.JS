(async () => {
    const init = async () => {
      await buildJQuery();
      buildCSS();
      await buildHTML();
      setEvents();
    };
  
    const buildJQuery = () => {
      return new Promise((resolve) => {
        if (window.jQuery) {
          resolve();
          return;
        }
  
        let script = document.createElement("script");
        script.src = "https://code.jquery.com/jquery-3.6.0.min.js";
        script.onload = resolve;
        document.head.appendChild(script);
      });
    };
  
    const buildHTML = async () => {
      const data = await fetchData();
  
      const html = `
                <div class="container">
                    <h1>You Might Also Like</h1>
                      <button class="carousel-button carousel-button-left">
                          <p><</p>
                      </button>
                    <div class="carousel-container"> 
                    <div class="product-detail"></div>
                      </div>
                      <button class="carousel-button carousel-button-right">
                          <p>></p>
                      </button>
                    </div>
                </div>
            `;
  
      $("body").append(html);
  
      const products = `
            ${data
              .map(
                (product) =>
                  `
            <div class="product" id="product-${product.id}">
            <div class="product-image-wrapper">
              <a href=${product.url}><img class="product-img" src="${product.img}"></a>
              <div class="product-like-button">
  <svg xmlns="http://www.w3.org/2000/svg" width="20.576" height="19.483" viewBox="0 0 20.576 19.483"><path fill="none" stroke="#555" stroke-width="1.5px" d="M19.032 7.111c-.278-3.063-2.446-5.285-5.159-5.285a5.128 5.128 0 0 0-4.394 2.532 4.942 4.942 0 0 0-4.288-2.532C2.478 1.826.31 4.048.032 7.111a5.449 5.449 0 0 0 .162 2.008 8.614 8.614 0 0 0 2.639 4.4l6.642 6.031 6.755-6.027a8.615 8.615 0 0 0 2.639-4.4 5.461 5.461 0 0 0 .163-2.012z" transform="translate(.756 -1.076)"></path></svg>            </div>
            </div>
            <div class="product-body">
                <p class="product-texts">${product.name}</p>
                <p class="product-price">${product.price} TRY</p>
            </div>
            </div>
                `
              )
              .join("")}
            `;
  
      $(".product-detail").append(products);
    };
  
    const buildCSS = () => {
      const css = `
  body {
      background-color: rgb(243, 243, 230);
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
  }
  
  
  .container {
      max-width: 90%;
      padding: 20px;
      margin: 0 auto;
  }
  
  .container h1 {
      font-weight : 100px;
  }
  
  .product-detail {
      display: flex;
      flex-wrap: nowrap;
      gap: 20px;
      transition: transform 0.5s ease-in-out;
      align-items: stretch
  }
  
  
  .product {
      flex: 0 0 auto;
      align-items: center;
      width: 21rem;
      height: auto;
      justify-content: space-between;
      background-color: white;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .product-img {
      width: 100%;
  }
  
  .product-body {
      padding: 4px;
      text-align: left;
      flex-grow: 1;
      justify-content: space-between;
  }
  
  .product-text {
      min-height: 50px;
  }
  
  .product-price {
      color: cornflowerblue;
      font-weight:bold;
      min-height: 30px;
  }
  
  .product-image-wrapper {
      position: relative;
  }
  
  .product-like-button {
      position: absolute;
      top: 10px;
      right: 10px;
      background: white;
      padding: 7px;
      box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
      cursor: pointer;
  }
  
  .carousel-container {
      display: flex;
      flex-direction: row;
      position: relative;
      width: 100%;
      overflow: hidden;
  }
  
  .carousel-button {
      background-color: transparent;
      border: none;
      position: absolute;
      top: 50%;
      color: grey;
      padding: 10px 15px;
      cursor: pointer;
      font-size: 4rem;
      z-index: 10;
      transform: translateY(-50%);
  }
  
  .carousel-button-left {
      left: 10px;
  }
  
  .carousel-button-right {
      right: 10px;
  }
  
  
  @media (max-width: 1024px) {
      .container {
          max-width: 95%;
      }
      .product {
          width: 18rem;
          height: 34rem;
      }
  }
  
  @media (max-width: 768px) {
      .product-detail {
          flex-wrap: wrap;
          justify-content: center;
      }
      .product {
          width: 16rem;
          height: auto;
      }
      .carousel-button {
          font-size: 1.5rem;
      }
  }
  
  @media (max-width: 480px) {
      .product {
          width: 100%;
      }
      .carousel-button {
          font-size: 1rem;
      }
  }
        
        `;
      $("<style>").addClass("carousel-style").html(css).appendTo("head");
    };
  
    const setEvents = () => {
      const productDetailDOM = document.querySelector(".product-detail");
      const productDOM = document.querySelector(".product");
      const carouselContainer = document.querySelector(".carousel-container");
  
      let productDOMWidth = productDOM.getBoundingClientRect().width +20;
      let visibleProductCount = Math.floor(
        carouselContainer.offsetWidth / productDOMWidth
      );
      let allProductCount = document.querySelectorAll(".product").length;
      let maxScrollCount = Math.max(0, allProductCount - visibleProductCount);
  
      let currentPosition = 0;
      let scrollCount = 0;
  
      const updateDimensions = () => {
        productDOMWidth = productDOM.getBoundingClientRect().width +20;
        visibleProductCount = Math.floor(
          carouselContainer.offsetWidth / productDOMWidth
        );
        allProductCount = document.querySelectorAll(".product").length;
        maxScrollCount = Math.max(0, allProductCount - visibleProductCount);
        currentPosition = -scrollCount * productDOMWidth;
        productDetailDOM.style.transform = `translateX(${currentPosition}px)`;
      };
  
      window.addEventListener("resize", updateDimensions);
  
      document
        .querySelector(".carousel-button-right")
        .addEventListener("click", () => {
          if (scrollCount < maxScrollCount) {
            scrollCount++;
            currentPosition = -scrollCount * productDOMWidth;
            productDetailDOM.style.transform = `translateX(${currentPosition}px)`;
          }
        });
  
      document
        .querySelector(".carousel-button-left")
        .addEventListener("click", () => {
          if (scrollCount > 0) {
            scrollCount--;
            currentPosition = -scrollCount * productDOMWidth;
            productDetailDOM.style.transform = `translateX(${currentPosition}px)`;
          }
        });
  
      document.addEventListener("click", (event) => {
        if (event.target.closest(".product-like-button")) {
          const button = event.target.closest(".product-like-button");
          const product = button.closest(".product");
          const productId = product ? product.getAttribute("id") : null;
  
          if (!productId) return;
  
          let likedList = JSON.parse(localStorage.getItem("likedList")) || [];
  
          button.classList.toggle("liked");
          const path = button.querySelector("path");
  
          if (button.classList.contains("liked")) {
            path.style.fill = "blue";
            path.style.stroke = "blue";
            if (!likedList.includes(productId)) {
              likedList.push(productId);
            }
          } else {
            path.style.fill = "none";
            path.style.stroke = "#555";
            likedList = likedList.filter((id) => id !== productId);
          }
  
          localStorage.setItem("likedList", JSON.stringify(likedList));
        }
      });
  
      let likedList = JSON.parse(localStorage.getItem("likedList")) || [];
      document.querySelectorAll(".product").forEach((product) => {
        const productId = product.getAttribute("id");
        if (likedList.includes(productId)) {
          const button = product.querySelector(".product-like-button");
          if (button) {
            button.classList.add("liked");
            const path = button.querySelector("path");
            if (path) {
              path.style.fill = "blue";
              path.style.stroke = "blue";
            }
          }
        }
      });
    };
  
    const fetchData = async () => {
      const cacheKey = "cachedProducts";
  
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
  
      try {
        const response = await fetch(
          "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json"
        );
        const data = await response.json();
  
        localStorage.setItem(cacheKey, JSON.stringify(data));
        return data;
      } catch (error) {
        throw error;
      }
    };
  
    init();
  })();
  