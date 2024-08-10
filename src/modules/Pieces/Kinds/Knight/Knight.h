#pragma once

#include <vector>

#include "../../Piece.h"
#include "../../Utils/RawPosition/RawPosition.h"

using std::vector;

class Knight: public Piece<RawPosition> {
    public:
        Knight(PieceParams*);

        virtual vector<RawPosition> getPossibleMoves() override;
};
