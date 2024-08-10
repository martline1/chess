#pragma once

#include <cmath>
#include <memory>

using std::floor;
using std::unique_ptr;
using std::make_unique;

#include "PossibleMoveParams/PossibleMoveParams.h"

class PossibleMove {
    public:
        class PossibleMoveImpl;
        unique_ptr<PossibleMoveImpl> possibleMoveImpl;

        PossibleMove(PossibleMoveParams*);

        void render();
        void onPointerDown(int, int);
        bool isBeingHovered(int, int);
};
