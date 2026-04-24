/**
 * Shared SweetAlert2 toast/dialog utility for consistent notifications across the app.
 * Usage: import { Toast, Dialog } from "@/shared/lib/swal"
 */
import Swal from "sweetalert2";

// Reusable top-right toast
export const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

export const successToast = (title: string, text?: string) =>
  Toast.fire({ icon: "success", title, text });

export const errorToast = (title: string, text?: string) =>
  Toast.fire({ icon: "error", title, text });

export const warningToast = (title: string, text?: string) =>
  Toast.fire({ icon: "warning", title, text });

// Full-screen confirm dialog
export const confirmDialog = (title: string, text: string) =>
  Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#4f46e5",
    cancelButtonColor: "#d1d5db",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
    borderRadius: "1rem",
  });

export const successDialog = (title: string, text?: string) =>
  Swal.fire({
    icon: "success",
    title,
    text,
    confirmButtonColor: "#4f46e5",
    confirmButtonText: "Great!",
  });
