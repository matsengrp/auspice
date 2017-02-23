import React from "react";
import Radium from "radium";
import { connect } from "react-redux";
import {VictoryAxis} from "victory-chart";
import * as globals from "../../util/globals";
import Card from "../framework/card";

@connect(state => {
  return {
    frequencies: state.frequencies,
    metadata: state.metadata,
    colorBy: state.controls.colorBy
  };
})
@Radium
class Frequencies extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  static propTypes = {
    /* react */
    // dispatch: React.PropTypes.func,
    params: React.PropTypes.object,
    routes: React.PropTypes.array,
    /* component api */
    style: React.PropTypes.object,
  }
  // static defaultProps = {
  //   genotype:["global", "HA1", "159F"]
  // }
  getStyles() {
    return { base: {}}
  }

  currentFrequencies() {
    let freq = "";
    if (this.props.colorBy && this.props.colorBy.slice(0,3) === "gt-") {
      const gt = this.props.colorBy.slice(3).split("_");
      freq = "global_" + gt[0] + ":" + gt[1];
    }
    return freq;
  }

  drawFrequencies() {
    const genotype = this.currentFrequencies();
    const frequencyChartWidth = 900;
    const frequencyChartHeight = 300;
    const bottomPadding = 45;
    const leftPadding = 80;
    const rightPadding = 80;
    const pivots = this.props.frequencies.pivots;
    const x = d3.scale.linear()
                    .domain([pivots[0], pivots[pivots.length-1]]) // original array, since the x values are still mapped to that
                    .range([leftPadding, frequencyChartWidth - rightPadding]);

    const y = d3.scale.linear()
                    .domain([0, 1.05]) // original array, since the x values are still mapped to that
                    .range([frequencyChartHeight-bottomPadding, 0]);

    const traj = [];
    const legendItems = [];
    const states = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K",
                         "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V",
                         "W", "X", "Y", "Z", "-", "*"];
    let tCount=0;
    for (let si=0; si<states.length; si+=1){
      const key = genotype ? genotype + states[si] : "not found";
      if (key !== "not found" && this.props.frequencies.frequencies[key]){
        const vals = this.props.frequencies.frequencies[key];
        const new_traj = { d: ("M"+x(pivots[0]).toString()+" " + y(vals[0]).toString() + vals.map((v,i) => ["L", x(pivots[i]).toString(), y(v).toString()].join(" ")).join(" ")),
                          strokeWidth: 3,
                          stroke:globals.genotypeColors[tCount%10]
                        }
        const new_legendItem = {text:key, fill:globals.genotypeColors[tCount%10], fontSize:14};
        traj.push(new_traj);
        legendItems.push(new_legendItem)
        tCount++;
      }
    }

    return (
        <svg width={frequencyChartWidth} height={frequencyChartHeight}>
          {
            traj.map((p) => {
            return (
              <path {...p}  fill={"none"} />
            );
          })}
          {
            legendItems.map((p,i) => {
            return (
              <text fontSize={p.fontSize} fill={p.fill} textAnchor={"end"}
                    x={x.range()[1]+rightPadding*0.9} y={(i+1)*18}>
                {p.text}
              </text>
            );
          })}
          <VictoryAxis
            padding={{
              top: 0,
              bottom: 0,
              left: leftPadding, // cosmetic, 1px overhang, add +1 if persists
              right: rightPadding // this is confusing, but ok
            }}
            domain={x.domain()}
            offsetY={bottomPadding}
            width={frequencyChartWidth}
            standalone={false}
            label={"Position"}
          />
          <VictoryAxis
            dependentAxis
            padding={{
              top: 0,
              bottom: bottomPadding,
              left: leftPadding, // cosmetic, 1px overhang, add +1 if persists
              right: rightPadding
            }}
            domain={y.domain()}
            offsetY={bottomPadding}
            width={frequencyChartWidth}
            standalone={false}
          />
        </svg>
    );
  }

  render() {
    const styles = this.getStyles();
    return (
      (this.props.metadata && this.props.metadata.panels && this.props.metadata.panels.some((d)=>d==="frequencies"))
      ?(
      <Card title={"Frequencies"}>
        {this.props.frequencies.frequencies ? this.drawFrequencies() : "Waiting on freq data"}
      </Card>)
      :null
    );
  }
}

export default Frequencies;
