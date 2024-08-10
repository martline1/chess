#pragma once

#include "../../Utils/WithBishopMoves/WithBishopMoves.h"
#include "../../Utils/WithAnalizeDirections/WithAnalizeDirections.h"

class Bishop:
    public WithBishopMoves,
    public WithAnalizeDirections
{
    public:
        Bishop(PieceParams*);

        virtual vector<RawPosition> getPossibleMoves() override;
};
