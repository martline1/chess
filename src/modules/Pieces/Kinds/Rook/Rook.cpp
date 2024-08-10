#pragma once

#include "Rook.h"

Rook::Rook(PieceParams* params):
    WithRookMoves(),
    WithAnalizeDirections(params)
{
    this->withAnalizeDirectionsImpl->setGameController(
        this->pieceImpl->getGameController()
    );
}

vector<RawPosition> Rook::getPossibleMoves() {
    return this->getPossibleMoves(false);
}

vector<RawPosition> Rook::getPossibleMoves(bool disableCastle = false) {
    RawPosition* rawPosition = this->pieceImpl->getRawPosition();

    StateController state =
        this->withRookMovesImpl->getRookMoves(rawPosition, disableCastle);
    
    vector<RawPosition> moves = this->withAnalizeDirectionsImpl->analizeDirections(&state);

    return this->pieceImpl->filterValidMoves(moves);
}
