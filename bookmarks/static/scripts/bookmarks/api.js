const API = {
  async request(url, method = "GET", body = null) {
    const headers = {
      "Content-Type": "application/json",
      "X-CSRFToken": document.querySelector("[name='csrfmiddlewaretoken']")
        .value,
    };
    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
      return response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};

const BookmarkApp = {
  currentPage: 1,
  currentView: { type: "all", id: null },

  async loadBookmarks({
    collectionId = null,
    isFavorite = null,
    page = 1,
  } = {}) {
    this.currentPage = page;
    this.currentView = collectionId
      ? { type: "collection", id: collectionId }
      : isFavorite
      ? { type: "favorites", id: null }
      : { type: "all", id: null };

    const queryParams = new URLSearchParams({ page });
    if (collectionId) queryParams.append("collection_id", collectionId);
    if (isFavorite) queryParams.append("is_favorite", true);

    const data = await API.request(`/bookmarks/?${queryParams.toString()}`);
    this.renderBookmarks(data);
    this.toggleCreateBookmarkForm();
    this.toggleCollectionActions();
  },

  async loadCollections() {
    const data = await API.request("/collections/");
    if (data) this.renderCollections(data.collections);
  },

  renderBookmarks(data) {
    const contentDiv = document.getElementById("dynamic-content");
    contentDiv.innerHTML = "";

    if (!data || !data.bookmarks.length) {
      const noBookmarksMessage = document.createElement("p");
      noBookmarksMessage.textContent = "No bookmarks found.";
      contentDiv.appendChild(noBookmarksMessage);
      return;
    }

    data.bookmarks.forEach((bookmark) => {
      const bookmarkElement = this.createBookmarkCard(bookmark);
      contentDiv.appendChild(bookmarkElement);
    });

    this.renderPaginationControls(data);
  },

  renderCollections(collections) {
    const collectionsList = document.getElementById("collections-list");
    collectionsList.innerHTML = "";
    collections.forEach((collection) => {
      const collectionElement = document.createElement("div");
      collectionElement.innerHTML = `
        <span data-collection-id="${collection.id}" class="tab transition">
          <span>${collection.name}</span>
        </span>
      `;
      collectionsList.appendChild(collectionElement);

      collectionElement
        .querySelector("[data-collection-id]")
        .addEventListener("click", () =>
          this.loadBookmarks({ collectionId: collection.id })
        );
    });
  },

  createBookmarkCard(bookmark) {
    const card = document.createElement("div");
    card.className = "item";
    card.innerHTML = `
      <h3 class="item-title">${bookmark.title}</h3>
      <div class="item-link">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 17H7A5 5 0 0 1 7 7h2"></path><path d="M15 7h2a5 5 0 1 1 0 10h-2"></path><line x1="8" x2="16" y1="12" y2="12"></line></svg>
      <a href="${bookmark.url}" target="_blank" rel="noopener noreferrer"
      >${bookmark.url}</a>
      </div>
      <p class="item-collection">${
        bookmark.collection__name || "Uncategorized"
      }</p>
      <button class="btn-edit hidden">Edit</button>
      <div class="item-actions">
        <button id="btn-favorite" class="btn btn-primary">
        ${bookmark.is_favorite ? "Unfavorite" : "Favorite"}
        </button>
        <button id="btn-delete" class="btn btn-danger">Delete</button>
      </div>
    `;

    card
      .querySelector("#btn-favorite")
      .addEventListener("click", () => this.toggleFavorite(bookmark.id));
    card
      .querySelector(".btn-edit")
      .addEventListener("click", () => this.openEditModal(bookmark));
    card
      .querySelector("#btn-delete")
      .addEventListener("click", () => this.deleteBookmark(bookmark.id));

    return card;
  },

  openEditModal(bookmark) {
    const modal = document.getElementById("edit-bookmark-modal");
    document.getElementById("bookmark-id").value = bookmark.id;
    document.getElementById("bookmark-title").value = bookmark.title;
    document.getElementById("bookmark-url").value = bookmark.url;
    this.populateCollectionSelect(
      bookmark.collection__id,
      bookmark.collection__name
    );
    modal.classList.remove("hidden");
  },

  async populateCollectionSelect(collectionId = null, collectionName = null) {
    const response = await API.request("/collections/");
    const select = document.getElementById("bookmark-collection");
    select.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select Collection";
    select.appendChild(defaultOption);

    response.collections.forEach((collection) => {
      const option = document.createElement("option");
      option.value = collection.id;
      option.textContent = collection.name;

      if (collection.id === collectionId) {
        option.selected = true;
      }

      select.appendChild(option);
    });

    if (!collectionId) {
      defaultOption.selected = true;
    }
  },

  toggleCreateBookmarkForm() {
    const form = document.getElementById("create-bookmark-form");
    form.style.display = this.currentView.type === "all" ? "block" : "none";
  },

  toggleCollectionActions() {
    const deleteButton = document.getElementById("delete-collection-btn");
    const editButton = document.getElementById("edit-collection-btn");
    const collectionActions = document.getElementById("collection-actions");

    collectionActions.style.display = "none";

    if (this.currentView.type === "collection") {
      collectionActions.style.display = "flex";
      deleteButton.onclick = () => this.deleteCollection(this.currentView.id);
      editButton.onclick = () => this.openEditCollectionModal();
    }
  },

  async deleteCollection(collectionId) {
    const data = await API.request(
      `/collections/${collectionId}/delete/`,
      "POST"
    );
    if (data) {
      this.loadCollections();
      this.loadBookmarks();
    }
  },

  openEditCollectionModal() {
    const modal = document.getElementById("edit-collection-modal");
    const collectionNameInput = document.getElementById("edit-collection-name");
    const currentCollection = this.currentView;

    collectionNameInput.value = document.querySelector(
      `[data-collection-id="${currentCollection.id}"] span`
    ).textContent;

    modal.classList.remove("hidden");

    document
      .getElementById("edit-collection-form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = collectionNameInput.value;
        const data = await API.request(
          `/collections/${currentCollection.id}/edit/`,
          "POST",
          { name }
        );
        if (data) {
          modal.classList.add("hidden");
          this.loadCollections();
          this.loadBookmarks({ collectionId: currentCollection.id });
        }
      });
  },

  async toggleFavorite(bookmarkId) {
    const data = await API.request(
      `/bookmarks/${bookmarkId}/toggle-favorite/`,
      "POST"
    );
    if (data) this.reloadCurrentView();
  },

  async deleteBookmark(bookmarkId) {
    const data = await API.request(`/bookmarks/${bookmarkId}/delete/`, "POST");
    if (data) this.reloadCurrentView();
  },

  reloadCurrentView() {
    if (this.currentView.type === "collection") {
      this.loadBookmarks({
        collectionId: this.currentView.id,
        page: this.currentPage,
      });
    } else if (this.currentView.type === "favorites") {
      this.loadBookmarks({ isFavorite: true, page: this.currentPage });
    } else {
      this.loadBookmarks({ page: this.currentPage });
    }
  },

  renderPaginationControls(data) {
    const paginationDiv = document.createElement("div");
    paginationDiv.className = "pagination";

    if (data.has_previous) {
      const prevButton = document.createElement("button");
      prevButton.textContent = "Previous";
      prevButton.addEventListener("click", () =>
        this.loadBookmarks({ page: this.currentPage - 1 })
      );
      paginationDiv.appendChild(prevButton);
    }

    if (data.has_next) {
      const nextButton = document.createElement("button");
      nextButton.textContent = "Next";
      nextButton.addEventListener("click", () =>
        this.loadBookmarks({ page: this.currentPage + 1 })
      );
      paginationDiv.appendChild(nextButton);
    }

    const contentDiv = document.getElementById("dynamic-content");
    contentDiv.appendChild(paginationDiv);
  },

  handleCreateBookmarkForm() {
    document
      .getElementById("create-bookmark")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const title = document.getElementById("create-bookmark-title").value;
        const url = document.getElementById("create-bookmark-url").value;
        const data = await API.request("/bookmarks/create-bookmark/", "POST", {
          title,
          url,
        });
        if (data) {
          e.target.reset();
          this.loadBookmarks();
        }
      });
  },

  handleEditBookmarkForm() {
    document
      .getElementById("edit-bookmark-form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = document.getElementById("bookmark-id").value;
        const title = document.getElementById("bookmark-title").value;
        const url = document.getElementById("bookmark-url").value;
        const collection = document.getElementById("bookmark-collection").value;
        const data = await API.request(`/bookmarks/${id}/edit/`, "POST", {
          title,
          url,
          collection,
        });
        if (data) {
          document
            .getElementById("edit-bookmark-modal")
            .classList.add("hidden");
          BookmarkApp.reloadCurrentView();
        }
      });
  },

  handleCreateCollectionForm() {
    document
      .getElementById("create-collection-form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("create-collection-name").value;
        const data = await API.request(
          "/collections/create-collection/",
          "POST",
          {
            name,
          }
        );
        if (data) {
          BookmarkApp.loadCollections();
          e.target.reset();
        }
      });
  },
};

document.addEventListener("DOMContentLoaded", () => {
  BookmarkApp.loadCollections();
  BookmarkApp.loadBookmarks();
  BookmarkApp.handleCreateBookmarkForm();
  BookmarkApp.handleEditBookmarkForm();
  BookmarkApp.handleCreateCollectionForm();

  document.getElementById("all-bookmarks").addEventListener("click", () => {
    BookmarkApp.loadBookmarks();
  });
  document.getElementById("favorites").addEventListener("click", () => {
    BookmarkApp.loadBookmarks({ isFavorite: true });
  });

  document
    .getElementById("close-bookmark-modal")
    .addEventListener("click", () => {
      document.getElementById("edit-bookmark-modal").classList.add("hidden");
    });
  document
    .getElementById("close-collection-modal")
    .addEventListener("click", () => {
      document.getElementById("edit-collection-modal").classList.add("hidden");
    });
});
