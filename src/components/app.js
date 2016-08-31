import React, {Component} from "react";
import {StyleSheet, css} from "aphrodite";
import {prop, head, values, without, append} from "ramda";
import {Markets} from "./markets";
import {Selections} from "./selections";

/**
 * @todo: Add a component that allows a customer to only show markets in the left hand panel that can be used to create Request A Bet bets.
 *
 * The allowed Markets are:
 * 1) Full Time Result
 * 2) Both Teams To Score
 * 3) Over/Under 2.5 Goals
 * 4) To Score in 90mins
 * 5) Corners
 * 6) Bookings
 * 7) Player To Be Carded
 */
export class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selections: []
        }
    }

    onOutcomeClick(id) {
        const {selections} = this.state;

        this.setState( {
            selections: selections.includes(id)? without([id], selections) : append(id, selections)
        });
    }

    render() {
        const { markets, outcomes } = this.props;
        var selections = this.state.selections;
        return (
            <div className={css(styles.parent)}>
                <div className={css(styles.markets)}>
                    <Markets markets={markets} outcomes={outcomes} marketId={this.state.currentMarket}
                             onOutcomeClick={this.onOutcomeClick.bind(this)} selections={selections}
                    />
                </div>
                <div className={css(styles.feedback)}>
                    <Selections outcomes={outcomes} markets={markets} selections={selections}/>
                    { /* @todo: Add a new component here to show suggested RequestABets based on selected outcomes*/}
                    { /* See the overview in the main entry file, but the suggestions should be ordered from most relevant to least and limited to 10 outcomes */}
                </div>
            </div>
        )
    }
}

const styles = StyleSheet.create({
    "parent": {
        display: "flex",
        flexBasis: "row",
        alignItems: "stretch",
        alignContent: "stretch",
        width: "100vw",
        height: "100vh",
        background: "#f7f7f7"
    },
    "markets": {
        width: "75%",
        flexBasis: "auto",
        borderRight: "1px solid #ccc"
    },
    "feedback": {
        width: "25%",
        flexBasis: "auto",
        minWidth: "200px"
    },
});