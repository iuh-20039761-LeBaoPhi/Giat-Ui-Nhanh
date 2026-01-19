const scriptURL =
  "https://script.google.com/macros/s/AKfycbzewmYTm5s_NZYUbaW1epB2aD0m3Eg_hiHYI3rLkr_G8pG0nCVy7SbwMwmSDrrkLusxAQ/exec";

const form = document.getElementById("contactForm");
const modalEl = document.getElementById("myModal");
const toastEl = document.getElementById("successToast");
const contactForm = document.querySelector(".contactForm");

const toast = new bootstrap.Toast(toastEl);

function chooseCombo() {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    // đóng modal (Bootstrap xử lý focus + aria-hidden chuẩn)
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();

    // hiện toast
    toast.show();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    fetch(scriptURL, {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(() => {
        // reset form
        form.reset();
      })
      .catch((err) => {
        console.error("Lỗi gửi dữ liệu:", err);
      });
  });
}
chooseCombo();

function bookAService() {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    // show toast
    toast.show();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    fetch(scriptURL, {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(() => {
        // reset contactForm
        this.reset();
      })
      .catch((err) => {
        console.error("Lỗi gửi dữ liệu:", err);
      });
  });
}
bookAService();
