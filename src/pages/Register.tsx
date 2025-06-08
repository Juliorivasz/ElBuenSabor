import React, { useState } from "react";

// Tipo para los datos del formulario
type FormData = {
  firstName: string;
  lastName: string;
  calle: string;
  number: string;
  localidad: string;
  departamento: string;
  phone: string;
};

// Objeto que asocia departamentos con sus respectivas localidades
const departamentosConLocalidades: Record<string, string[]> = {
  "Godoy Cruz": ["La Estanzuela", "Barrio La Gloria", "Trapiche"],
  Guaymallén: ["Bermejo", "San Jose", "Corralitos"],
  "Las Heras": ["Barrio Municipal", "Santa Teresita", "San Ignacio"],
  Maipú: ["Tropero Sosa", "Rodeo del Medio", "San Roque"],
  "Luján de Cuyo": ["Cacheuta", "Ugarteche", "El Carrizal"],
};

export const Register: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    calle: "",
    number: "",
    localidad: "",
    departamento: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Obtiene la lista de localidades disponibles según el departamento elegido
  const localidadesDisponibles = formData.departamento ? departamentosConLocalidades[formData.departamento] : [];

  // Maneja los cambios en los inputs (Elige si es Input o Select)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Si se cambia el departamento, también reseteamos la localidad
    if (name === "departamento") {
      setFormData({
        ...formData,
        departamento: value,
        localidad: "", // Limpiamos la localidad si cambia el departamento
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Limpia el error de ese campo si existía
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // Validación de los datos ingresados
  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (formData.firstName.trim().length < 3) {
      newErrors.firstName = "Debe tener al menos 3 caracteres.";
    }

    if (formData.lastName.trim().length < 3) {
      newErrors.lastName = "Debe tener al menos 3 caracteres.";
    }

    if (formData.calle.trim().length < 4) {
      newErrors.calle = "Debe tener al menos 4 caracteres.";
    }

    if (!/^\d{2,}$/.test(formData.number.trim())) {
      newErrors.number = "Solo números (mínimo 2 dígitos).";
    }

    if (!formData.departamento) {
      newErrors.departamento = "Debe seleccionar un departamento.";
    }

    if (!formData.localidad) {
      newErrors.localidad = "Debe seleccionar una localidad.";
    }

    if (!/^\d{8,}$/.test(formData.phone.trim())) {
      newErrors.phone = "Solo números (mínimo 8 dígitos).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Cuando el usuario envía el formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      // Limpiar espacios en los datos antes de enviar
      const cleanedData: FormData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        calle: formData.calle.trim(),
        number: formData.number.trim(),
        localidad: formData.localidad.trim(),
        departamento: formData.departamento.trim(),
        phone: formData.phone.trim(),
      };
      return cleanedData;
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-orange-100">
      <form
        onSubmit={handleSubmit}
        className="bg-orange-200 p-8 rounded-2xl shadow-2xl w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Registrate</h2>

        {/* Campos de texto individuales */}
        {[
          { id: "firstName", label: "Nombre", type: "text", error: errors.firstName },
          { id: "lastName", label: "Apellido", type: "text", error: errors.lastName },
          { id: "phone", label: "Teléfono", type: "tel", error: errors.phone },
          { id: "calle", label: "Domicilio: Calle", type: "text", error: errors.calle },
          { id: "number", label: "Numeración", type: "text", error: errors.number },
        ].map(({ id, label, type, error }) => (
          <div
            key={id}
            className="relative mb-6">
            <input
              type={type}
              name={id}
              id={id}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              value={(formData as any)[id]}
              onChange={handleChange}
              placeholder=" "
              required
              autoComplete="on"
              className={`peer p-2 w-full text-black bg-orange-100 border rounded-md 
                placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#242424]
                ${error ? "border-red-500 ring-red-500" : "border-gray-400"}`}
            />
            <label
              htmlFor={id}
              className="absolute left-2 -top-3.5 text-sm text-gray-700 bg-orange-100 px-1 
                transition-all duration-200 pointer-events-none
                peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-md peer-placeholder-shown:px-0
                peer-focus:-top-3.5 peer-focus:text-sm peer-focus:px-1 peer-focus:text-[#242424]
                peer-valid:-top-3.5 peer-valid:text-sm peer-valid:px-1 peer-valid:text-[#242424]">
              {label}
            </label>
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
          </div>
        ))}

        {/* Selector de Departamento */}
        <div className="mb-6">
          <label
            htmlFor="departamento"
            className="block text-md text-gray-700 mb-1">
            Departamento
          </label>
          <select
            name="departamento"
            id="departamento"
            value={formData.departamento}
            onChange={handleChange}
            required
            className={`p-2 w-full text-black bg-orange-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#242424] 
              ${errors.departamento ? "border-red-500 ring-red-500" : "border-gray-400"}`}>
            <option
              value=""
              disabled>
              Seleccione un departamento
            </option>
            {Object.keys(departamentosConLocalidades).map((dep) => (
              <option
                key={dep}
                value={dep}>
                {dep}
              </option>
            ))}
          </select>
          {errors.departamento && <p className="text-sm text-red-600 mt-1">{errors.departamento}</p>}
        </div>

        {/* Selector de Localidad (dinámico según el departamento elegido) */}
        <div className="mb-6">
          <label
            htmlFor="localidad"
            className="block text-md text-gray-700 mb-1">
            Localidad
          </label>
          <select
            name="localidad"
            id="localidad"
            value={formData.localidad}
            onChange={handleChange}
            required
            disabled={!formData.departamento}
            className={`p-2 w-full text-black bg-orange-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#242424] 
              ${errors.localidad ? "border-red-500 ring-red-500" : "border-gray-400"}`}>
            <option
              value=""
              disabled>
              Seleccione una localidad
            </option>
            {localidadesDisponibles.map((loc) => (
              <option
                key={loc}
                value={loc}>
                {loc}
              </option>
            ))}
          </select>
          {errors.localidad && <p className="text-sm text-red-600 mt-1">{errors.localidad}</p>}
        </div>

        {/* Botón para enviar el formulario */}
        <button
          type="submit"
          className="w-full py-2 mt-2 bg-[#b8621b] text-white font-semibold rounded-md 
            hover:bg-[#242424] focus:outline-none focus:ring-2">
          Registrarse
        </button>
      </form>
    </div>
  );
};
