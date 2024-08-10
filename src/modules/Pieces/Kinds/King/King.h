#pragma once

#include <cmath>
#include <vector>

#include "../../Piece.h"
#include "../../Utils/CastlePiece/CastlePiece.h"
#include "../../Utils/RawPosition/RawPosition.h"

using std::abs;
using std::vector;

class King: public CastlePiece {
    public:
        King(PieceParams*);

        virtual vector<RawPosition> getPossibleMoves(bool);

        virtual void updatePosition(RawPosition*) override;
        virtual vector<RawPosition> getPossibleMoves() override;
};
