import Context from "../../runtime/Context";
import Visitor from "../../visitors/Visitor";

interface Node {
    visit(visitor: Visitor): void;
}

export default Node;