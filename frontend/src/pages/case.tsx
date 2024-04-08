import { useParams } from "react-router-dom";

const Case = () => {
    const { id } = useParams();

    return <h1>Case ID: {id}</h1>;
  };
  
  export default Case;