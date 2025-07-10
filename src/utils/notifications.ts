// Sistema de notificaciones usando SweetAlert2 que ya está instalado
import Swal from "sweetalert2";

export class NotificationService {
  static success(message: string, title = "Éxito") {
    Swal.fire({
      icon: "success",
      title,
      text: message,
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
      toast: true,
      position: "bottom-end",
    });
  }

  static error(message: string, title = "Error") {
    Swal.fire({
      icon: "error",
      title,
      text: message,
      timer: 4000,
      timerProgressBar: true,
      showConfirmButton: false,
      toast: true,
      position: "bottom-end",
    });
  }

  static warning(message: string, title = "Advertencia") {
    Swal.fire({
      icon: "warning",
      title,
      text: message,
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
      toast: true,
      position: "bottom-end",
    });
  }

  static info(message: string, title = "Información") {
    Swal.fire({
      icon: "info",
      title,
      text: message,
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
      toast: true,
      position: "bottom-end",
    });
  }

  static async confirm(message: string, title = "Confirmar acción"): Promise<boolean> {
    const result = await Swal.fire({
      icon: "question",
      title,
      text: message,
      showCancelButton: true,
      confirmButtonColor: "#ea580c",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, continuar",
      cancelButtonText: "Cancelar",
    });

    return result.isConfirmed;
  }
}
