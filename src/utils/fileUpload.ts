// Utilidades para manejo de archivos
export class FileUploadService {
  static validateImageFile(file: File): { isValid: boolean; error?: string } {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: "Tipo de archivo no válido. Solo se permiten: JPG, PNG, GIF, WEBP",
      }
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: "El archivo es demasiado grande. Máximo 5MB",
      }
    }

    return { isValid: true }
  }

  static async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  static createImagePreviewUrl(file: File): string {
    return URL.createObjectURL(file)
  }

  static revokeImagePreviewUrl(url: string): void {
    URL.revokeObjectURL(url)
  }
}
