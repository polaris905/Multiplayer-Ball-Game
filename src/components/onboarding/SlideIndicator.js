import React from "react";
import { Button } from "reactstrap";

const SlideIndicator = (props) => 
  <Button color="link" className="indicator"
    aria-labelledby="indicator"
    aria-hidden="true"
    onClick={(event) => props.click(Number(props.slideID))}>
    <div className={"circle indicator-" + props.slideStatus}></div>
  </Button>

export default SlideIndicator;