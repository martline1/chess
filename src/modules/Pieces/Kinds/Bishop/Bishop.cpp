#pragma once

#include "Bishop.h"

Bishop::Bishop(PieceParams* params):
    WithBishopMoves(),
    WithAnalizeDirections(params)
{
    this->withAnalizeDirectionsImpl->setGameController(
        this->pieceImpl->getGameController()
    );
}

vector<RawPosition> Bishop::getPossibleMoves() {
    RawPosition* rawPosition = this->pieceImpl->getRawPosition();

    StateController state = this->withBishopMovesImpl->getBishopMoves(rawPosition);

    vector<RawPosition> moves = this->withAnalizeDirectionsImpl->analizeDirections(&state);

    return this->pieceImpl->filterValidMoves(moves);
}
