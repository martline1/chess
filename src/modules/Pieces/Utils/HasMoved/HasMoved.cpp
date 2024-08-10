#pragma once

#include "HasMoved.h"

HasMoved::HasMoved(PieceParams* params):
    Piece<RawPosition>(params),
    hasMoved(false)
{}

bool HasMoved::getHasMoved() {
    return this->hasMoved;
}

void HasMoved::onMoveEnd(int column, int row) {
    Piece::onMoveEnd(column, row);

    this->hasMoved = true;
}