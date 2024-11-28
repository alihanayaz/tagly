document.addEventListener("DOMContentLoaded", function () {
  const contentDiv = document.getElementById("dynamic-content");
  const bookmarksButton = document.getElementById("get-bookmarks");
  const collectionButtons = document.querySelectorAll("[data-collection-id]");
  const bookmarkForm = document.getElementById("create-bookmark-form");
  const editModal = document.getElementById("edit-modal");
  const editBookmarkForm = document.getElementById("edit-bookmark-form");
  const favoritesButton = document.getElementById("get-favorites");
  const collectionForm = document.getElementById("create-collection-form");
  let currentView;
  let currentPage = 1;

  async function makeRequest(url, method, body) {
    try {
      const options = {
        method,
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": document.querySelector(
            "#create-bookmark input[name='csrfmiddlewaretoken']"
          ).value,
        },
      };

      if (method === "POST") {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(url, options);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error making request:", error);
    }
  }

  const closeModal = () => {
    editModal.classList.add("hidden");
  };
  document.getElementById("close-modal").addEventListener("click", closeModal);

  function createBookmarkCard(bookmark) {
    const bookmarkElement = document.createElement("div");
    bookmarkElement.className = "item";
    bookmarkElement.dataset.bookmarkId = bookmark.id;
    bookmarkElement.innerHTML = `
    <span class="item-title">${bookmark.title}</span>
    <div class="item-link">
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 17H7A5 5 0 0 1 7 7h2"></path><path d="M15 7h2a5 5 0 1 1 0 10h-2"></path><line x1="8" x2="16" y1="12" y2="12"></line></svg>
    <a href="${bookmark.url}" target="_blank" rel="noopener noreferrer"
    >${bookmark.url}</a>
    </div>
    ${
      bookmark.collection__name
        ? `<p class="item-collection">${bookmark.collection__name}</p>`
        : ""
    }
    <button class="edit-button hidden">Edit</button>
    <div class="item-actions">
      <button id="favorite-label" class="btn btn-primary">
      ${bookmark.is_favorite ? "Unfavorite" : "Favorite"}
      </button>
      <button id="delete-label" class="btn btn-danger">Delete</button>
    </div>
    `;

    const editButton = bookmarkElement.querySelector(".edit-button");
    editButton.addEventListener("click", () => openEditModal(bookmark));

    const favoriteButton = bookmarkElement.querySelector("#favorite-label");
    favoriteButton.addEventListener("click", () => toggleFavorite(bookmark.id));

    const deleteButton = bookmarkElement.querySelector("#delete-label");
    deleteButton.addEventListener("click", () => deleteBookmark(bookmark.id));

    bookmarkElement.addEventListener("mouseover", () =>
      editButton.classList.remove("hidden")
    );
    bookmarkElement.addEventListener("mouseout", () =>
      editButton.classList.add("hidden")
    );

    contentDiv.appendChild(bookmarkElement);
  }

  async function getAllCollections() {
    const response = await makeRequest("/collections/", "GET");
    const collectionsList = document.getElementById("collections-list");
    collectionsList.innerHTML = "";
    response.collections.forEach((collection) => {
      const collectionElement = document.createElement("div");
      collectionElement.innerHTML = `
      <span data-collection-id="${collection.id}" class="tab transition">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>
      <span>${collection.name}</span>
      </span>
      `;
      collectionsList.appendChild(collectionElement);
    });
  }

  async function handleSelectCollections(selectElement) {
    const response = await makeRequest("/collections/", "GET");
    selectElement.innerHTML = `<option value="">Select Collection</option>`;
    response.collections.forEach((collection) => {
      const option = document.createElement("option");
      option.value = collection.id;
      option.textContent = collection.name;
      selectElement.appendChild(option);
    });
  }

  function openEditModal(bookmark) {
    const bookmarkIdInput = document.getElementById("bookmark-id");
    const bookmarkTitleInput = document.getElementById("bookmark-title");
    const bookmarkUrlInput = document.getElementById("bookmark-url");
    const collectionSelect = document.getElementById("bookmark-collection");

    bookmarkIdInput.value = bookmark.id;
    bookmarkTitleInput.value = bookmark.title;
    bookmarkUrlInput.value = bookmark.url;
    handleSelectCollections(collectionSelect);

    editModal.classList.remove("hidden");
  }

  editBookmarkForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const id = document.getElementById("bookmark-id").value;
    const title = document.getElementById("bookmark-title").value;
    const url = document.getElementById("bookmark-url").value;
    const collection = document.getElementById("bookmark-collection").value;

    const data = await makeRequest(`/bookmarks/${id}/edit/`, "POST", {
      title,
      url,
      collection,
    });

    if (data.success) {
      closeModal();
      if (!isNaN(currentView)) {
        getBookmarksByCollection(currentView, currentPage);
      } else if (currentView === "favorites") {
        getAllFavorites(currentPage);
      } else {
        getAllBookmarks(currentPage);
      }
    }
  });

  async function getBookmarksByCollection(collectionId, page = 1) {
    currentView = Number(collectionId);
    bookmarkForm.classList.add("hidden");
    const response = await fetch(
      `/collections/${collectionId}/bookmarks/?page=${page}`
    );
    const data = await response.json();

    const deleteCollectionButton = document.createElement("button");
    deleteCollectionButton.textContent = "Delete Collection";
    deleteCollectionButton.classList.add("btn", "btn-danger");
    deleteCollectionButton.onclick = async () => {
      const data = await makeRequest(
        `/collections/${collectionId}/delete/`,
        "POST"
      );
      if (data.success) {
        getAllBookmarks(currentPage);
        getAllCollections();
      }
    };

    if (!data.bookmarks || !data.bookmarks.length) {
      contentDiv.innerHTML = `<p>No bookmarks in this collection.</p>`;
      contentDiv.appendChild(deleteCollectionButton);
      return;
    } else {
      contentDiv.innerHTML = `<h2>Bookmarks in Collection ${data.collection} (Page ${data.current_page} of ${data.total_pages})</h2>
      `;
      contentDiv.appendChild(deleteCollectionButton);
      data.bookmarks.forEach((bookmark) => createBookmarkCard(bookmark));
      renderPaginationControls(data, (page) =>
        getBookmarksByCollection(collectionId, page)
      );
    }
  }

  async function getAllBookmarks(page = 1) {
    currentView = "all";
    bookmarkForm.classList.remove("hidden");
    const response = await fetch(`/bookmarks/?page=${page}`);
    const data = await response.json();

    if (!data.bookmarks || !data.bookmarks.length) {
      contentDiv.innerHTML = `<p>No bookmarks found.</p>`;
      return;
    } else {
      contentDiv.innerHTML = `<h2>All Bookmarks (Page ${data.current_page} of ${data.total_pages})</h2>`;
      data.bookmarks.forEach((bookmark) => createBookmarkCard(bookmark));
      renderPaginationControls(data, getAllBookmarks);
    }
  }

  async function getAllFavorites(page = 1) {
    currentView = "favorites";
    bookmarkForm.classList.add("hidden");
    const response = await fetch(`/favorites/?page=${page}`);
    const data = await response.json();

    if (!data.bookmarks || !data.bookmarks.length) {
      contentDiv.innerHTML = `<p>No bookmarks found.</p>`;
      return;
    } else {
      contentDiv.innerHTML = `<h2>All Favorites (Page ${data.current_page} of ${data.total_pages})</h2>`;
      data.bookmarks.forEach((bookmark) => createBookmarkCard(bookmark));
      renderPaginationControls(data, getAllFavorites);
    }
  }

  async function toggleFavorite(bookmarkId) {
    const data = await makeRequest(
      `/bookmarks/${bookmarkId}/toggle-favorite/`,
      "POST"
    );
    if (data.success) {
      const favoriteLabel = document.querySelector(
        `[data-bookmark-id="${bookmarkId}"] #favorite-label`
      );
      favoriteLabel.textContent = data.is_favorite ? "Unfavorite" : "Favorite";
      if (currentView === "favorites" && data.is_favorite === false) {
        const bookmarkElement = document.querySelector(
          `[data-bookmark-id="${bookmarkId}"]`
        );
        bookmarkElement.remove();
      }
    }
  }

  async function deleteBookmark(bookmarkId) {
    const data = await makeRequest(`/bookmarks/${bookmarkId}/delete/`, "POST");
    if (data.success) {
      const bookmarkElement = document.querySelector(
        `[data-bookmark-id="${bookmarkId}"]`
      );
      bookmarkElement.remove();
    }
  }

  function renderPaginationControls(data, getFunction) {
    const paginationDiv = document.createElement("div");
    paginationDiv.classList.add("pagination");

    if (data.has_previous) {
      const prevButton = document.createElement("button");
      prevButton.textContent = "Previous";
      prevButton.classList.add("btn");
      prevButton.onclick = () => {
        currentPage = data.current_page - 1;
        getFunction(data.current_page - 1);
      };
      paginationDiv.appendChild(prevButton);
    }

    if (data.has_next) {
      const nextButton = document.createElement("button");
      nextButton.textContent = "Next";
      nextButton.classList.add("btn");
      nextButton.onclick = () => {
        currentPage = data.current_page + 1;
        getFunction(data.current_page + 1);
      };
      paginationDiv.appendChild(nextButton);
    }

    contentDiv.appendChild(paginationDiv);
  }

  bookmarkForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const title = document.getElementById("create-bookmark-title").value;
    const url = document.getElementById("create-bookmark-url").value;

    const data = await makeRequest("/bookmarks/create-bookmark/", "POST", {
      title,
      url,
    });

    document.getElementById("create-bookmark-title").value = "";
    document.getElementById("create-bookmark-url").value = "";

    if (data.success) {
      getAllBookmarks(currentPage);
    }
  });
  collectionForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const name = document.getElementById("create-collection-name").value;

    const data = await makeRequest("/collections/create-collection/", "POST", {
      name,
    });

    if (data.success) {
      getAllCollections();
      document.getElementById("create-collection-name").value = "";
    }
  });
  bookmarksButton.addEventListener("click", () => getAllBookmarks(1));
  favoritesButton.addEventListener("click", () => getAllFavorites(1));
  collectionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      getBookmarksByCollection(button.getAttribute("data-collection-id"), 1);
    });
  });
});
