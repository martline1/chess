#pragma once

#include "Knight.h"

Knight::Knight(PieceParams* params):
    Piece<RawPosition>(params)
{}

vector<RawPosition> Knight::getPossibleMoves() {
    RawPosition* rawPosition = this->pieceImpl->getRawPosition();

    int column = rawPosition->getColumn();
    int row    = rawPosition->getRow();

    vector<RawPosition> possibleMoves = vector<RawPosition>();

    possibleMoves.push_back(RawPosition(column - 1, row - 2));
    possibleMoves.push_back(RawPosition(column + 1, row - 2));
    possibleMoves.push_back(RawPosition(column + 2, row - 1));
    possibleMoves.push_back(RawPosition(column + 2, row + 1));
    possibleMoves.push_back(RawPosition(column + 1, row + 2));
    possibleMoves.push_back(RawPosition(column - 1, row + 2));
    possibleMoves.push_back(RawPosition(column - 2, row + 1));
    possibleMoves.push_back(RawPosition(column - 2, row - 1));

    return this->pieceImpl->filterValidMoves(possibleMoves);
}
