import { Link } from "react-router-dom";
import hamburguesaImg from "../../assets/hamburguesa.png"; // Reemplazá con tu imagen real

export function Home() {
  return (
    <section className="flex flex-col md:flex-row justify-between items-center px-6 py-12 text-black">
      <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            ORDENA TU COMIDA <br /> DESDE LA COMODIDAD <br /> DE TU CASA
          </h1>
          <Link to={"/catalog"}>
            <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4  mt-4 w-60 h-15 rounded-full cursor-pointer">
              CATALOGO
            </button>
          </Link>
        </div>
        <img
          src={hamburguesaImg}
          alt="Hamburguesa"
          className="w-80 md:w-100 mt-6 md:mt-0 rounded-full"
        />
      </div>
    </section>
  );
}
