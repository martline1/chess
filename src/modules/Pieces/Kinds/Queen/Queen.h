#pragma once

#include "../../Utils/RawPosition/RawPosition.h"
#include "../../Utils/WithRookMoves/WithRookMoves.h"
#include "../../Utils/WithBishopMoves/WithBishopMoves.h"
#include "../../Utils/WithAnalizeDirections/WithAnalizeDirections.h"

class Queen:
    public WithAnalizeDirections,
    public WithBishopMoves,
    public WithRookMoves
{
    public:
        Queen(PieceParams*);

        virtual vector<RawPosition> getPossibleMoves() override;
};
