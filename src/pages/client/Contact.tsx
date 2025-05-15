export function Contact() {
  return (
    <section
      id="contact"
      className="text-black px-6 py-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start gap-10">
        <div>
          <h2 className="text-4xl font-bold mb-8">CONTACTANOS</h2>
          <ul className="text-xl space-y-4">
            <li>
              <a
                href="#"
                className="hover:underline">
                Instagram
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:underline">
                Facebook
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:underline">
                Whatsapp
              </a>
            </li>
            <li>
              <p>elbuensabor2025@gmail.com</p>
            </li>
          </ul>
        </div>

        <div className="w-full md:w-[600px] ml-auto">
          <h2 className="text-4xl font-bold mb-8 text-center w-full">DÓNDE ESTAMOS</h2>
          <div className="relative w-full aspect-[4/3] rounded overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1612.0121732269854!2d-68.8559139724171!3d-32.88382960398096!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x967e08fe30dcf1d9%3A0xbbbe8e86f5e31fae!2sMonica%20S%20B%20D%20Rivas!5e1!3m2!1ses!2sar!4v1747252618638!5m2!1ses!2sar"
              className="absolute top-0 left-0 w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
