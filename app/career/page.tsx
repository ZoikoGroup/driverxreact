import Accessibility from "../accessibility-language-options/Accessibility";
import Leadership from "./Leadership";
import MissionValues from "./Missionvalue";
import PressMedia from "./Pressmedia";


export default function page(){

    return(
        <div>
<Leadership/>
<PressMedia/>
<MissionValues/>
<Accessibility/>
        </div>
    );
}