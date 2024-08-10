#pragma once

#include "Queen.h"

Queen::Queen(PieceParams* params):
    WithRookMoves(),
    WithBishopMoves(),
    WithAnalizeDirections(params)
{
    this->withAnalizeDirectionsImpl->setGameController(
        this->pieceImpl->getGameController()
    );
}

vector<RawPosition> Queen::getPossibleMoves() {
    RawPosition* rawPosition = this->pieceImpl->getRawPosition();

    StateController bishopState = this->withBishopMovesImpl->getBishopMoves(rawPosition);

    vector<RawPosition> bishopMoves = this->withAnalizeDirectionsImpl->analizeDirections(&bishopState);

    StateController rookState = this->withRookMovesImpl->getRookMoves(rawPosition, true);

    vector<RawPosition> rookMoves = this->withAnalizeDirectionsImpl->analizeDirections(&rookState);

    vector<RawPosition> queenMoves = vector<RawPosition>();

    for (RawPosition position: bishopMoves) {
        queenMoves.push_back(position);
    }

    for (RawPosition position: rookMoves) {
        queenMoves.push_back(position);
    }

    return queenMoves;
}
