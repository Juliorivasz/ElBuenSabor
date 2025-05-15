import ElegiImg from "../../assets/elegi.jpg";
import OrdenImg from "../../assets/orden.jpg";
import RecibeImg from "../../assets/recibe.jpg";

export function HowFunction() {
  return (
    <section
      id="howFunction"
      className="text-black px-6 py-12 text-center">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-8">¿CÓMO FUNCIONA?</h2>
        <div className="flex flex-col md:flex-row justify-around items-center gap-8">
          <div>
            <img
              src={ElegiImg}
              alt="Elegí tu comida"
              className="w-50 h-50 mx-auto rounded-full mb-4 object-cover"
            />
            <p className="text-xl">
              <strong>1. ELEGI TU COMIDA</strong>
              <br />
              Busca en nuestro catálogo y ordena directamente desde la app.
            </p>
          </div>
          <div>
            <img
              src={OrdenImg}
              alt="Hacé tu orden"
              className="w-50 h-50 mx-auto rounded-full mb-4 object-cover"
            />
            <p className="text-xl">
              <strong>2. HACE TU ORDEN</strong>
              <br />
              Es fácil y rápido. Podés pagar online o en la entrega.
            </p>
          </div>
          <div>
            <img
              src={RecibeImg}
              alt="Recibí tu comida"
              className="w-50 h-50 mx-auto rounded-full mb-4 object-cover"
            />
            <p className="text-xl">
              <strong>3. RECIBE TU COMIDA</strong>
              <br />
              Recoge la entrega en tu puerta o en nuestro local y disfrutá de la comida.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
