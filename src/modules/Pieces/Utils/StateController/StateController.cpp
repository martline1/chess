#pragma once

#include "StateController.h"

#include "../RawPosition/RawPosition.h"

struct StateContent {
    bool enableCastle;
    bool shouldContinue;
    function<RawPosition(int)> getPosition;

    StateContent(
        bool enableCastle,
        bool shouldContinue,
        function<RawPosition(int)> getPosition
    ):
        getPosition(getPosition),
        enableCastle(enableCastle),
        shouldContinue(shouldContinue)
    {}
};

StateController::StateController():
    state(State())
{}

State* StateController::getState() {
    return &this->state;
}
