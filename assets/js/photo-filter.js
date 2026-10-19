document.addEventListener("DOMContentLoaded", () => {

  const pageAlbumGrid = document.getElementById("pageAlbumGrid");
  const albumCards = document.querySelectorAll(".album-card");
  const albumList = document.querySelector(".row-gallery");
  const backBtn = document.getElementById("backToAlbums");

  const imageModalEl = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  const prevBtn = imageModalEl.querySelector(".prev");
  const nextBtn = imageModalEl.querySelector(".next");

  const imageModal = new bootstrap.Modal(imageModalEl);

  let currentImages = [];
  let currentIndex = 0;
  let currentFolder = "";

  function loadAlbum(album) {

    currentFolder = "photogallery/" + album;

    fetch(currentFolder + "/images.json")
      .then(res => res.json())
      .then(list => {

        currentImages = list;
        pageAlbumGrid.innerHTML = "";

        list.forEach((item, index) => {

          const file =
            typeof item === "string" ? item : item.file;

          const caption =
            typeof item === "object" ? item.caption : "";

          const wrapper = document.createElement("div");
          wrapper.className = "text-center";

          const img = document.createElement("img");
          img.src = currentFolder + "/" + file;
          img.className = "img-fluid rounded shadow-sm";
          img.loading = "lazy";
          img.style.cursor = "pointer";

          img.addEventListener("click", () => {

            currentIndex = index;
            showModalImage();
            imageModal.show();

          });

          wrapper.appendChild(img);

          if (caption) {
            const cap = document.createElement("div");
            cap.className = "small mt-1";
            cap.textContent = caption;
            wrapper.appendChild(cap);
          }

          pageAlbumGrid.appendChild(wrapper);

        });

        albumList.style.display = "none";
        backBtn.style.display = "inline-block";

        pageAlbumGrid.scrollIntoView({
          behavior: "smooth"
        });

      })
      .catch(err => {
        console.error("Album JSON missing:", album);
      });

  }

  albumCards.forEach(card => {

    card.addEventListener("click", e => {

      e.preventDefault();

      const album = card.dataset.album;

      loadAlbum(album);

    });

  });

  backBtn.addEventListener("click", () => {

    pageAlbumGrid.innerHTML = "";

    albumList.style.display = "flex";

    backBtn.style.display = "none";

    window.scrollTo({
      top: albumList.offsetTop,
      behavior: "smooth"
    });

  });


  function showModalImage() {

    const item = currentImages[currentIndex];

    const file =
      typeof item === "string" ? item : item.file;

    modalImg.src = currentFolder + "/" + file;

  }

  nextBtn.addEventListener("click", () => {

    currentIndex =
      (currentIndex + 1) % currentImages.length;

    showModalImage();

  });

  prevBtn.addEventListener("click", () => {

    currentIndex =
      (currentIndex - 1 + currentImages.length) %
      currentImages.length;

    showModalImage();

  });

  document.addEventListener("keydown", e => {

    if (!imageModalEl.classList.contains("show")) return;

    if (e.key === "ArrowRight") nextBtn.click();
    if (e.key === "ArrowLeft") prevBtn.click();

  });

});