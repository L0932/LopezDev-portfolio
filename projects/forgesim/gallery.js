document.querySelectorAll("[data-gallery]").forEach((gallery) => {
  const thumbnails = [...gallery.querySelectorAll(".gallery-thumbnail")];
  const image = gallery.querySelector(".gallery-image");
  const imageLink = gallery.querySelector(".gallery-full-image");
  const fullSizeLink = gallery.querySelector(".gallery-full-link");
  const title = gallery.querySelector(".gallery-image-title");
  const description = gallery.querySelector(".gallery-description");
  const counter = gallery.querySelector(".gallery-counter");

  let selectedIndex = 0;

  function selectImage(index) {
    selectedIndex = (index + thumbnails.length) % thumbnails.length;

    const selected = thumbnails[selectedIndex];
    const source = selected.getAttribute("href");

    image.src = source;
    image.alt = selected.dataset.alt;
    imageLink.href = source;
    imageLink.setAttribute(
      "aria-label",
      `Open ${selected.dataset.title} screenshot at full resolution`
    );
    fullSizeLink.href = source;

    title.textContent = selected.dataset.title;
    description.textContent = selected.dataset.description;
    counter.textContent = `${selectedIndex + 1} / ${thumbnails.length}`;

    thumbnails.forEach((thumbnail, thumbnailIndex) => {
      const active = thumbnailIndex === selectedIndex;

      thumbnail.classList.toggle("is-active", active);
      thumbnail.setAttribute("aria-pressed", String(active));
    });
  }

  thumbnails.forEach((thumbnail, index) => {
    // With JavaScript enabled, thumbnails act as image-selection buttons.
    thumbnail.setAttribute("role", "button");
    thumbnail.setAttribute("aria-pressed", String(index === 0));

    thumbnail.addEventListener("click", (event) => {
      // Preserve opening the original image with modifier keys.
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
        return;
      }

      event.preventDefault();
      selectImage(index);
    });

    thumbnail.addEventListener("keydown", (event) => {
      if (event.key === " ") {
        event.preventDefault();
        selectImage(index);
      }
    });
  });

  gallery.querySelector("[data-gallery-previous]")
    .addEventListener("click", () => selectImage(selectedIndex - 1));

  gallery.querySelector("[data-gallery-next]")
    .addEventListener("click", () => selectImage(selectedIndex + 1));

  gallery.querySelector(".gallery-controls").hidden = false;
});