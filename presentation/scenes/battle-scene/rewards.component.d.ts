import React from "react";
import { CardPlayType } from "../../../domain/battle";
export interface BattleRewardsComponentProps {
    rewards: {
        money: number;
        cardPlays: CardPlayType[];
    };
    onPurchaseCardPlay: (cardPlay: CardPlayType) => void;
    onPurchasedRewards: () => void;
}
export declare function BattleRewardsComponent(props: BattleRewardsComponentProps): React.ReactElement;
