import React, { Component } from "react";
import { Row, Col, Button } from "reactstrap";
import { connect } from "react-redux";
import Slide from "./Slide";
import SlideIndicator from "./SlideIndicator";
import { setOnboardingToServer } from "../../client";
import { setOnboarding, setTooltip } from "../../redux/actions";
import { TOOLTIP } from "../../constants"

const TOTAL_SLIDES = 3;

const mapStateToProps = state => {
  const userInfo = state.lobby.userInfo;
  return { userInfo };
};

class OnboardingSlides extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSlide: 1
    }
  }

  componentDidMount() {
    this.props.setTooltip(TOOLTIP.SEND_MESSAGE);
  }

  setSlideState = (id) => {
    if (id === this.state.activeSlide) {
      return "active";
    } else {
      return "inactive";
    }
  }

  pickSlide = (id) => {
    this.setSlide(id);
  }

  nextSlide = () => {
    let id = this.state.activeSlide;
    id < TOTAL_SLIDES ? this.setSlide(id + 1) : this.exitOnboarding();
  }

  setSlide = (id) => {
    this.setState({ activeSlide: id });
  }

  exitOnboarding = () => {
    this.props.setOnboarding(true);
    setOnboardingToServer(true);
  }

  generateSlides = () => {
    let indicators = [];
    for (let i = 1; i <= TOTAL_SLIDES; i++) {
      indicators.push(<SlideIndicator slideStatus={this.setSlideState(i)} key={i} slideID={i} click={this.pickSlide} />)
    }
    return indicators;
  }

  render() {
    return (
      <div className="fullscreen slides-bg">
        <Slide slideStatus={this.setSlideState(1)} slideId={1}>
          <Row>
            <div className="col-md-8 my-3 card align-center slide-content" style={{border: 0, borderRadius: "4px"}}>
              <img className="align-center" style={{ width: "100%", maxWidth: "50%", border: 0 }} src="slide1.png" alt="slide1" />
              <h5 className="my-3 text-slanted align-center">Play with other online players.</h5>
            </div>
          </Row>
        </Slide>
        <Slide slideStatus={this.setSlideState(2)} slideId={2}>
          <Row>
            <div className="col-md-8 my-3 card align-center slide-content" style={{border: 0, borderRadius: "4px"}}>
              <img className="align-center" style={{ width: "100%", maxWidth: "50%", border: 0 }} src="slide2.png" alt="slide2" />
              <h5 className="my-3 text-slanted align-center">Chat with others friends.</h5>
            </div>
          </Row>
        </Slide>
        <Slide slideStatus={this.setSlideState(3)} slideId={3}>
          <Row>
            <div className="col-md-8 my-3 card align-center slide-content" style={{border: 0, borderRadius: "4px"}}>
              <img className="align-center" style={{ width: "100%", marginTop: "3%", maxWidth: "60%", border: 0 }} src="slide3.png" alt="slide3" />
              <h5 className="my-3 text-slanted align-center">Move paddle to play the game.</h5>
            </div>
          </Row>
        </Slide>
        <div className="slides-controls">
          <Row>
            <Col>
              <Button color="secondary" className="align-left"
                onClick={this.exitOnboarding}
                aria-labelledby="skip"
                aria-hidden="true">Skip</Button>
            </Col>
            <Col>
              <div className="align-center">
                {this.generateSlides()}
              </div>
            </Col>
            <Col>
              <Button color="primary" className="align-right"
                onClick={this.nextSlide}
                aria-labelledby="done"
                aria-hidden="true">
                {
                  this.state.activeSlide < TOTAL_SLIDES ? "Next" : "Done"
                }
              </Button>
            </Col>
          </Row>
        </div>
      </div >
    )
  }
}

export default connect(mapStateToProps, { setOnboarding, setTooltip })(OnboardingSlides);
