import logoImg from "../../assets/logo.png";

export function AboutUs() {
  return (
    <section
      id="aboutUs"
      className="text-black px-6 py-12">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        <h2 className="text-4xl font-bold mb-8 text-center">SOBRE NOSOTROS</h2>
        <div className="flex flex-col md:flex-row items-center md:items-center gap-8 justify-center md:justify-between">
          <p className="text-xl md:w-1/2 text-start">
            Somos El Buen Sabor, un restaurante ubicado en el corazón de Mendoza dedicado a crear las mejores
            hamburguesas artesanales. Combinamos ingredientes frescos, pan casero y carne 100% argentina para ofrecer
            una experiencia gourmet rápida y deliciosa. ¡Probá nuestra hamburguesa de la casa con queso ahumado y
            chimichurri mendocino!
          </p>

          <img
            src={logoImg}
            alt="logo"
            className="w-70 h-70 bg-gray-300 rounded"
          />
        </div>
      </div>
    </section>
  );
}
