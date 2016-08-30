import React, { Component } from "react";
import {values, map, head, assoc} from "ramda";
import {StyleSheet, css} from "aphrodite";
import {firstMarketId} from "../model/markets";

// @todo: Identify visually when a market is showing its outcomes in the middle panel
// Used assoc to add the currentId to every item in markets, similar to how onClick was added to each.
export const MarketTitle = ({name, outcomes, marketId, onClick, currentId}) => {
    var titleStyle = css(styles.marketTitle);
    
    console.log("Market Title " + currentId);

    const count = outcomes.length;
    const clickHandler = () => {
        onClick(marketId);
    };

    if (marketId == currentId) {
        titleStyle = css(styles.currentMarketTitle);
    };

    // css(styles.marketTitle)
    return (
        <h2 key={marketId} className={titleStyle} onClick={clickHandler}> 
            {name} <small className={css(styles.betCount)}>({count} bets)</small>
        </h2>
    )
};

// @todo: Identify visually when an outcome is "selected"
export const Outcome = ({name, price, outcomeId, onClick}) => {
    const clickHandler = () => {
        onClick(outcomeId);
    };
    return (
        <div key={outcomeId} className={css(styles.outcome)} onClick={clickHandler}>
            <div className={css(styles.outcomeName, styles.outcomeCell)}>{name}</div>
            <div className={css(styles.outcomePrice, styles.outcomeCell)}>{price.num}/{price.den}</div>
        </div>
    )
};

const pickMarketOutcomes = outcomes => market => market.outcomes.map(id => outcomes[id]);

export const MarketList = ({markets, onMarketClick, currentId}) => {
    const marketList = map(MarketTitle, map(assoc("currentId", currentId), map(assoc("onClick", onMarketClick), values(markets))));
    return <div className={css(styles.markets)}>{marketList}</div>
};

export const OutcomeList = ({outcomes, onOutcomeClick, market}) => {
    const outcomeList = map(Outcome, map(assoc("onClick", onOutcomeClick), pickMarketOutcomes(outcomes)(market)));
    return <div className={css(styles.outcomes)}>{outcomeList}</div>;
}

// @todo: Order Markets by displayOrder
// @todo: Could the display of outcomes be abstracted in a testable way (similar to MarketList)?
export class Markets extends Component {
    constructor(props) {
        super(props);
        const {markets} = props;
        this.state = {
            currentMarket: firstMarketId(values(markets))
        }
    }

    onMarketClick(id) {
        this.setState({
            currentMarket: id
        });
    }

    render() {
        const {onOutcomeClick, outcomes, markets} = this.props;
        const market = markets[this.state.currentMarket];
        var currentId = market.marketId;
        const outcomeList = map(Outcome, map(assoc("onClick", onOutcomeClick), pickMarketOutcomes(outcomes)(market)));
        return (
            <div className={css(styles.panel)}>
                <MarketList onMarketClick={this.onMarketClick.bind(this)} markets={markets} currentId={currentId}/>
                {/*<div className={css(styles.outcomes)}>{outcomeList}</div>*/}
                <OutcomeList onOutcomeClick={onOutcomeClick} outcomes={outcomes} market={market}/>
            </div>
        )
    }
}

// @todo: How can we make the styles more re-usable?
const styles = StyleSheet.create({
    marketTitle: {
        fontFamily: "sans-serif",
        fontSize: "16px",
        color: "white", 
        backgroundColor: "#0938B8",
        borderBottom: "1px solid #ccc",
        margin: 0,
        padding: "1em",
        cursor: "pointer",
    },
    currentMarketTitle: {
        fontFamily: "sans-serif",
        fontSize: "16px",
        color: "black",
        backgroundColor: "#FFF",
        borderBottom: "1px solid #ccc",
        margin: 0,
        padding: "1em",
        cursor: "pointer",
    },
    betCount: {
        fontWeight: "bold",
        fontSize: "12px",
        color: "#777"
    },
    panel: {
        display: "flex",
        height: "100%"
    },
    markets: {
        width: "50%",
        borderRight: "1px solid #ccc",
        overflowY: "scroll"
    },
    outcomes: {
        width: "50%",
        overflowY: "scroll"
    },
    outcome: {
        width: "100%",
        display: "flex"
    },
    outcomeCell: {
        fontFamily: "sans-serif",
        padding: "1em",
        flexBasis: "auto",
        borderBottom: "1px solid #ccc",
        background: "#f3f3f3",
        cursor: "pointer"
    },
    outcomeName: {
        width: "80%",
        borderRight: "1px solid #ccc"
    },
    outcomePrice: {
        width: "20%",
        textAlign: "center"
    },
});
