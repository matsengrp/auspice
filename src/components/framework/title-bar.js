import React from "react";
import { connect } from "react-redux";
import Flex from "./flex";
import { titleColors, titleBarHeight } from "../../util/globals";
import { titleFont, dataFont, darkGrey, medGrey, lightGrey, brandColor } from "../../globalStyles";
import Radium from "radium";
import Title from "./title";
import { Link } from "react-router-dom";

var RadiumLink = Radium(Link); // needed to style custom components with radium

@connect((state) => {
  return {
    browserDimensions: state.browserDimensions.browserDimensions
  };
})
@Radium
class TitleBar extends React.Component {
  constructor(props) {
    super(props);
  }
  // static propTypes = {
  //   dataName: React.PropTypes.string
  // }
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }
  getStyles() {
    return {
      logo: {
        paddingLeft: "8px",
        paddingRight: "8px",
        paddingTop: "20px",
        paddingBottom: "20px",
        color: darkGrey,
        textDecoration: "none",
        fontSize: this.props.minified ? 12 : 16
      },
      title: {
        padding: "0px",
        color: darkGrey,
        textDecoration: "none",
        fontSize: 20,
        fontWeight: 400
      },
      main: {
        height: titleBarHeight,
        justifyContent: "space-between",
        alignItems: "center",
        background: "#eaebeb",
        marginBottom: 5,
        overflow: "hidden",
        // boxShadow: "1px 1px 2px 1px rgba(200,200,200,0.85)"
      },
      link: {
        paddingLeft: this.props.minified ? "6px" : "12px",
        paddingRight: this.props.minified ? "6px" : "12px",
        paddingTop: "20px",
        paddingBottom: "20px",
        color: darkGrey,
        textDecoration: "none",
        cursor: "pointer",
        fontSize: this.props.minified ? 12 : 16,
        ':hover': {
          background: "rgba(215,215,215,0.10)"
        }
      },
      inactive: {
        background: "rgba(215,215,215,0.10)",
        paddingLeft: "8px",
        paddingRight: "8px",
        paddingTop: "20px",
        paddingBottom: "20px",
        color: darkGrey,
        textDecoration: "none",
        fontSize: this.props.minified ? 12 : 16
      },
      alerts: {
        textAlign: "center",
        verticalAlign: "middle",
        width: 70,
        color: brandColor
      },
      dataName: {
        alignSelf: "center",
        padding: "0px",
        color: darkGrey,
        textDecoration: "none",
        fontSize: 20,
        fontWeight: 400
      }
    };
  }

  getLogo(styles) {
    return (
      this.props.logoHidden ? <div style={{flex: "none" }}/> :
        <Link style={styles.logo} to="/">
          <img width="40" src={require("../../images/nextstrain-logo-small.png")}/>
        </Link>
    );
  }

  getTitle(styles) {
    return (
      this.props.titleHidden || this.props.browserDimensions.width < 600 || this.props.minified ?
        <div style={{flex: "none" }}/> :
        <Link style={styles.title} to="/">
          <Title minified={true} style={styles.title}/>
        </Link>
    );
  }

  getDataName(dataName, styles) {
    return (
      this.props.dataNameHidden ? <div style={{flex: "none" }}/> :
        <div style={styles.dataName}>
          {dataName}
        </div>
    );
  }

  getLink(name, url, selected, styles) {
    return (
      selected ?
        <div style={styles.inactive}>{name}</div> :
        <RadiumLink style={styles.link} to={url}>{name}</RadiumLink>
    );
  }

  render() {
    const styles = this.getStyles();
    let dataName = this.context.router.location.pathname;
    dataName = dataName.replace(/^\//, '').replace(/\/$/, '');
    if (dataName.length === 1) {dataName = "";}
    return (
      <div>
        <Flex style={styles.main}>
          {this.getLogo(styles)}
          {this.getTitle(styles)}
          {this.getDataName(dataName, styles)}
          <div style={{flex: 5}}/>
          {this.getLink("About", "/about", this.props.aboutSelected, styles)}
          {this.getLink("Methods", "/methods", this.props.methodsSelected, styles)}
          <div style={{flex: this.props.minified ? 1 : "none" }}/>
        </Flex>
      </div>
    );
  }
}

export default TitleBar;
