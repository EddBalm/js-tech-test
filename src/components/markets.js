import React, { Component } from "react";
import {values, map, head, assoc} from "ramda";
import {StyleSheet, css} from "aphrodite";
import {firstMarketId} from "../model/markets";

// @todo: Identify visually when a market is showing its outcomes in the middle panel
// - Used assoc to add the currentId to every item in markets, similar to how onClick was added to each.
export const MarketTitle = ({name, outcomes, marketId, onClick, currentId}) => {
    var titleStyle = css(styles.marketTitle);
    const count = outcomes.length;
    const clickHandler = () => {
        onClick(marketId);
    };

    if (marketId == currentId) {
        titleStyle = css(styles.currentMarketTitle);
    };

    return (
        <h2 key={marketId} className={titleStyle} onClick={clickHandler}> 
            {name} <small className={css(styles.betCount)}>({count} bets)</small>
        </h2>
    )
};

// @todo: Identify visually when an outcome is "selected"
export const Outcome = ({name, price, outcomeId, onClick, selected}) => {
    const clickHandler = () => {
        onClick(outcomeId);
    };

    var outcomeCellStyle = css(styles.outcomeCell);

    if (selected) {
        outcomeCellStyle = css(styles.outcomeCellSelected);
    }

    return (
        <div key={outcomeId} className={css(styles.outcome)} onClick={clickHandler}>
            <div className={css(styles.outcomeName, styles.outcomeCell)}>{name}</div>
            <div className={css(styles.outcomePrice, styles.outcomeCell)}>{price.num}/{price.den}</div>
        </div>
    )
};

const pickMarketOutcomes = outcomes => market => market.outcomes.map(id => outcomes[id]);

export const MarketList = ({markets, onMarketClick, currentId}) => {
    const marketList = map(MarketTitle, map(assoc("currentId", currentId), map(assoc("onClick", onMarketClick), markets)));
    return <div className={css(styles.markets)}>{marketList}</div>
};

export const OutcomeList = ({outcomes, onOutcomeClick, market, selections}) => {
    outcomes = map(assoc("selected", false), outcomes);
    const outcomeList = map(Outcome, map(assoc("onClick", onOutcomeClick), pickMarketOutcomes(outcomes)(market)));
    return <div className={css(styles.outcomes)}>{outcomeList}</div>;
}

// @todo: Order Markets by displayOrder
// - Sorted by displayOrder (lowest -> highest). (values(markets)) was sorted, stored and sent to MarketList.
// - Because of this MarketList was changed to use markets instead of (values(markets)). 
// @todo: Could the display of outcomes be abstracted in a testable way (similar to MarketList)?
// - Abstracted to OutcomeList, which is similar to MarketList. Need to demonstrate testability.
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

    marketSort(field) {
        return function(a, b) {
            if( a[field] > b[field]) {
                return 1;
            } else if ( a[field] < b[field]) {
                return -1;
            }
            return 0;
        };
    }

    render() {
        const {onOutcomeClick, outcomes, markets, selections} = this.props;
        const market = markets[this.state.currentMarket];
        const sortedMarkets = (values(markets)).sort(this.marketSort("displayOrder"));
        var currentId = market.marketId;
        const outcomeList = map(Outcome, map(assoc("onClick", onOutcomeClick), pickMarketOutcomes(outcomes)(market)));
        return (
            <div className={css(styles.panel)}>
                <MarketList onMarketClick={this.onMarketClick.bind(this)} markets={sortedMarkets} currentId={currentId}/>
                {/*<div className={css(styles.outcomes)}>{outcomeList}</div>*/}
                <OutcomeList onOutcomeClick={onOutcomeClick} outcomes={outcomes} market={market} selections={selections}/>
            </div>
        )
    }
}

// @todo: How can we make the styles more re-usable?
const styles = StyleSheet.create({
    marketTitle: {
        fontFamily: "sans-serif",
        fontSize: "16px",
        color: "black", 
        backgroundColor: "#FFF",
        borderBottom: "1px solid #ccc",
        margin: 0,
        padding: "1em",
        cursor: "pointer",
    },
    currentMarketTitle: {
        fontFamily: "sans-serif",
        fontSize: "16px",
        color: "white",
        backgroundColor: "#0938B8",
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
