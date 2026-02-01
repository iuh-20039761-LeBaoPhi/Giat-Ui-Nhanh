// const scriptURL =
//   "https://script.google.com/macros/s/AKfycbzewmYTm5s_NZYUbaW1epB2aD0m3Eg_hiHYI3rLkr_G8pG0nCVy7SbwMwmSDrrkLusxAQ/exec";
const createOrderAPI = "http://localhost/Giat-Ui-Nhanh/public/orders";
const loginAPI = "http://localhost/Giat-Ui-Nhanh/public/logins";
const updateOrderAPI = "http://localhost/Giat-Ui-Nhanh/public/orders";
const serviceAPI = "http://localhost/Giat-Ui-Nhanh/public/services";

const toastEl = document.getElementById("successToast");

const toast = new bootstrap.Toast(toastEl);

function chooseComboAPI() {
  const form = document.querySelector(".contactFormCombo");
  const modalEl = document.getElementById("myModal");

  if (!form || form.length === 0) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());
    const modal = bootstrap.Modal.getInstance(modalEl);

    fetch(createOrderAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(() => {
        modal.hide();
        // reset form
        form.reset();
        // hiện toast
        toast.show();
      })
      .catch((err) => {
        console.error("Lỗi gửi dữ liệu:", err);
      });
  });
}
chooseComboAPI();

function bookAServiceAPI() {
  const contactForm = document.querySelector(".contactForm");

  if (!contactForm || contactForm.length === 0) return;

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    fetch(createOrderAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(() => {
        // reset contactForm
        this.reset();
        // show toast
        toast.show();
      })
      .catch((err) => {
        console.error("Lỗi gửi dữ liệu:", err);
      });
  });
}
bookAServiceAPI();

function loginAPIHandler() {
  const loginForm = document.getElementById("loginForm");
  const alertBox = document.getElementById("loginAlert");
  if (!loginForm) return;

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    fetch(loginAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(() => {
        //Success Login
        loginForm.reset();

        setTimeout(() => {
          window.location.href = "?ctrl=page&act=dashboard";
        });
      })
      .catch((err) => {
        //Error Login
        alertBox.className = "alert alert-danger alert-dismissible fade show";
        alertBox.innerHTML = `
          ${err.error || "Đăng nhập thất bại"}
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        alertBox.classList.remove("d-none");
      });
  });
}
loginAPIHandler();

function updateOrdersAPI() {
  const orderForm = document.getElementById("orderForm");
  const modalEl = document.getElementById("myModal");

  if (!orderForm) return;

  orderForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    const id = data.order_id;
    delete data.order_id;

    const modal = bootstrap.Modal.getInstance(modalEl);

    fetch(`${updateOrderAPI}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) =>
        res.json().then((result) => {
          if (!res.ok) {
            throw new Error(result.message);
          }
          return result;
        }),
      )
      .then((result) => {
        modal.hide();

        orderForm.reset();

        const TOAST_DELAY = 2500;

        showToast(result.message, "success");

        setTimeout(() => {
          window.location.replace(window.location.href);
        }, TOAST_DELAY);
      })
      .catch((err) => {
        showToast(err.message || "Có lỗi xảy ra!", "danger");

        console.error(err);
      });
  });
}
updateOrdersAPI();

function CancelOrdersAPI() {
  const cancelBtns = document.querySelectorAll(".cancel-order-btn");

  if (!cancelBtns.length) return;

  cancelBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const orderId = this.dataset.id;
      const orderStatus = this.dataset.orderStatus;
      const transactionStatus = this.dataset.transactionStatus;

      // Chặn hủy nếu đã thanh toán
      if (transactionStatus === "Paid") {
        showToast("Đơn hàng đã thanh toán, không thể hủy!", "warning");
        return;
      }

      const data = {
        order_status: orderStatus, // Cancel
        transaction_status: transactionStatus,
      };

      fetch(`${updateOrderAPI}/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then(function (res) {
          return res.json().then(function (result) {
            if (!res.ok) {
              throw new Error(result.message);
            }
            return result;
          });
        })
        .then(function (result) {
          showToast(result.message || "Hủy đơn thành công!", "success");

          setTimeout(function () {
            location.reload();
          }, 2500);
        })
        .catch(function (err) {
          showToast(err.message || "Có lỗi xảy ra!", "danger");
          console.error(err);
        });
    });
  });
}
CancelOrdersAPI();

function addServicesAPI() {
  const addServiceForm = document.getElementById("addServiceForm");
  const modalEl = document.getElementById("addRowModal");

  if (!addServiceForm) return;

  addServiceForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());
    const modal = bootstrap.Modal.getInstance(modalEl);

    fetch(serviceAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) =>
        res.json().then((result) => {
          if (!res.ok) {
            throw new Error(result.message);
          }
          return result;
        }),
      )
      .then((result) => {
        modal.hide();

        addServiceForm.reset();

        const TOAST_DELAY = 2500;

        showToast(result.message, "success");

        setTimeout(() => {
          window.location.replace(window.location.href);
        }, TOAST_DELAY);
      })
      .catch((err) => {
        showToast(err.message || "Có lỗi xảy ra!", "danger");

        console.error(err);
      });
  });
}
addServicesAPI();

function updateServicesAPI() {
  const serviceForm = document.getElementById("serviceForm");
  const modalEl = document.getElementById("myModal");

  if (!serviceForm) return;

  serviceForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    const id = data.service_id;
    delete data.service_id;

    const modal = bootstrap.Modal.getInstance(modalEl);

    fetch(`${serviceAPI}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) =>
        res.json().then((result) => {
          if (!res.ok) {
            throw new Error(result.message);
          }
          return result;
        }),
      )
      .then((result) => {
        modal.hide();

        serviceForm.reset();

        const TOAST_DELAY = 2500;

        showToast(result.message, "success");

        setTimeout(() => {
          window.location.replace(window.location.href);
        }, TOAST_DELAY);
      })
      .catch((err) => {
        showToast(err.message || "Có lỗi xảy ra!", "danger");

        console.error(err);
      });
  });
}
updateServicesAPI();

function showToast(message, type = "success") {
  $.notify(
    {
      icon: "fa fa-bell",
      message: message,
    },
    {
      type: type,
      placement: {
        from: "top",
        align: "right",
      },
      delay: 2500,
      z_index: 9999,

      offset: 20,
      spacing: 10,

      animate: {
        enter: "animate__animated animate__fadeInDown",
        exit: "animate__animated animate__fadeOutUp",
      },
    },
  );
}
