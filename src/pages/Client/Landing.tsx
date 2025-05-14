import {Home} from "./Home";
import {HowFunction} from "./HowFunction";
import {AboutUs} from "./AboutUs";
import {Contact} from "./Contact";

export default function Landing() {
    return (
        <div className="bg-transparent text-black">
            <Home />
            <HowFunction />
            <AboutUs />
            <Contact />
        </div>
    );
}