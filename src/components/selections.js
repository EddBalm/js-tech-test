import React from "react";
import {StyleSheet, css} from "aphrodite";

//@todo: give selections a greater "call to action"
//@todo: introduce a way to remove a selection without having to click the original outcome
//  Done
export const Selection = ({outcomeId ,outcomeName, marketName, price, onClick}) => {
    const clickhandler = () => {
        onClick(outcomeId);
    };

    return <div className={css(styles.selection)} key={`${outcomeName}-${marketName}`} onClick={clickhandler}>
        {marketName} - {outcomeName} @<b>{price.num}/{price.den}</b>
    </div>;
};

export const Selections = ({outcomes, markets, selections, onSelectionClick}) => {
    const selectedOutcomes = selections.map(id => {
        const outcome = outcomes[id];
        const market = markets[outcome.marketId];
        return {
            onClick: onSelectionClick,
            outcomeId: outcome.outcomeId,
            marketName: market.name,
            outcomeName: outcome.name,
            price: outcome.price
        };
    });

    return (
        <div>
            {selectedOutcomes.map(Selection)}
        </div>
    )
};

const styles = StyleSheet.create({
    "selection": {
        padding: "1em",
        fontFamily: "sans-serif",
        borderBottom: "1px solid #ccc"
    }
});
