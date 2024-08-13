#pragma once

#include "WithRookMoves.h"

#include "../RawPosition/RawPosition.h"
#include "../StateController/StateController.h"
#include "../../../Common/InstanceOf/InstanceOf.h"

class WithRookMoves::WithRookMovesImpl {
    public:
        WithRookMovesImpl() {}

        virtual ~WithRookMovesImpl() = default;

        StateController getRookMoves(RawPosition* position, bool disableCastle = false) {
            StateController stateController = StateController();
            State* state = stateController.getState();

            int column = position->getColumn();
            int row    = position->getRow();

            state->insert({
                "up",
                StateContent(
                    false,
                    true,
                    [=](int i) -> RawPosition {
                        return RawPosition(column, row - i);
                    }
                )
            });

            state->insert({
                "down",
                StateContent(
                    false,
                    true,
                    [=](int i) -> RawPosition {
                        return RawPosition(column, row + i);
                    }
                )
            });

            state->insert({
                "left",
                StateContent(
                    // Enable castle if:
                    !disableCastle && InstanceOf::check<Rook>(this),
                    true,
                    [=](int i) -> RawPosition {
                        return RawPosition(column - i, row);
                    }
                )
            });

            state->insert({
                "right",
                StateContent(
                    // Enable castle if:
                    !disableCastle && InstanceOf::check<Rook>(this),
                    true,
                    [=](int i) -> RawPosition {
                        return RawPosition(column + i, row);
                    }
                )
            });

            return stateController;
        }
};

WithRookMoves::WithRookMoves():
    withRookMovesImpl(make_unique<WithRookMovesImpl>())
{}
