document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("tagInput");
  const addBtn = document.getElementById("addBtn");
  const tagBox = document.getElementById("tagBox");
  const suggestionsBox = document.getElementById("suggestions");

  // Predefined recommendations
  const recommendations = [
    "HTML", "CSS", "JavaScript", "Node.js", "React", 
    "Vue", "Angular", "Python", "Java", "C++",
    "Git", "TailwindCSS", "Bootstrap", "Express", "MongoDB"
  ];

  // Create a new tag element
  function createTag(text) {
    const tag = document.createElement("div");
    tag.classList.add("tag");
    tag.draggable = true;
    tag.innerHTML = `#${text} <span class="remove">X</span>`;
    tagBox.appendChild(tag);
  }

  // Add tag function
  function addTag() {
    const value = input.value.trim();
    if (value) {
      createTag(value);
      input.value = "";
      hideSuggestions();
    }
  }

  // Show filtered suggestions
  function showSuggestions() {
    const value = input.value.toLowerCase();
    suggestionsBox.innerHTML = "";
    if (!value) {
      hideSuggestions();
      return;
    }
    const filtered = recommendations.filter(tag =>
      tag.toLowerCase().includes(value)
    );
    if (filtered.length) {
      suggestionsBox.style.display = "block";
      filtered.forEach(tag => {
        const li = document.createElement("li");
        li.textContent = tag;
        li.addEventListener("click", () => {
          input.value = tag;
          addTag();
        });
        suggestionsBox.appendChild(li);
      });
    } else {
      hideSuggestions();
    }
  }

  function hideSuggestions() {
    suggestionsBox.style.display = "none";
  }

  // Events
  addBtn.addEventListener("click", addTag);
  input.addEventListener("input", showSuggestions);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  });

  // Remove tag
  tagBox.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove")) {
      e.target.parentElement.remove();
    }
  });

  // Drag and drop
  let draggedTag = null;
  tagBox.addEventListener("dragstart", (e) => {
    if (e.target.classList.contains("tag")) {
      draggedTag = e.target;
      e.target.classList.add("dragging");
    }
  });

  tagBox.addEventListener("dragend", (e) => {
    if (e.target.classList.contains("tag")) {
      e.target.classList.remove("dragging");
      draggedTag = null;
    }
  });

  tagBox.addEventListener("dragover", (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(tagBox, e.clientY);
    if (draggedTag) {
      if (!afterElement) {
        tagBox.appendChild(draggedTag);
      } else {
        tagBox.insertBefore(draggedTag, afterElement);
      }
    }
  });

  function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll(".tag:not(.dragging)")];
    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }
  addBtn.addEventListener("click", (e) => {
  e.preventDefault(); // stops refresh
  addTag();
});

});
