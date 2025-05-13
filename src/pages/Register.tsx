import React, { useState } from 'react';

// Definimos el tipo para los datos del formulario
type FormData = {
  fullName: string;
  address: string;
  phone: string;
};

export const Register: React.FC = () => {
  // Estado para almacenar los valores del formulario
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    address: '',
    phone: '',
  });

  // Estado para manejar errores de validación por campo
  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Función que actualiza el estado cuando cambia un input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Actualiza el valor del campo correspondiente
    setFormData({ ...formData, [name]: value });

    // Limpia el error de ese campo si existía
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // Función de validación para cada campo
  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Debe tener al menos 3 caracteres.';
    }

    if (formData.address.trim().length < 5) {
      newErrors.address = 'Debe tener al menos 5 caracteres.';
    }

    if (!/^\d{8,}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Solo números (mínimo 8 dígitos).';
    }

    setErrors(newErrors);

    // Si no hay errores, la validación pasa
    return Object.keys(newErrors).length === 0;
  };

  // Maneja el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Evita el comportamiento por defecto del form

    if (validate()) {
      console.log('Formulario enviado:', formData);
      // Aquí podrías enviar los datos al backend o resetear el formulario
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-orange-100">
      {/* Formulario principal */}
      <form
        onSubmit={handleSubmit}
        className="bg-orange-200 p-8 rounded-2xl shadow-2xl w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Registrate</h2>

        {/* Mapeamos campos para reutilizar estructura */}
        {[
          {
            id: 'fullName',
            label: 'Nombre y Apellido',
            type: 'text',
            error: errors.fullName,
          },
          {
            id: 'address',
            label: 'Dirección',
            type: 'text',
            error: errors.address,
          },
          {
            id: 'phone',
            label: 'Teléfono',
            type: 'tel',
            error: errors.phone,
          },
        ].map(({ id, label, type, error }) => (
          <div key={id} className="relative mb-6">
            {/* Input con clases para interacción y animación */}
            <input
              type={type}
              name={id}
              id={id}
              value={(formData as any)[id]} // Acceso dinámico a formData
              onChange={handleChange}
              placeholder=" " // Necesario para que funcione el peer-placeholder-shown
              required
              autoComplete="on"
              className={`peer p-2 w-full text-black bg-orange-100 border rounded-md 
                        placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#242424]
                        ${error ? 'border-red-500 ring-red-500' : 'border-gray-400'}`}
            />

            {/* Label animado usando peer */}
            {/* 
              peer: permite que el label reaccione a eventos del input hermano (focus, placeholder-shown, etc)
              peer-placeholder-shown: se aplica cuando el placeholder está visible (input vacío)
              peer-focus: se aplica cuando el input tiene foco
              peer-valid: útil cuando hay un valor válido y queremos mantener el label arriba
            */}
            <label
              htmlFor={id}
              className="absolute left-2 -top-3.5 text-sm text-gray-700 rounded-lg bg-orange-100 px-1 
                        transition-all duration-200 pointer-events-none
                        peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-md peer-placeholder-shown:px-0
                        peer-focus:-top-3.5 peer-focus:text-sm peer-focus:px-1 peer-focus:text-[#242424]
                        peer-valid:-top-3.5 peer-valid:text-sm peer-valid:px-1 peer-valid:text-[#242424]"
            >
              {label}
            </label>

            {/* Muestra el error debajo del campo si existe */}
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
          </div>
        ))}

        {/* Botón de envío */}
        <button
          type="submit"
          className="w-full py-2 mt-2 bg-[#b8621b] text-white font-semibold rounded-md 
                    hover:bg-[#242424] focus:outline-none focus:ring-2"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
};




