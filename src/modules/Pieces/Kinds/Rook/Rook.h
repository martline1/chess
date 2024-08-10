#pragma once

#include "../../Piece.h"
#include "../../Utils/CastlePiece/CastlePiece.h"
#include "../../Utils/WithRookMoves/WithRookMoves.h"
#include "../../Utils/WithAnalizeDirections/WithAnalizeDirections.h"

class Rook:
    public WithRookMoves,
    public WithAnalizeDirections
{
    public:
        Rook(PieceParams*);

        virtual vector<RawPosition> getPossibleMoves(bool);

        virtual vector<RawPosition> getPossibleMoves() override;
};
