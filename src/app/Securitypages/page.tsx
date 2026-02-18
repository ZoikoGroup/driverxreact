import ComplianceStandards from "./ComplianceStandards";
import GDPR from "./GDPR";
import Pci from "./PCI";
import Soc2Security from "./Soc2Security";

export default function page(){

    return(
        <div>
            <Pci/>
            <GDPR/>
            <ComplianceStandards/>
            <Soc2Security/>
          
        </div>
    );
}