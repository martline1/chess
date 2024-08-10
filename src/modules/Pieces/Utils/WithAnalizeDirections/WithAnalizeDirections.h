#pragma once

#include "../CastlePiece/CastlePiece.h"
#include "../../Piece.h"

#include <vector>
#include <memory>

using std::vector;
using std::unique_ptr;
using std::make_unique;

class WithAnalizeDirections: public CastlePiece {
    public:
        class WithAnalizeDirectionsImpl;
        unique_ptr<WithAnalizeDirectionsImpl> withAnalizeDirectionsImpl;

        WithAnalizeDirections(PieceParams*);
};
