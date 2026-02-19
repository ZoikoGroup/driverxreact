import Blog1 from "./Blog1";
import Blog2 from "./Blog2";
import Blog3 from "./Blog3";

export default function page(){

    return(
        <div className="px-2">
        <Blog1/>
        <Blog2/>  
        <Blog3/>
        </div>
    );
}