#pragma once

#include "WithBishopMoves.h"

#include "../RawPosition/RawPosition.h"
#include "../StateController/StateController.h"

class WithBishopMoves::WithBishopMovesImpl {
    public:
        WithBishopMovesImpl() {}

        StateController getBishopMoves(RawPosition* position) {
            StateController stateController = StateController();
            State* state = stateController.getState();

            int column = position->getColumn();
            int row    = position->getRow();

            state->insert({
                "++",
                StateContent(
                    false,
                    true,
                    [&](int i) -> RawPosition {
                        return RawPosition(column + i, row + i);
                    }
                )
            });

            state->insert({
                "--",
                StateContent(
                    false,
                    true,
                    [&](int i) -> RawPosition {
                        return RawPosition(column - i, row - i);
                    }
                )
            });

            state->insert({
                "+-",
                StateContent(
                    false,
                    true,
                    [&](int i) -> RawPosition {
                        return RawPosition(column + i, row - i);
                    }
                )
            });

            state->insert({
                "-+",
                StateContent(
                    false,
                    true,
                    [&](int i) -> RawPosition {
                        return RawPosition(column - i, row + i);
                    }
                )
            });

            return stateController;
        }
};

WithBishopMoves::WithBishopMoves():
    withBishopMovesImpl(make_unique<WithBishopMovesImpl>())
{}
