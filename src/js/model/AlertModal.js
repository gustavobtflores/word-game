export class AlertModal {
  constructor() {
    this.modal = document.querySelector(".modal");
  }

  show() {
    this.modal.classList.add("show");
  }

  hide() {
    this.modal.classList.remove("show");
  }
}
