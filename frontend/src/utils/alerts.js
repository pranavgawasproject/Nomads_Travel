import Swal from "sweetalert2";

const baseOptions = {
  allowOutsideClick: true,
  allowEscapeKey: true,
  backdrop: true,
  heightAuto: false,
};

export const showSuccessAlert = (message) =>
  Swal.fire({
    ...baseOptions,
    icon: "success",
    title: "Success",
    text: message,
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    customClass: {
      popup: "swal2-popup--rounded",
      title: "swal2-title--serif",
    },
  });

export const showErrorAlert = (message) =>
  Swal.fire({
    ...baseOptions,
    icon: "error",
    title: "Error",
    text: message,
    confirmButtonText: "OK",
    buttonsStyling: false,
    customClass: {
      confirmButton: "swal2-confirm swal2-confirm--gray",
      popup: "swal2-popup--rounded",
      title: "swal2-title--serif",
    },
  });

export default {
  showSuccessAlert,
  showErrorAlert,
};
