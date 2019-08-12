import React, { Component } from "react";
import { Row, Col, Button } from "reactstrap";
import { connect } from "react-redux";
import Slide from "./Slide";
import SlideIndicator from "./SlideIndicator";
import { setOnboardingToServer } from "../../client";
import { setOnboarding, setTooltip } from "../../redux/actions";
import { TOOLTIP } from "../../constants"

const TOTAL_SLIDES = 2;

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

  pickSlide = (event, id) => {
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
          {/* <Container> */}
          <Row>
            <div className="col-10 col-md-6 col-lg-8 my-3 card align-center">
              <h1 className="my-4 text-slanted">Search your recipes...</h1>
              <img
                src="https://static.food2fork.com/peanutbutteroatmealsandwichcookies9764.jpg"
                alt="recipe"
              />
              <h5 className="my-3 text-slanted">Here, you can search and browse the most popular recipes.</h5>
            </div>
          </Row>
          {/* </Container> */}
        </Slide>
        <Slide slideStatus={this.setSlideState(2)} slideId={2}>
          {/* <Container> */}
          <Row>
            <div className="col-10 col-md-6 col-lg-8 my-3 card align-center">
              <h1 className="my-4 text-slanted">Save your favourites...</h1>

              <img
                src="https://static.food2fork.com/chocolatepeanutbutterfuncake6460913.jpg"
                alt="recipe"
              />
              <h5 className="my-3 text-slanted">Here, you can also save your favourite recipes</h5>
            </div>
          </Row>
          {/* </Container> */}
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