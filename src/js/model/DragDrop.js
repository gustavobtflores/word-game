class DragDrop {
  constructor(container, onDropCallback) {
    this.container = container;
    this.onDropCallback = onDropCallback;
    // currentDroppable = null;
    this.attachEventListeners();
  }

  attachEventListeners() {
    this.container.addEventListener("mousedown", this.handleMouseDown.bind(this));
  }

  handleMouseDown(e) {
    let currentDroppable = null;
    const target = e.target.closest(".word-letter");

    if (!target) return;

    target.classList.add("dragging");
    const shiftX = e.clientX - target.getBoundingClientRect().left;
    const shiftY = e.clientY - target.getBoundingClientRect().top;

    function moveAt(clientX, clientY) {
      // As the parent of the placeholders is relative positioned,
      // we need to use its x and y coordinates to offset the dragged element
      // and avoid the element from beeing out of the mouse position
      const relativeParent = target.closest(".word-placeholders-wrapper");
      const relativeX = relativeParent?.getBoundingClientRect().x || 0;
      const relativeY = relativeParent?.getBoundingClientRect().y || 0;

      const positionX = clientX - shiftX - relativeX + "px";
      const positionY = clientY - shiftY - relativeY + "px";

      target.style.left = positionX;
      target.style.top = positionY;
    }

    moveAt(e.clientX, e.clientY);
    target.style.position = "absolute";

    function leaveDroppable(droppable) {
      droppable.classList.remove("highlighted");
    }

    function enterDroppable(droppable) {
      droppable.classList.add("highlighted");
    }

    function onMouseMove(e) {
      if (target) {
        moveAt(e.clientX, e.clientY);

        target.style.pointerEvents = "none";
        let elBelow = document.elementFromPoint(e.clientX, e.clientY);
        target.style.pointerEvents = "initial";

        if (!elBelow) return;

        let droppableBelow = elBelow.closest(".droppable");

        if (currentDroppable != droppableBelow) {
          if (currentDroppable) {
            leaveDroppable(currentDroppable);
          }

          currentDroppable = droppableBelow;

          if (currentDroppable) {
            enterDroppable(currentDroppable);
          }
        }
      }
    }

    document.addEventListener("mousemove", onMouseMove);

    const mouseUpController = new AbortController();
    const mouseUpSignal = mouseUpController.signal;

    document.addEventListener(
      "mouseup",
      () => {
        if (currentDroppable?.classList.contains("droppable")) {
          currentDroppable.appendChild(target);
          currentDroppable.classList.remove("highlighted");
        } else {
          this.container.querySelector(".word-letters").prepend(target);
        }

        target.style = "";
        target.classList.remove("dragging");

        document.removeEventListener("mousemove", onMouseMove);
        mouseUpController.abort();

        this.onDropCallback();
      },
      { signal: mouseUpSignal }
    );
  }
}

export { DragDrop };
